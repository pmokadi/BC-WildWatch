const API_BASE_URL = "http://localhost:5000/api";

const signupForm = document.querySelector("#signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.querySelector("#fullName")?.value.trim();
    const email = document.querySelector("#email")?.value.trim();
    const password = document.querySelector("#password")?.value.trim();

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
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error during signup");
    }
  });
}