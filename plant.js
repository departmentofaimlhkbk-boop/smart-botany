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

    let imagesHTML = "-";
    if (plant.image_urls) {
      imagesHTML = plant.image_urls
        .split(",")
        .map(
          url => `<img src="${url.trim()}"
                       style="width:160px;margin:6px;border-radius:8px"
                       onerror="this.style.display='none'">`
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
    console.error(err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
});
