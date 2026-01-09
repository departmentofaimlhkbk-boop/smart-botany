async function loadPlants() {
  const container = document.getElementById("plant-list");
  container.innerHTML = "Loading plants...";

  const { data: plants, error } = await supabase
    .from("plants")
    .select("*");

  if (error) {
    console.error(error);
    container.innerHTML = "❌ Error loading plants";
    return;
  }

  container.innerHTML = "";

  plants.forEach(plant => {
    let imageUrl = "placeholder.jpg";

    if (typeof plant.image_urls === "string") {
      const urls = plant.image_urls
        .replace(/\n/g, "")   // ✅ remove line breaks
        .split(",")
        .map(u => u.trim())
        .filter(u => u.startsWith("http"));

      if (urls.length > 0) imageUrl = urls[0];
    }

    const card = document.createElement("div");
    card.className = "plant-card";

    card.innerHTML = `
      <img src="${imageUrl}" 
           alt="${plant.common_name}"
           onerror="this.src='placeholder.jpg'">

      <h3>${plant.common_name}</h3>
      <p><strong>Scientific Name:</strong> ${plant.scientific_name}</p>
      <a href="plant.html?id=${plant.id}">View Details</a>
    `;

    container.appendChild(card);
  });
}

window.onload = loadPlants;
