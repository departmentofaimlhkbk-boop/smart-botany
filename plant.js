document.addEventListener("DOMContentLoaded", async () => {

  // ✅ Run ONLY on plant.html
  if (!window.location.pathname.includes("plant.html")) {
    return;
  }

  const container = document.getElementById("plant-card");
  if (!container) {
    console.warn("plant-card not found, stopping script.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const plantId = Number(params.get("id"));

  if (!plantId || isNaN(plantId)) {
    container.innerHTML = "<p>❌ Invalid plant ID.</p>";
    return;
  }

  // ✅ AGE CALCULATION FUNCTION
  function calculateAge(dateString) {
    if (!dateString) return "-";

    const plantedDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - plantedDate.getFullYear();
    const monthDiff = today.getMonth() - plantedDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < plantedDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? `${age} years` : "-";
  }

  try {
    const { data: plant, error } = await supabaseClient
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (error || !plant) {
      container.innerHTML = "<p>❌ Plant not found.</p>";
      return;
    }

    // Images
    let imagesHTML = "-";
    if (plant.image_urls) {
      imagesHTML = plant.image_urls
        .split(",")
        .map(
          url => `
          <img src="${url.trim()}"
               style="width:160px;margin:6px;border-radius:8px"
               onerror="this.style.display='none'">
        `
        )
        .join("");
    }

    // ✅ Calculate Age
    const plantAge = calculateAge(plant.date_of_planting);

    container.innerHTML = `
      <h2>${plant.common_name}</h2>

      <table class="plant-table">
        <tr><th>Scientific Name</th><td>${plant.scientific_name || "-"}</td></tr>
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Age</th><td>${plantAge}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Geo Location</th><td>${plant.geo_location || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${plant.additional_info || "-"}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
});
