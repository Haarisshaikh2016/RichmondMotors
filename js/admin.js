// ===============================
// ADMIN CONFIG / SESSION HELPERS
// ===============================
const ADMIN_ALLOWED = [
  "haaris@richmondmotors.co.uk",
  "haider@richmondmotors.co.uk",
  "shakeel@richmondmotors.co.uk",
  "shaista@richmondmotors.co.uk"
];

const ADMIN_PASSWORD = "1234";
const ADMIN_SESSION_KEY = "rm_admin_logged_in";

function getAdminSession() {
  return localStorage.getItem(ADMIN_SESSION_KEY);
}

function setAdminSession(email) {
  if (email) {
    localStorage.setItem(ADMIN_SESSION_KEY, email);
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Simple JSON helpers
function loadJson(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===============================
// ADMIN LOGIN PAGE LOGIC
// ===============================
(function () {
  const loginForm = document.getElementById("adminLoginForm");
  if (!loginForm) return; // Not on admin-login page

  const msg = document.getElementById("adminLoginMessage");

  // If already logged in, show info instead of auto-redirecting
  const existing = getAdminSession();
  if (existing && msg) {
    msg.textContent = `You are currently logged in as ${existing}. You can continue to the dashboard or log out from there if needed.`;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("adminEmail");
    const passEl = document.getElementById("adminPassword");

    const email = emailEl.value.trim().toLowerCase();
    const password = passEl.value.trim();

    if (!ADMIN_ALLOWED.includes(email)) {
      msg.textContent = "Admin email not recognised.";
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      msg.textContent = "Incorrect password.";
      return;
    }

    // Save session + redirect
    setAdminSession(email);
    msg.textContent = "Login successful.";
    window.location.href = "admin-dashboard.html";
  });
})();

// ===============================
// ADMIN DASHBOARD PAGE LOGIC
// ===============================
(function () {
  const dashRoot = document.getElementById("adminDashboardRoot");
  if (!dashRoot) return; // Not on dashboard page

  // Protect dashboard
  const sessionEmail = getAdminSession();
  if (!sessionEmail) {
    window.location.href = "admin-login.html";
    return;
  }

  // Show logged-in status
  const statusEl = document.getElementById("adminStatusText");
  if (statusEl) {
    statusEl.textContent = `Logged in as ${sessionEmail}`;
  }

  // Logout
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setAdminSession(null);
      window.location.href = "admin-login.html";
    });
  }

  // ==========================
  // COMMUNITY QUEUE
  // ==========================
  const COMMUNITY_KEY = "rm_community_messages";

  function loadCommunityMessages() {
    return loadJson(COMMUNITY_KEY, []);
  }

  function saveCommunityMessages(list) {
    saveJson(COMMUNITY_KEY, list);
  }

  const queueList = document.getElementById("adminQueueList");
  const answeredList = document.getElementById("adminAnsweredList");

  function renderMessageLists() {
    const all = loadCommunityMessages();
    const pending = all.filter((m) => !m.answer);
    const answered = all.filter((m) => !!m.answer);

    // Pending
    if (queueList) {
      queueList.innerHTML = "";
      if (!pending.length) {
        queueList.innerHTML =
          `<li class="text-muted">No pending messages in the queue.</li>`;
      } else {
        pending.forEach((m) => {
          const li = document.createElement("li");
          li.className = "message-card";
          li.innerHTML = `
            <strong>${m.name}</strong>
            ${m.email ? `<span class="text-muted"> • ${m.email}</span>` : ""}
            <p>${m.message}</p>
            <button class="btn btn-secondary" data-edit-question-id="${m.id}">Edit Question</button>
            <button class="btn btn-primary" data-answer-id="${m.id}">Add Answer</button>
          `;
          queueList.appendChild(li);
        });
      }
    }

    // Answered
    if (answeredList) {
      answeredList.innerHTML = "";
      if (!answered.length) {
        answeredList.innerHTML =
          `<li class="text-muted">No answered messages yet.</li>`;
      } else {
        answered.forEach((m) => {
          const li = document.createElement("li");
          li.className = "message-card";
          li.innerHTML = `
            <strong>${m.name}</strong>
            ${m.email ? `<span class="text-muted"> • ${m.email}</span>` : ""}
            <p><em>Q:</em> ${m.message}</p>
            <p><em>A:</em> ${m.answer}</p>
            <button class="btn btn-secondary" data-edit-answered-id="${m.id}">Edit Q & A</button>
            <button class="btn btn-secondary" data-delete-answered-id="${m.id}">Remove</button>
          `;
          answeredList.appendChild(li);
        });
      }
    }
  }

  if (queueList) {
    queueList.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-edit-question-id]");
      const answerBtn = e.target.closest("[data-answer-id]");
      const msgs = loadCommunityMessages();

      if (editBtn) {
        const id = editBtn.getAttribute("data-edit-question-id");
        const msg = msgs.find((m) => m.id === id);
        if (!msg) return;
        const newQ = prompt("Edit question enter here:", msg.message);
        if (newQ && newQ.trim()) {
          msg.message = newQ.trim();
          saveCommunityMessages(msgs);
          renderMessageLists();
        }
      }

      if (answerBtn) {
        const id = answerBtn.getAttribute("data-answer-id");
        const msg = msgs.find((m) => m.id === id);
        if (!msg) return;
        const ans = prompt("Enter enter here answer:", msg.answer || "");
        if (ans && ans.trim()) {
          msg.answer = ans.trim();
          saveCommunityMessages(msgs);
          renderMessageLists();
        }
      }
    });
  }

  if (answeredList) {
    answeredList.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-edit-answered-id]");
      const delBtn = e.target.closest("[data-delete-answered-id]");
      let msgs = loadCommunityMessages();

      if (editBtn) {
        const id = editBtn.getAttribute("data-edit-answered-id");
        const msg = msgs.find((m) => m.id === id);
        if (!msg) return;
        const newQ = prompt("Edit question:", msg.message);
        const newA = prompt("Edit answer:", msg.answer || "");
        if (newQ && newQ.trim()) msg.message = newQ.trim();
        if (newA && newA.trim()) msg.answer = newA.trim();
        saveCommunityMessages(msgs);
        renderMessageLists();
      }

      if (delBtn) {
        const id = delBtn.getAttribute("data-delete-answered-id");
        msgs = msgs.filter((m) => m.id !== id);
        saveCommunityMessages(msgs);
        renderMessageLists();
      }
    });
  }

  renderMessageLists();

  
  // ==========================
  // CUSTOMER ENQUIRIES (from vehicle pages)
  // ==========================
  const ENQUIRIES_KEY = "rm_vehicle_enquiries";
  const enquiriesList = document.getElementById("adminEnquiriesList");

  function loadEnquiries() {
    return loadJson(ENQUIRIES_KEY, []);
  }

  function saveEnquiries(list) {
    saveJson(ENQUIRIES_KEY, list);
  }

  function renderEnquiries() {
    if (!enquiriesList) return;

    const list = loadEnquiries();
    enquiriesList.innerHTML = "";

    if (!list.length) {
      enquiriesList.innerHTML =
        '<li class="message-card text-muted">No customer enquiries yet.</li>';
      return;
    }

    list.forEach((e) => {
      const li = document.createElement("li");
      li.className = "message-card";
      li.innerHTML = `
        <strong>${e.name || "Customer"}</strong>
        ${e.email ? `<span class="text-muted"> • ${e.email}</span>` : ""}
        <p><em>Vehicle:</em> ${e.vehicleTitle || "[Vehicle]"}</p>
        <p><em>Message:</em> ${e.message}</p>
        <p class="text-muted"><em>Status:</em> ${e.status || "open"}</p>
        <button class="btn btn-secondary" data-toggle-enquiry-status="${e.id}">Toggle Resolved</button>
        <button class="btn btn-secondary" data-remove-enquiry="${e.id}">Dismiss</button>
      `;
      enquiriesList.appendChild(li);
    });
  }

  if (enquiriesList) {
    enquiriesList.addEventListener("click", (event) => {
      const toggleBtn = event.target.closest("[data-toggle-enquiry-status]");
      const removeBtn = event.target.closest("[data-remove-enquiry]");
      if (!toggleBtn && !removeBtn) return;

      let list = loadEnquiries();

      if (toggleBtn) {
        const id = toggleBtn.getAttribute("data-toggle-enquiry-status");
        const item = list.find((x) => x.id === id);
        if (item) {
          item.status = item.status === "resolved" ? "open" : "resolved";
          saveEnquiries(list);
          renderEnquiries();
        }
      }

      if (removeBtn) {
        const id = removeBtn.getAttribute("data-remove-enquiry");
        list = list.filter((x) => x.id !== id);
        saveEnquiries(list);
        renderEnquiries();
      }
    });
  }

  renderEnquiries();

// ==========================
  // VEHICLE MANAGEMENT (FULLY LINKED TO vehicles.js)
// ==========================
  const vehiclesTableBody = document.getElementById("adminVehiclesTableBody");
  const vehicleForm = document.getElementById("adminVehicleForm");

  function getVehicles() {
    if (!window.rmVehicles) return [];
    return window.rmVehicles.getAllVehicles();
  }

  function saveVehicles(list) {
    if (!window.rmVehicles) return;
    window.rmVehicles.saveAllVehicles(list);
  }

  function renderAdminVehicles() {
    if (!vehiclesTableBody) return;

    const vehicles = getVehicles();
    vehiclesTableBody.innerHTML = "";

    if (!vehicles.length) {
      vehiclesTableBody.innerHTML =
        `<tr><td colspan="4" class="text-muted">No vehicle entries you can edit here yet.</td></tr>`;
      return;
    }

    vehicles.forEach((v, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.title}</td>
        <td>${v.price || ""}</td>
        <td>${v.year || ""}</td>
        <td>
          <button class="btn btn-secondary" data-edit-vehicle="${idx}">Edit</button>
          <button class="btn btn-secondary" data-remove-vehicle="${idx}">Remove</button>
        </td>
      `;
      vehiclesTableBody.appendChild(tr);
    });
  }

if (vehicleForm && window.rmVehicles) {
  vehicleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = adminVehicleTitle.value.trim();
    const manufacturer = adminVehicleManufacturer.value.trim();
    const price = adminVehiclePrice.value.trim();
    const mileage = adminVehicleMileage.value.trim();
    const fuel = adminVehicleFuel.value.trim();
    const transmission = adminVehicleTransmission.value.trim();
    const year = adminVehicleYear.value.trim();
    const description = adminVehicleDescription.value.trim();

    const specBody = adminVehicleSpecBody.value.trim();
    const specEngine = adminVehicleSpecEngine.value.trim();
    const specColour = adminVehicleSpecColour.value.trim();
    const specOwners = adminVehicleSpecOwners.value.trim();
    const specMOT = adminVehicleSpecMOT.value.trim();
    const specHistory = adminVehicleSpecHistory.value.trim();

    const imagesCsv = adminVehicleImages.value.trim();
    const videoUrl = adminVehicleVideo.value.trim();
    const imageFilesInput = document.getElementById("adminVehicleImageFiles");
    const fileList = imageFilesInput ? Array.from(imageFilesInput.files || []) : [];

    if (!title || !price) {
      alert("Please enter a title and price.");
      return;
    }

    const urlImages = imagesCsv
      ? imagesCsv.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    let fileImages = [];
    if (fileList.length) {
      // Convert uploaded files to data URLs so they can be stored in localStorage
      fileImages = await Promise.all(
        fileList.slice(0, 10).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            })
        )
      );
    }

    const allImages = [...fileImages, ...urlImages].slice(0, 10);

    const vehicles = window.rmVehicles.getAllVehicles();

    const newVehicle = {
      id: Date.now().toString(),
      title,
      manufacturer,
      price,
      mileage,
      fuel,
      transmission,
      year,
      description: description || "Enter detailed vehicle description here.",
      images: allImages.length ? allImages : Array.from({ length: 1 }, () => "sampleimg.jpeg"),
      videoUrl,
      specs: {
        "Body Style": specBody || "Enter body style here",
        "Engine Size": specEngine || "Enter engine size here",
        "Colour": specColour || "Enter colour here",
        "Owners": specOwners || "Enter number of previous owners here",
        "MOT Status": specMOT || "Enter MOT status here",
        "Service History": specHistory || "Enter service history details here"
      }
    };

    vehicles.push(newVehicle);
    window.rmVehicles.saveAllVehicles(vehicles);

    if (imageFilesInput) {
      imageFilesInput.value = "";
    }
    vehicleForm.reset();
    renderAdminVehicles();
  });
}
  if (vehiclesTableBody && window.rmVehicles) {
    vehiclesTableBody.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-edit-vehicle]");
      const removeBtn = e.target.closest("[data-remove-vehicle]");
      if (!editBtn && !removeBtn) return;

      const idx = parseInt(
        (editBtn || removeBtn).getAttribute(
          editBtn ? "data-edit-vehicle" : "data-remove-vehicle"
        ),
        10
      );

      const vehicles = getVehicles();
      if (Number.isNaN(idx) || idx < 0 || idx >= vehicles.length) return;

      if (removeBtn) {
        if (!confirm("Remove this vehicle enter here?")) return;
        vehicles.splice(idx, 1);
        saveVehicles(vehicles);
        renderAdminVehicles();
      } else if (editBtn) {
        const v = vehicles[idx];
        const title =
          prompt("Edit title:", v.title) || v.title;
        const manufacturer =
          prompt("Edit manufacturer:", v.manufacturer || "") || v.manufacturer;
        const price =
          prompt("Edit price:", v.price || "") || v.price;
        const year =
          prompt("Edit year:", v.year || "") || v.year;
        const mileage =
          prompt("Edit mileage:", v.mileage || "") || v.mileage;
        const fuel =
          prompt("Edit fuel type:", v.fuel || "") || v.fuel;
        const transmission =
          prompt("Edit transmission:", v.transmission || "") || v.transmission;
        const description =
          prompt(
            "Edit description:",
            v.description || "[Vehicle Description enter here – details to be added.]"
          ) || v.description;
        const imagesCsv = prompt(
          "Edit image URLs (comma-separated, up to 10):",
          (Array.isArray(v.images) ? v.images : []).join(", ")
        );
        const videoUrl =
          prompt("Edit video URL:", v.videoUrl || "") || v.videoUrl;

        v.title = title.trim();
        v.manufacturer = manufacturer.trim();
        v.price = price.trim();
        v.year = year.trim();
        v.mileage = mileage.trim();
        v.fuel = fuel.trim();
        v.transmission = transmission.trim();
        v.description = description.trim();
        if (imagesCsv !== null) {
          const imgs = imagesCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 10);
          v.images = imgs.length
            ? imgs
            : Array.from({ length: 6 }, () => "sampleimg.jpeg");
        }
        v.videoUrl = videoUrl.trim();

        saveVehicles(vehicles);
        renderAdminVehicles();
      }
    });
  }

  renderAdminVehicles();

  // ==========================
  // SERVICE MANAGEMENT
  // ==========================
  const ADMIN_SERVICES_KEY = "rm_admin_services";
  const servicesTableBody = document.getElementById("adminServicesTableBody");
  const serviceForm = document.getElementById("adminServiceForm");

  function loadServicesAdmin() {
    return loadJson(ADMIN_SERVICES_KEY, []);
  }

  function saveServicesAdmin(list) {
    saveJson(ADMIN_SERVICES_KEY, list);
  }

  function renderAdminServices() {
    if (!servicesTableBody) return;

    const services = loadServicesAdmin();
    servicesTableBody.innerHTML = "";

    if (!services.length) {
      servicesTableBody.innerHTML =
        `<tr><td colspan="3" class="text-muted">No admin-added service entries you can edit here yet.</td></tr>`;
      return;
    }

    services.forEach((s, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.description}</td>
        <td>
          <button class="btn btn-secondary" data-edit-service="${idx}">Edit</button>
          <button class="btn btn-secondary" data-remove-service="${idx}">Remove</button>
        </td>
      `;
      servicesTableBody.appendChild(tr);
    });
  }

if (adminServiceForm) {
  adminServiceForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = adminServiceName.value.trim();
    const description = adminServiceDescription.value.trim();
    const image = adminServiceImage.value.trim() || "sampleimg.jpeg";
    const cost = adminServiceCost.value.trim();
    const time = adminServiceTime.value.trim();
    const category = adminServiceCategory.value.trim();

    if (!name || !description) {
      alert("Please fill in name and description.");
      return;
    }

    const list = loadServicesAdmin();

    list.push({
      name,
      description,
      image,
      cost: cost || "[Cost enter here]",
      time: time || "[Duration enter here]",
      category: category || "[Category enter here]"
    });

    saveServicesAdmin(list);
    adminServiceForm.reset();
    renderAdminServices();
  });
}


  if (servicesTableBody) {
    servicesTableBody.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-edit-service]");
      const removeBtn = e.target.closest("[data-remove-service]");
      if (!editBtn && !removeBtn) return;

      let services = loadServicesAdmin();
      const idx = parseInt(
        (editBtn || removeBtn).getAttribute(
          editBtn ? "data-edit-service" : "data-remove-service"
        ),
        10
      );
      if (Number.isNaN(idx) || idx < 0 || idx >= services.length) return;

      if (removeBtn) {
        if (!confirm("Remove this service enter here?")) return;
        services.splice(idx, 1);
        saveServicesAdmin(services);
        renderAdminServices();
      } else if (editBtn) {
        const s = services[idx];
        const name =
          prompt("Edit service name:", s.name) || s.name;
        const description =
          prompt("Edit service description:", s.description) || s.description;
        const image =
          prompt("Edit service image URL:", s.image || "sampleimg.jpeg") ||
          s.image ||
          "sampleimg.jpeg";

        s.name = name.trim();
        s.description = description.trim();
        s.image = image.trim();
        saveServicesAdmin(services);
        renderAdminServices();
      }
    });
  }

  renderAdminServices();

  // ==========================
  // ANNOUNCEMENTS
  // ==========================
  const ANNOUNCEMENTS_KEY = "rm_announcements";
  const announcementForm = document.getElementById("announcementForm");
  const announcementList = document.getElementById("announcementList");

  function renderAnnouncements() {
    if (!announcementList) return;

    const list = loadJson(ANNOUNCEMENTS_KEY, []);
    announcementList.innerHTML = "";

    if (!list.length) {
      announcementList.innerHTML =
        `<p class="text-muted">No site announcements yet.</p>`;
      return;
    }

    list.forEach((a, idx) => {
      const div = document.createElement("div");
      div.className = "announcement-banner";
      div.innerHTML = `
        ${a.text}
        <button class="btn btn-secondary" data-remove-announcement="${idx}" style="float:right;">
          Remove
        </button>
      `;
      announcementList.appendChild(div);
    });
  }

  if (announcementForm) {
    announcementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("announcementText").value.trim();
      if (!text) {
        alert("Please enter announcement enter here text.");
        return;
      }
      const list = loadJson(ANNOUNCEMENTS_KEY, []);
      list.unshift({ text });
      saveJson(ANNOUNCEMENTS_KEY, list);
      announcementForm.reset();
      renderAnnouncements();
    });
  }

  if (announcementList) {
    announcementList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-announcement]");
      if (!btn) return;
      const idx = parseInt(btn.getAttribute("data-remove-announcement"), 10);
      const list = loadJson(ANNOUNCEMENTS_KEY, []);
      list.splice(idx, 1);
      saveJson(ANNOUNCEMENTS_KEY, list);
      renderAnnouncements();
    });
  }

  renderAnnouncements();
})();
