const API_BASE_URL = "http://localhost:5000/api";

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email")?.value.trim();
    const password = document.querySelector("#password")?.value.trim();

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
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("wildwatchUser", JSON.stringify(data.data));

      alert("Login successful");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  });
}