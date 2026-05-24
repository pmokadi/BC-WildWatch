const API_BASE_URL = "http://localhost:5000/api";
const MODEL_API_URL = "";
const GEMINI_FEEDBACK_API_URL = "";

console.log("APP JS LOADED", API_BASE_URL);

function currentUser() {
  return JSON.parse(localStorage.getItem("bcww_user") || "null");
}

function setUser(user) {
  localStorage.setItem("bcww_user", JSON.stringify(user));
}

function signOut() {
  localStorage.removeItem("bcww_user");
  location.href = "index.html";
}

function flash(message, type = "success") {
  const box = document.querySelector("[data-flash]");
  if (!box) return;

  box.className = `rounded-xl border px-4 py-3 text-sm font-semibold ${
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : "bg-red-50 border-red-200 text-red-800"
  }`;

  box.textContent = message;
  box.hidden = false;
}

function requireUser() {
  if (!currentUser()) {
    location.href = "login.html";
    return false;
  }
  return true;
}

function initLayout() {
  const user = currentUser();
  const authSlot = document.querySelector("[data-auth-slot]");
  const mobileAuthSlot = document.querySelector("[data-mobile-auth-slot]");
  const desktopNav =
    document.querySelector("header nav") ||
    document.querySelector('nav[class*="md:flex"]');
  const mobileNav = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");

  const desktopAlreadyHasAdmin =
    desktopNav &&
    (desktopNav.querySelector('[data-admin-link]') ||
      desktopNav.querySelector('a[href="admin.html"]'));

  const mobileAlreadyHasAdmin =
    mobileNav &&
    (mobileNav.querySelector('[data-admin-link]') ||
      mobileNav.querySelector('a[href="admin.html"]'));

  if (desktopNav && user?.role === "admin" && !desktopAlreadyHasAdmin) {
    desktopNav.insertAdjacentHTML(
      "beforeend",
      `<a href="admin.html" class="text-[#e60a18] font-bold" data-admin-link>Admin</a>`
    );
  }

  if (mobileNav && user?.role === "admin" && !mobileAlreadyHasAdmin) {
    mobileNav.insertAdjacentHTML(
      "beforeend",
      `<a href="admin.html" class="font-bold py-2 text-[#e60a18]" data-admin-link>Admin</a>`
    );
  }

  if (authSlot) {
    authSlot.innerHTML = user
      ? `<button class="text-sm font-bold hover:text-[#e60a18]" data-logout>Logout</button>`
      : `<a href="login.html" class="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50"><i data-lucide="user" class="w-6 h-6 text-slate-600"></i></a>`;
  }

  if (mobileAuthSlot) {
    mobileAuthSlot.innerHTML = user
      ? `<button class="font-bold py-2 text-left" data-logout>Logout</button>`
      : `<a href="login.html" class="font-bold py-2">Login</a>`;
  }

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", signOut);
  });

  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("hidden"));
  }

  if (window.lucide) lucide.createIcons();
}

function initSignup() {
  const formEl = document.querySelector("[data-signup-form]");
  if (!formEl) return;

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("SIGNUP SUBMIT FIRED");

    const form = new FormData(event.target);
    const fullName = form.get("full_name")?.trim();
    const email = form.get("email")?.trim().toLowerCase();
    const password = form.get("password");
    const confirmPassword = form.get("confirm_password");

    if (password !== confirmPassword) {
      flash("Passwords do not match.", "error");
      return;
    }

    if (!password || password.length < 8) {
      flash("Password must be at least 8 characters.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        flash(data.message || "Signup failed.", "error");
        return;
      }

      flash("Account created successfully.");
      setTimeout(() => {
        location.href = "login.html";
      }, 700);
    } catch (error) {
      console.error("Signup error:", error);
      flash("Server error during signup.", "error");
    }
  });
}

function initLogin() {
  const formEl = document.querySelector("[data-login-form]");
  if (!formEl) return;

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("LOGIN SUBMIT FIRED");

    const form = new FormData(event.target);
    const email = form.get("email")?.trim().toLowerCase();
    const password = form.get("password");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        flash(data.message || "Invalid email or password.", "error");
        return;
      }

      setUser(data.data);
      location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);
      flash("Server error during login.", "error");
    }
  });
}

function initReportForms() {
  const sightingForm = document.querySelector("[data-sighting-form]");
  if (sightingForm) {
    sightingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("SIGHTING SUBMIT FIRED");

      if (!requireUser()) return;

      const form = new FormData(event.target);

      const payload = {
        animalType: form.get("species_group"),
        location: form.get("location"),
        dateTime: form.get("date_time"),
        notes: form.get("notes"),
        imageUrl: ""
      };

      console.log("SIGHTING PAYLOAD", payload);

      try {
        const response = await fetch(`${API_BASE_URL}/reports/sighting`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          flash(data.message || "Failed to submit sighting report.", "error");
          return;
        }

        event.target.reset();
        flash("Sighting report submitted successfully.");
      } catch (error) {
        console.error("Sighting error:", error);
        flash("Server error while submitting sighting report.", "error");
      }
    });
  }

  const incidentForm = document.querySelector("[data-incident-form]");
  if (incidentForm) {
    incidentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("INCIDENT SUBMIT FIRED");

      if (!requireUser()) return;

      const form = new FormData(event.target);
      const mediaFile = document.querySelector("#incidentMedia")?.files?.[0];

      const payload = {
        location: form.get("location"),
        description: form.get("situation_description"),
        urgencyLevel: form.get("urgency"),
        dateTime: form.get("date_time"),
        imageUrl: mediaFile ? mediaFile.name : ""
      };

      console.log("INCIDENT PAYLOAD", payload);

      try {
        const response = await fetch(`${API_BASE_URL}/reports/incident`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          flash(data.message || "Failed to submit incident report.", "error");
          return;
        }

        event.target.reset();
        const incidentMediaLabel = document.querySelector("#incidentMediaLabel");
        if (incidentMediaLabel) incidentMediaLabel.textContent = "Attach Media";
        flash("Incident report submitted successfully.");
      } catch (error) {
        console.error("Incident error:", error);
        flash("Server error while submitting incident report.", "error");
      }
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      flash("Contact form backend not connected yet.", "error");
    });
  }
}

function initMediaInputs() {
  const incidentMedia = document.querySelector("#incidentMedia");
  const incidentMediaLabel = document.querySelector("#incidentMediaLabel");

  if (incidentMedia && incidentMediaLabel) {
    incidentMedia.addEventListener("change", () => {
      const file = incidentMedia.files[0];
      incidentMediaLabel.textContent = file ? file.name : "Attach Media";
    });
  }
}

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getStatusOptions(reportType, currentStatus) {
  const statuses =
    reportType === "sighting"
      ? ["Open", "Pending", "Reviewed", "Resolved"]
      : ["Open", "In Progress", "Resolved"];

  return statuses
    .map(
      (status) =>
        `<option value="${status}" ${status === currentStatus ? "selected" : ""}>${status}</option>`
    )
    .join("");
}

async function updateReportStatus(id, reportType, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reportType,
        status
      })
    });

    const data = await response.json();

    if (!response.ok) {
      flash(data.message || "Failed to update report status.", "error");
      return;
    }

    flash("Report status updated successfully.");
    await initAdminPage();
  } catch (error) {
    console.error("Status update error:", error);
    flash("Server error while updating report status.", "error");
  }
}

async function deleteReport(id, reportType) {
  const confirmed = confirm("Are you sure you want to delete this report?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reportType
      })
    });

    const data = await response.json();

    if (!response.ok) {
      flash(data.message || "Failed to delete report.", "error");
      return;
    }

    flash("Report deleted successfully.");
    closeReportModal();
    await initAdminPage();
  } catch (error) {
    console.error("Delete report error:", error);
    flash("Server error while deleting report.", "error");
  }
}

function openReportModal(reportType, report) {
  const modal = document.querySelector("#reportModal");
  const content = document.querySelector("#reportModalContent");
  if (!modal || !content) return;

  if (reportType === "sighting") {
    content.innerHTML = `
      <p class="text-xs uppercase tracking-widest text-red-600 font-black">Sighting Report</p>
      <h2 class="text-3xl font-black mt-2">${report.species || "Unknown Species"}</h2>
      <p class="text-slate-500 mt-2">${formatDateTime(report.dateTime)}</p>

      <div class="grid md:grid-cols-2 gap-6 mt-8">
        <div>
          <p class="text-slate-500 font-bold text-sm">Location</p>
          <p class="font-semibold">${report.location || "N/A"}</p>
        </div>
        <div>
          <p class="text-slate-500 font-bold text-sm">Campus</p>
          <p class="font-semibold">${report.campus || "N/A"}</p>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-slate-500 font-bold text-sm">Notes</p>
        <p class="mt-1">${report.notes || "No notes provided."}</p>
      </div>

      <div class="flex gap-3 mt-8 flex-wrap">
        <button onclick='deleteReport("${report._id}", "sighting")' class="bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700">
          Delete Report
        </button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <p class="text-xs uppercase tracking-widest text-red-600 font-black">Incident Report</p>
      <h2 class="text-3xl font-black mt-2">${report.urgency || "Unknown"} Priority</h2>
      <p class="text-slate-500 mt-2">${formatDateTime(report.dateTime)}</p>

      <div class="grid md:grid-cols-2 gap-6 mt-8">
        <div>
          <p class="text-slate-500 font-bold text-sm">Location</p>
          <p class="font-semibold">${report.location || "N/A"}</p>
        </div>
        <div>
          <p class="text-slate-500 font-bold text-sm">Media</p>
          <p class="font-semibold">${report.mediaUrl || "No file"}</p>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-slate-500 font-bold text-sm">Description</p>
        <p class="mt-1">${report.situationDescription || "No description provided."}</p>
      </div>

      <div class="flex gap-3 mt-8 flex-wrap">
        <button onclick='deleteReport("${report._id}", "incident")' class="bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700">
          Delete Report
        </button>
      </div>
    `;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (window.lucide) lucide.createIcons();
}

function closeReportModal() {
  const modal = document.querySelector("#reportModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function renderSightingCard(report) {
  const safeReport = JSON.stringify(report).replace(/'/g, "&apos;");
  return `
    <div class="p-6 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest text-red-600 font-black">Sighting</p>
          <h3 class="text-xl font-black mt-1">${report.species || "Unknown Species"}</h3>
          <p class="text-sm text-slate-500 mt-1">${formatDateTime(report.dateTime)}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">${report.status || "Open"}</span>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-slate-500 font-bold">Location</p>
          <p class="font-semibold">${report.location || "N/A"}</p>
        </div>
        <div>
          <p class="text-slate-500 font-bold">Campus</p>
          <p class="font-semibold">${report.campus || "N/A"}</p>
        </div>
      </div>

      <div>
        <p class="text-slate-500 font-bold text-sm">Notes</p>
        <p class="text-sm">${report.notes || "No notes provided."}</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <label class="text-sm font-bold text-slate-500">Update Status</label>
        <select
          class="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          onchange="updateReportStatus('${report._id}', 'sighting', this.value)"
        >
          ${getStatusOptions("sighting", report.status)}
        </select>

        <button
          onclick='openReportModal("sighting", ${safeReport})'
          class="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          Open
        </button>

        <button
          onclick='deleteReport("${report._id}", "sighting")'
          class="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  `;
}

function renderIncidentCard(report) {
  const safeReport = JSON.stringify(report).replace(/'/g, "&apos;");
  return `
    <div class="p-6 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest text-red-600 font-black">Incident</p>
          <h3 class="text-xl font-black mt-1">${report.urgency || "Unknown"} Priority</h3>
          <p class="text-sm text-slate-500 mt-1">${formatDateTime(report.dateTime)}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">${report.status || "Open"}</span>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-slate-500 font-bold">Location</p>
          <p class="font-semibold">${report.location || "N/A"}</p>
        </div>
        <div>
          <p class="text-slate-500 font-bold">Media</p>
          <p class="font-semibold">${report.mediaUrl || "No file"}</p>
        </div>
      </div>

      <div>
        <p class="text-slate-500 font-bold text-sm">Description</p>
        <p class="text-sm">${report.situationDescription || "No description provided."}</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <label class="text-sm font-bold text-slate-500">Update Status</label>
        <select
          class="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          onchange="updateReportStatus('${report._id}', 'incident', this.value)"
        >
          ${getStatusOptions("incident", report.status)}
        </select>

        <button
          onclick='openReportModal("incident", ${safeReport})'
          class="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          Open
        </button>

        <button
          onclick='deleteReport("${report._id}", "incident")'
          class="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  `;
}

async function initAdminPage() {
  const sightingsList = document.querySelector("#sightingsList");
  const incidentsList = document.querySelector("#incidentsList");

  if (!sightingsList || !incidentsList) return;

  const user = currentUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  if (user.role !== "admin") {
    flash("Only admin accounts can view this page.", "error");
    return;
  }

  try {
    const [reportsResponse, dashboardResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/reports`),
      fetch(`${API_BASE_URL}/admin/dashboard`)
    ]);

    const reportsData = await reportsResponse.json();
    const dashboardData = await dashboardResponse.json();

    if (!reportsResponse.ok) {
      flash(reportsData.message || "Failed to load reports.", "error");
      return;
    }

    if (!dashboardResponse.ok) {
      flash(dashboardData.message || "Failed to load dashboard data.", "error");
      return;
    }

    const sightings = reportsData.data?.sightings || [];
    const incidents = reportsData.data?.incidents || [];
    const stats = dashboardData.data || {};

    document.querySelector("#totalReports").textContent = stats.totalReports ?? 0;
    document.querySelector("#totalSightings").textContent = stats.totalSightings ?? 0;
    document.querySelector("#totalIncidents").textContent = stats.totalIncidents ?? 0;
    document.querySelector("#resolvedReports").textContent = stats.resolvedReports ?? 0;

    document.querySelector("#sightingCount").textContent = `${sightings.length} item${sightings.length === 1 ? "" : "s"}`;
    document.querySelector("#incidentCount").textContent = `${incidents.length} item${incidents.length === 1 ? "" : "s"}`;

    sightingsList.innerHTML = sightings.length
      ? sightings.map(renderSightingCard).join("")
      : `<div class="p-6 text-slate-500 font-semibold">No sighting reports found.</div>`;

    incidentsList.innerHTML = incidents.length
      ? incidents.map(renderIncidentCard).join("")
      : `<div class="p-6 text-slate-500 font-semibold">No incident reports found.</div>`;
  } catch (error) {
    console.error("Admin page error:", error);
    flash("Could not load admin dashboard.", "error");
  }
}

function initPredictor() {
  const form = document.querySelector("[data-predictor-form]");
  if (!form) return;

  const fileInput = document.querySelector("[data-image-input]");
  const preview = document.querySelector("[data-preview]");
  const result = document.querySelector("[data-result]");
  const apiNotice = document.querySelector("[data-api-notice]");
  const feedback = document.querySelector("[data-ai-feedback]");

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = fileInput?.files[0];
    if (!file) {
      flash("Please choose an image first.", "error");
      return;
    }

    if (!MODEL_API_URL) {
      result.innerHTML = `
        <p class="text-slate-900">Model endpoint is not connected yet.</p>
        <p class="mt-2 text-sm text-slate-500">Set <b>MODEL_API_URL</b> in <code>assets/js/app.js</code>, then return JSON like <code>{ prediction, confidence }</code>.</p>`;
      feedback.innerHTML = `
        <p class="text-slate-400">AI feedback will appear here after your hosted model and Gemini proxy are connected.</p>`;
      apiNotice.hidden = false;
      return;
    }

    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch(MODEL_API_URL, { method: "POST", body });
      if (!response.ok) throw new Error("Model request failed");
      const data = await response.json();

      result.innerHTML = `
        <p class="text-slate-900">Classified as <b>${data.prediction}</b></p>
        <p class="mt-2 text-sm text-slate-500">Confidence: ${data.confidence}</p>`;

      await loadAiFeedback(file, data);
    } catch (error) {
      console.error("Predictor error:", error);
      flash("Could not call the hosted model endpoint.", "error");
    }
  });

  async function loadAiFeedback(file, modelData) {
    if (!GEMINI_FEEDBACK_API_URL) {
      feedback.innerHTML = `
        <p class="text-slate-900 font-bold">Gemini feedback is not connected yet.</p>
        <p class="mt-2 text-sm text-slate-500">Set <b>GEMINI_FEEDBACK_API_URL</b> in <code>assets/js/app.js</code>. Use a backend or serverless function so your Gemini API key stays private.</p>`;
      return;
    }

    feedback.innerHTML = `<p class="text-slate-400">Generating AI safety feedback...</p>`;

    const body = new FormData();
    body.append("image", file);
    body.append("prediction", modelData.prediction || "");
    body.append("confidence", modelData.confidence || "");

    try {
      const response = await fetch(GEMINI_FEEDBACK_API_URL, { method: "POST", body });
      if (!response.ok) throw new Error("Gemini feedback request failed");
      const data = await response.json();

      feedback.innerHTML = `
        <h4 class="font-bold text-lg mb-2">${data.name || "Wildlife safety feedback"}</h4>
        <p class="mb-2"><strong>Danger Level:</strong> ${data.danger_level || data.dangerLevel || "unknown"}</p>
        <p class="mb-2"><strong>Description:</strong> ${data.description || "No description returned."}</p>
        <p class="text-red-600"><strong>What to do if bitten:</strong> ${data.first_aid || data.firstAid || "Keep distance and contact campus security."}</p>`;
    } catch (error) {
      feedback.innerHTML = `
        <p class="text-red-600 font-bold">Could not load Gemini AI feedback.</p>
        <p class="mt-2 text-sm text-slate-500">Check your Gemini proxy endpoint and CORS settings.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  initSignup();
  initLogin();
  initReportForms();
  initPredictor();
  initMediaInputs();
  initAdminPage();
});