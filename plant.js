// plant.js - load plant details dynamically by ID

// ✅ Use Supabase client from config.js
// Make sure config.js is included in plant.html before this script
// const supabase is already initialized in config.js

async function loadPlantDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get("id");

  const container = document.getElementById("plant-card") || document.getElementById("plant-container");
  if (!container) return;

  if (!plantId) {
    container.innerHTML = "<p>❌ No plant selected.</p>";
    return;
  }

  try {
    // Fetch single plant by ID
    const { data: plant, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (error || !plant) {
      console.error("Error fetching plant:", error?.message);
      container.innerHTML = "<p>❌ Failed to load plant details.</p>";
      return;
    }

    console.log("Fetched plant:", plant); // 🔍 DEBUG

    // ✅ Multiple images with Lightbox
    let imagesHTML = "<p>No images available.</p>";
    if (plant.image_urls) {
      const urls = plant.image_urls.split(",").map((url) => url.trim());
      imagesHTML = urls
        .map(
          (url, idx) => `
            <a href="${url}" data-lightbox="${plant.common_name}" data-title="${plant.common_name} - Image ${idx+1}">
              <img src="${url}" class="table-image" alt="${plant.common_name}" 
                   style="width:100px; cursor:pointer; margin-right:5px;" />
            </a>`
        )
        .join("");
    }

    // ✅ Make links in Additional Info clickable
    let additionalInfoHTML = plant.additional_info
      ? plant.additional_info.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" class="plant-link">$1</a>'
        )
      : "-";

    // ✅ Inject plant details into the container
    container.innerHTML = `
      <h2>${plant.common_name || "Unknown"} (${plant.scientific_name || "-"})</h2>
      <table class="plant-table">
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Location</th><td>${plant.location || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${additionalInfoHTML}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;
  } catch (err) {
    console.error("Unexpected error:", err);
    container.innerHTML = "<p>❌ Something went wrong while loading plant.</p>";
  }
}

// Run on page load
window.onload = loadPlantDetails;
