async function loadPlantDetails() {
  const params = new URLSearchParams(window.location.search);
  const plantId = params.get("id");
  const container = document.getElementById("plant-card");

  if (!plantId) {
    container.innerHTML = "<p>❌ No plant selected.</p>";
    return;
  }

  try {
    const { data: plant, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (error || !plant) {
      container.innerHTML = "<p>❌ Error loading plant.</p>";
      return;
    }

    // Multiple images
    let imagesHTML = "-";
    if (plant.image_urls) {
      imagesHTML = plant.image_urls
        .split(",")
        .map(url => url.trim())
        .map(url => `
          <a href="${url}" data-lightbox="plant" data-title="${plant.common_name}">
            <img src="${url}" alt="${plant.common_name}" style="width:150px; margin:5px;" />
          </a>
        `).join("");
    }

    // Make additional info clickable
    let additionalInfo = plant.additional_info
      ? plant.additional_info.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
      : "-";

    container.innerHTML = `
      <h2>${plant.common_name} (${plant.scientific_name})</h2>
      <table>
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Location</th><td>${plant.location || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${additionalInfo}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;
  } catch (err) {
    container.innerHTML = "<p>❌ Something went wrong while loading plant.</p>";
    console.error(err);
  }
}

window.onload = loadPlantDetails;
