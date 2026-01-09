async function loadPlants() {
  const container = document.getElementById("plant-list");
  container.innerHTML = "Loading plants...";

  try {
    const { data: plants, error } = await supabase
      .from("plants")
      .select("*");

    if (error) {
      container.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
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

      // ✅ SAFE image handling
      let imageUrl = "";
      if (typeof plant.image_urls === "string" && plant.image_urls.length > 0) {
        imageUrl = plant.image_urls;
      }

      card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${plant.common_name}">` : ""}
        <h3>${plant.common_name || "-"}</h3>
        <p><strong>Scientific Name:</strong> ${plant.scientific_name || "-"}</p>
        <a href="plant.html?id=${plant.id}">View Details</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Runtime error:", err);
    container.innerHTML =
      "<p style='color:red;'>❌ JavaScript runtime error</p>";
  }
}

window.onload = loadPlants;
