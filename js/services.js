const ADMIN_SERVICES_KEY = "rm_admin_services";

function loadServicesPublic() {
  try {
    const raw = localStorage.getItem(ADMIN_SERVICES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

(function () {
  const container = document.getElementById("servicesList");
  if (!container) return;

  const services = loadServicesPublic();
  container.innerHTML = "";

  services.forEach((s) => {
    const card = document.createElement("article");
    card.className = "card";

    const imgSrc = s.image || "sampleimg.jpeg";

    card.innerHTML = `
      <img src="${imgSrc}" style="width:100%;border-radius:0.7rem;max-height:200px;object-fit:cover;" />
      <h3>${s.name}</h3>
      <p>${s.description}</p>

      <p><strong>Avg Cost:</strong> ${s.cost || "[Cost enter here]"}</p>
      <p><strong>Estimated Time:</strong> ${s.time || "[Duration enter here]"}</p>
      <p><strong>Category:</strong> ${s.category || "[Category enter here]"}</p>
    `;

    container.appendChild(card);
  });
})();
