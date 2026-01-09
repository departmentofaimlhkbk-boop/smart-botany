// plant.js - load plant details dynamically by ID (FIXED)

const params = new URLSearchParams(window.location.search);

// ✅ FIX 1: convert ID to NUMBER
const plantId = Number(params.get("id"));

async function loadPlantDetails() {
  const container = document.getElementById("plant-card");

  if (!container) {
    console.error("❌ Container not found");
    return;
  }

  if (!plantId || isNaN(plantId)) {
    container.innerHTML = "<p>❌ Invalid plant ID.</p>";
    return;
  }

  console.log("Fetching plant ID:", plantId);

  try {
    // ✅ FIX 2: use correct Supabase client + numeric ID
    const { data: plant, error } = await supabaseClient
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (error || !plant) {
      console.error("Supabase error:", error);
      container.innerHTML = "<p>❌ Plant not found.</p>";
      return;
    }

    // ✅ SAFE image handling
    let imagesHTML = "-";
    if (typeof plant.image_urls === "string" && plant.image_urls.length > 0) {
      const urls = plant.image_urls.split(",").map(u => u.trim());
      imagesHTML = urls
        .map(
          (url, i) => `
          <img src="${url}" alt="${plant.common_name}"
               style="width:160px;margin:6px;border-radius:8px;"
               onerror="this.style.display='none'">
        `
        )
        .join("");
    }

    container.innerHTML = `
      <h2>${plant.common_name}</h2>

      <table class="plant-table">
        <tr><th>Scientific Name</th><td>${plant.scientific_name || "-"}</td></tr>
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${plant.additional_info || "-"}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;

  } catch (err) {
    console.error("Runtime error:", err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
}

// Run after page load
window.addEventListener("load", loadPlantDetails);

// Stop speech if any (safety)
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});
