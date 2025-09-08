async function loadPlants() {
  const container = document.getElementById("plant-list");
  container.innerHTML = "Loading plants...";

  try {
    console.log("Fetching plants from Supabase...");
    const { data: plants, error } = await supabase.from("plants").select("*");
    console.log("Plants fetched:", plants, error);

    if (error) {
      container.innerHTML = "<p>❌ Error loading plants.</p>";
      console.error(error);
      return;
    }

    if (!plants || plants.length === 0) {
      container.innerHTML = "<p>No plants found.</p>";
      return;
    }

    container.innerHTML = "";

    plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${plant.image_urls?.split(',')[0] || ''}" alt="${plant.common_name}" />
        <h3>${plant.common_name || '-'}</h3>
        <p><strong>Scientific Name:</strong> ${plant.scientific_name || '-'}</p>
        <a href="plant.html?id=${plant.id}">View Details</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>❌ Something went wrong while loading plants.</p>";
    console.error("Unexpected error:", err);
  }
}

window.onload = loadPlants;
