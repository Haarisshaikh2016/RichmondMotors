// community.js
// Public community messages + send to admin queue (frontend-only)

const COMMUNITY_STORAGE_KEY = "rm_community_messages";
const ANNOUNCEMENTS_KEY = "rm_announcements";

function loadAnnouncementsPublic() {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadCommunityMessages() {
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCommunityMessages(list) {
  localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(list));
}


// Render site announcements on community page
(function () {
  const container = document.getElementById("publicAnnouncements");
  if (!container) return;

  const announcements = loadAnnouncementsPublic();
  if (!announcements.length) {
    container.innerHTML = '<p class="text-muted">No site announcements yet.</p>';
    return;
  }

  announcements.forEach((a) => {
    const div = document.createElement("div");
    div.className = "announcement-banner";
    div.textContent = a.text;
    container.appendChild(div);
  });
})();
(function () {
  const form = document.getElementById("communityForm");
  const publicList = document.getElementById("publicMessages");
  if (!form || !publicList) return;

  function renderPublicMessages() {
    const messages = loadCommunityMessages().filter((m) => !!m.answer);
    publicList.innerHTML = "";

    if (messages.length === 0) {
      publicList.innerHTML = `
        <li class="message-card text-muted">
          No answered community questions yet (entries you can edit here).
        </li>`;
      return;
    }

    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.className = "message-card";
      li.innerHTML = `
        <strong>${msg.name}</strong>
        ${msg.email ? `<span class="text-muted"> • ${msg.email}</span>` : ""}
        <p><em>Q:</em> ${msg.message}</p>
        <p><em>Richmond Motors (enter here):</em> ${msg.answer}</p>
      `;
      publicList.appendChild(li);
    });
  }

  renderPublicMessages();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("communityName").value.trim();
    const email = document.getElementById("communityEmail").value.trim();
    const message = document.getElementById("communityMessage").value.trim();

    if (!name || !message) {
      alert("Please fill in the name and message entries you can edit here.");
      return;
    }

    const messages = loadCommunityMessages();
    const newMsg = {
      id: Date.now().toString(),
      name,
      email,
      message,
      answer: null
    };
    messages.unshift(newMsg);
    saveCommunityMessages(messages);

    form.reset();
    alert("Your enter here message has been sent to the admin queue.");
  });
})();
