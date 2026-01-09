async function loadPlants() {
  const container = document.getElementById("plant-list");
  container.innerHTML = "Loading plants...";

  try {
    const { data: plants, error } = await supabaseClient
      .from("plants")
      .select("id, common_name, scientific_name, image_urls");

    if (error) {
      console.error(error);
      container.innerHTML = "<p>❌ Failed to load plants.</p>";
      return;
    }

    if (!plants || plants.length === 0) {
      container.innerHTML = "<p>No plants found.</p>";
      return;
    }

    container.innerHTML = "";

    plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "plant-card";

      // ✅ FIX: take ONLY first image from comma-separated URLs
      let imageUrl = "placeholder.jpg"; // backup image

      if (typeof plant.image_urls === "string" && plant.image_urls.trim() !== "") {
        imageUrl = plant.image_urls.split(",")[0].trim();
      }

      card.innerHTML = `
        <img src="${imageUrl}"
             alt="${plant.common_name || "Plant image"}"
             onerror="this.src='placeholder.jpg'">

        <h3>${plant.common_name || "-"}</h3>
        <p><strong>Scientific Name:</strong> ${plant.scientific_name || "-"}</p>
        <a href="plant.html?id=${plant.id}">View Details</a>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Runtime error:", err);
    container.innerHTML = "<p>❌ JavaScript runtime error</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadPlants);
