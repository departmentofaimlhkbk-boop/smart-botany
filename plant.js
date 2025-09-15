// plant.js - load plant details dynamically by ID

async function loadPlantDetails() {
  const params = new URLSearchParams(window.location.search);
  const plantId = params.get("id");

  const container = document.getElementById("plant-card");
  if (!container) {
    console.error("❌ Container with ID 'plant-card' not found.");
    return;
  }

  if (!plantId) {
    container.innerHTML = "<p>❌ No plant selected.</p>";
    return;
  }

  console.log("Fetching plant with ID:", plantId);

  try {
    const { data: plant, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (error) {
      console.error("Error fetching plant:", error);
      container.innerHTML = "<p>❌ Error loading plant.</p>";
      return;
    }

    if (!plant) {
      container.innerHTML = "<p>❌ Plant not found.</p>";
      return;
    }

    console.log("Fetched plant:", plant);

    // Multiple images with Lightbox
    let imagesHTML = "-";
    if (plant.image_urls) {
      const urls = plant.image_urls.split(",").map(url => url.trim());
      imagesHTML = urls
        .map(
          (url, idx) => `
          <a href="${url}" data-lightbox="plant" data-title="${plant.common_name} - Image ${idx + 1}">
            <img src="${url}" alt="${plant.common_name}" style="width:150px; margin:5px;" />
          </a>`
        )
        .join("");
    }

    // Make links clickable in Additional Info
    const additionalInfo = plant.additional_info
      ? plant.additional_info.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        )
      : "-";

    // Calculate Age dynamically
    let ageText = "-";
    if (plant.date_of_planting) {
      const planted = new Date(plant.date_of_planting);
      const today = new Date();

      let age = today.getFullYear() - planted.getFullYear();
      const monthDiff = today.getMonth() - planted.getMonth();
      const dayDiff = today.getDate() - planted.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      ageText = age + " years";
    }

    // Populate HTML with Age row after Date of Planting
    container.innerHTML = `
      <h2>${"Hi! I am " || plant.common_name || "-"} (${plant.scientific_name || "-"})</h2>
      <table class="plant-table">
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Age</th><td id="plant-age">${ageText}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Geo Location</th><td>${plant.geo_location || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${additionalInfo}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;
  } catch (err) {
    console.error("Unexpected error:", err);
    container.innerHTML = "<p>❌ Something went wrong while loading plant.</p>";
  }
}

// Run after page load
window.onload = loadPlantDetails;
