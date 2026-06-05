const API_BASE_URL = "http://localhost:5000/api";

const sightingForm = document.querySelector("#sightingForm");

if (sightingForm) {
  sightingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const animalType = document.querySelector("#animalType")?.value.trim();
    const location = document.querySelector("#location")?.value.trim();
    const dateTime = document.querySelector("#dateTime")?.value;
    const notes = document.querySelector("#notes")?.value.trim();
    const imageUrl = "";

    try {
      const response = await fetch(`${API_BASE_URL}/reports/sighting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          animalType,
          location,
          dateTime,
          notes,
          imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit sighting report");
        return;
      }

      alert("Sighting report submitted successfully");
      sightingForm.reset();
    } catch (error) {
      console.error("Sighting error:", error);
      alert("Server error while submitting sighting report");
    }
  });
}