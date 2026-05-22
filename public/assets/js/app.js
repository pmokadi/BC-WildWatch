const MODEL_API_URL = "/predict";
const GEMINI_FEEDBACK_API_URL = "AIzaSyBllGA0r27FsEEoLzs7zzAUq60Hcnwa8WI"; // Paste your Gemini proxy endpoint here later.

const store = {
  get(key, fallback = []) {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  push(key, value) {
    const items = store.get(key);
    items.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...value });
    store.set(key, items);
    return items;
  }
};

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
  }
}

function initLayout() {
  const user = currentUser();
  const authSlot = document.querySelector("[data-auth-slot]");
  const mobileAuthSlot = document.querySelector("[data-mobile-auth-slot]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");

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
  document.querySelector("[data-signup-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get("email").trim().toLowerCase();
    const password = form.get("password");
    const confirmPassword = form.get("confirm_password");
    const users = store.get("bcww_users");

    if (password !== confirmPassword) {
      flash("Passwords do not match.", "error");
      return;
    }
    if (users.some((user) => user.email === email)) {
      flash("An account already exists for that email.", "error");
      return;
    }

    users.unshift({
      id: crypto.randomUUID(),
      fullName: form.get("full_name").trim(),
      email,
      password,
      role: "student",
      createdAt: new Date().toISOString()
    });
    store.set("bcww_users", users);
    flash("Account created. You can sign in now.");
    setTimeout(() => (location.href = "login.html"), 700);
  });
}

function initLogin() {
  document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get("email").trim().toLowerCase();
    const password = form.get("password");
    const user = store.get("bcww_users").find((item) => item.email === email && item.password === password);

    if (!user) {
      flash("Invalid email or password.", "error");
      return;
    }

    setUser({ email: user.email, fullName: user.fullName });
    location.href = "index.html";
  });
}

function initReportForms() {
  document.querySelector("[data-sighting-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    requireUser();
    const form = new FormData(event.target);
    const photoFile = form.get("photo");
    store.push("bcww_reports", {
      type: "sighting",
      userEmail: currentUser().email,
      campus: form.get("campus"),
      date: form.get("date"),
      time: form.get("time"),
      speciesGroup: form.get("species_group"),
      location: form.get("location") || form.get("detailed_location") || "",
      detailedLocation: form.get("detailed_location"),
      notes: form.get("notes"),
      photoName: photoFile && photoFile.name ? photoFile.name : null
    });
    event.target.reset();
    flash("Sighting report saved in this browser.");
  });

  document.querySelector("[data-incident-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    requireUser();
    const form = new FormData(event.target);
    store.push("bcww_reports", {
      type: "incident",
      userEmail: currentUser().email,
      urgency: form.get("urgency"),
      situationDescription: form.get("situation_description")
    });
    event.target.reset();
    flash("Incident report saved in this browser.");
  });

  document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    store.push("bcww_contacts", {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message")
    });
    event.target.reset();
    flash("Message saved in this browser.");
  });
}

function initPredictor() {
  const form = document.querySelector("[data-predictor-form]");
  if (!form) return;

  const fileInput = document.querySelector("[data-image-input]");
  const preview = document.querySelector("[data-preview]");
  const result = document.querySelector("[data-result]");
  const apiNotice = document.querySelector("[data-api-notice]");
  const feedback = document.querySelector("[data-ai-feedback]");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
      flash("Please choose an image first.", "error");
      return;
    }

    if (!MODEL_API_URL) {
      const demo = { prediction: "Awaiting hosted model", confidence: "0%" };
      result.innerHTML = `
        <p class="text-slate-900">Model endpoint is not connected yet.</p>
        <p class="mt-2 text-sm text-slate-500">Set <b>MODEL_API_URL</b> in <code>assets/js/app.js</code>, then return JSON like <code>{ prediction, confidence }</code>.</p>`;
      feedback.innerHTML = `
        <p class="text-slate-400">AI feedback will appear here after your hosted model and Gemini proxy are connected.</p>`;
      apiNotice.hidden = false;
      store.push("bcww_predictions", { fileName: file.name, ...demo });
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
      store.push("bcww_predictions", { fileName: file.name, prediction: data.prediction, confidence: data.confidence });
      await loadAiFeedback(file, data);
    } catch (error) {
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
});
