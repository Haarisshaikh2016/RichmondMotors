// vehicles.js
// Storage + listing + details for vehicles

const VEHICLE_STORAGE_KEY = "rm_all_vehicles";

function loadVehicleArray() {
  try {
    const raw = localStorage.getItem(VEHICLE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistVehicleArray(arr) {
  localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(arr));
}

function ensureVehiclesSeeded() {
  const existing = loadVehicleArray();
  if (existing) return existing;

  const SEED = [
    {
      id: "1",
      title: "Enter vehicle title here",
      manufacturer: "Enter manufacturer here",
      price: "Enter price here",
      mileage: "Enter mileage here",
      fuel: "Enter fuel type here",
      transmission: "Enter transmission here",
      year: "Enter year here",
      images: ["sampleimg.jpeg"],
      videoUrl: "",
      description: "Enter vehicle description here",
      specs: {
        "Body Style": "Enter body style here",
        "Engine Size": "Enter engine size here",
        "Colour": "Enter colour here",
        "Owners": "Enter number of owners here",
        "MOT Status": "Enter MOT status here",
        "Service History": "Enter service history here"
      }
    }
  ];

  persistVehicleArray(SEED);
  return SEED;
}

function getAllVehicles() {
  return ensureVehiclesSeeded();
}

function saveAllVehicles(nextArray) {
  persistVehicleArray(nextArray);
}

(function () {
  window.rmVehicles = {
    getAllVehicles,
    saveAllVehicles,
    VEHICLE_STORAGE_KEY
  };
})();


// =============================
// VEHICLE LIST PAGE (vehicles.html)
// =============================
(function () {
  const listContainer = document.getElementById("vehicleList");
  if (!listContainer) return;

  const vehicles = getAllVehicles();
  listContainer.innerHTML = "";

  listContainer.classList.add("vehicle-grid");

  vehicles.forEach((v) => {
    const card = document.createElement("article");
    card.className = "vehicle-card";

    const primaryImage =
      (Array.isArray(v.images) && v.images.length > 0 && v.images[0])
        ? v.images[0]
        : "sampleimg.jpeg";

    card.innerHTML = `
      <img src="${primaryImage}" alt="${v.title}" />

      <h3>${v.title}</h3>

      <p class="vehicle-meta">
        ${v.manufacturer || ""} • ${v.year || ""}
      </p>

      <div class="vehicle-price">${v.price}</div>

      <button class="btn btn-primary" data-view-id="${v.id}">
        View Details
      </button>
    `;

    listContainer.appendChild(card);
  });

  listContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-id]");
    if (!btn) return;

    const vid = btn.getAttribute("data-view-id");
    window.location.href = `vehicle-details.html?id=${encodeURIComponent(vid)}`;
  });
})();


// =============================
// VEHICLE DETAILS PAGE (vehicle-details.html)
// =============================
(function () {
  const detailsRoot = document.getElementById("vehicleDetailsRoot");
  if (!detailsRoot) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const vehicles = getAllVehicles();
  let v = vehicles.find((x) => x.id === id);

  if (!v) {
    detailsRoot.innerHTML = "<p>Vehicle not found.</p>";
    return;
  }

  const images = Array.isArray(v.images) ? v.images : [];
  const mainImage = images.length ? images[0] : "sampleimg.jpeg";

  // specs table
  const specs = v.specs || {};
  const specsRows = Object.entries(specs)
    .map(([k, val]) => `<tr><th>${k}</th><td>${val}</td></tr>`)
    .join("");

  // Render page layout
  detailsRoot.innerHTML = `
    <div class="vehicle-details-container">

      <!-- LEFT SIDE -->
      <section class="vehicle-images-section">
        <img id="mainVehicleImage" src="${mainImage}" class="vehicle-main-img">

        <div id="thumbnailStrip" class="thumbnail-strip"></div>

        <h3>Media</h3>
        ${
          images.length === 0
            ? `<p class="text-muted">No images available for this vehicle.</p>`
            : ``
        }

      </section>

      <!-- RIGHT SIDE -->
      <aside class="vehicle-enquiry-section card">
        <h3>Contact About This Vehicle</h3>

        <form id="vehicleEnquiryForm" class="form">
          <div class="form-group">
            <label>Your Name</label>
            <input id="enqName" type="text" placeholder="Enter your name here" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input id="enqEmail" type="email" placeholder="Enter your email here" />
          </div>

          <div class="form-group">
            <label>Message</label>
            <textarea id="enqMsg" rows="4" placeholder="Enter your message here"></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Submit Enquiry</button>

          <p class="text-muted" style="margin-top:0.5rem;">
            This enquiry will be sent to the admin dashboard for review.
          </p>
        </form>
      </aside>

    </div>

    <div class="card" style="margin-top:2rem;">
      <h2>${v.title}</h2>
      <p>${v.manufacturer}</p>
      <div class="vehicle-price">${v.price}</div>
      <p class="text-muted">${v.year} • ${v.mileage} • ${v.fuel} • ${v.transmission}</p>
    </div>

    <div class="card" style="margin-top:1.5rem;">
      <h3>Description</h3>
      <p>${v.description}</p>

      <h3 style="margin-top:1rem;">Specifications</h3>
      <table class="specs-table">
        <tbody>${specsRows}</tbody>
      </table>
    </div>
  `;

  // Build thumbnail strip
  const mainImgEl = document.getElementById("mainVehicleImage");
  const strip = document.getElementById("thumbnailStrip");

  if (images.length > 0) {
    images.slice(0, 10).forEach((src) => {
      const t = document.createElement("img");
      t.src = src;
      t.className = "thumbnail-img";

      t.onclick = () => {
        mainImgEl.src = src;
      };

      strip.appendChild(t);
    });
  }

  // Enquiry handler
  const enquiryForm = document.getElementById("vehicleEnquiryForm");
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("enqName").value.trim();
    const email = document.getElementById("enqEmail").value.trim();
    const msg = document.getElementById("enqMsg").value.trim();

    if (!name || !msg) {
      alert("Please enter your name and message.");
      return;
    }

    const ENQ_KEY = "rm_vehicle_enquiries";
    const existing = JSON.parse(localStorage.getItem(ENQ_KEY) || "[]");

    existing.push({
      id: Date.now().toString(),
      vehicleId: v.id,
      vehicleTitle: v.title,
      name,
      email,
      message: msg,
      createdAt: new Date().toISOString(),
      status: "open"
    });

    localStorage.setItem(ENQ_KEY, JSON.stringify(existing));

    alert("Your enquiry has been submitted.");
    enquiryForm.reset();
  });
})();
