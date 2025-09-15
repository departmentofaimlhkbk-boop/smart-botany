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
      ? `Did you know? ${plant.additional_info.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        )}`
      : "I have no extra stories to share right now 🌱.";

    // Calculate Age dynamically
    let ageText = "My age is a little secret 🤫.";
    if (plant.date_of_planting) {
      const planted = new Date(plant.date_of_planting);
      const today = new Date();

      let age = today.getFullYear() - planted.getFullYear();
      const monthDiff = today.getMonth() - planted.getMonth();
      const dayDiff = today.getDate() - planted.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      ageText = `I am around ${age} years old.`;
    }

    // Conversational replacements
    const nameText = `Hi! I’m ${plant.common_name || "a plant"}, flourishing at HKBK 🌿. My scientific name is ${plant.scientific_name || "-"}.`;
    const categoryText = plant.category
      ? `I belong to the ${plant.category} category.`
      : "I’m still discovering my category.";
    const dateText = plant.date_of_planting
      ? `I was planted on ${plant.date_of_planting}.`
      : "I don't remember the exact date I was planted, but I’ve been growing happily here 🌱.";
    const heightText = plant.max_height
      ? `I can grow up to ${plant.max_height}.`
      : "My height is still a surprise!";
    const originText = plant.origin
      ? `My roots trace back to ${plant.origin}.`
      : "My origin is a mystery.";
    const waterText = plant.water_requirement
      ? `I thrive best with ${plant.water_requirement}.`
      : "I’m not too picky about water.";
    const flowerText = plant.seasonal_flowering
      ? `I bloom during ${plant.seasonal_flowering}.`
      : "I may surprise you with my flowers!";
    const medText = plant.medicinal_value
      ? `People value me for: ${plant.medicinal_value}.`
      : "I don’t have known medicinal uses.";
    const dataText = plant.quantitative_data
      ? `Fun fact: ${plant.quantitative_data}.`
      : "No extra data about me yet.";
    const geoText = plant.geo_location
      ? `You can find me at: ${plant.geo_location}.`
      : "My exact location is not shared.";

    // Populate HTML with conversational style inside table
    container.innerHTML = `
      <h2>${nameText}</h2>
      <table class="plant-table">
        <tr><th>Category</th><td>${categoryText}</td></tr>
        <tr><th>Date of Planting</th><td>${dateText}</td></tr>
        <tr><th>Age</th><td id="plant-age">${ageText}</td></tr>
        <tr><th>Max Height</th><td>${heightText}</td></tr>
        <tr><th>Origin</th><td>${originText}</td></tr>
        <tr><th>Water Requirement</th><td>${waterText}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${flowerText}</td></tr>
        <tr><th>Medicinal Value</th><td>${medText}</td></tr>
        <tr><th>Quantitative Data</th><td>${dataText}</td></tr>
        <tr><th>Geo Location</th><td>${geoText}</td></tr>
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
