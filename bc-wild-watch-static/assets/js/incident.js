const API_BASE_URL = "http://localhost:5000/api";

const incidentForm = document.querySelector("#incidentForm");

if (incidentForm) {
  incidentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = document.querySelector("#location")?.value.trim();
    const description = document.querySelector("#description")?.value.trim();
    const urgencyLevel = document.querySelector("#urgencyLevel")?.value.trim();
    const dateTime = document.querySelector("#dateTime")?.value;
    const imageUrl = "";

    try {
      const response = await fetch(`${API_BASE_URL}/reports/incident`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location,
          description,
          urgencyLevel,
          dateTime,
          imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit incident report");
        return;
      }

      alert("Incident report submitted successfully");
      incidentForm.reset();
    } catch (error) {
      console.error("Incident error:", error);
      alert("Server error while submitting incident report");
    }
  });
}