document.addEventListener("DOMContentLoaded", async () => {

  // Run ONLY on plant.html
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

  // ✅ AGE CALCULATION
  function calculateAge(dateString) {
    if (!dateString) return "-";
    const planted = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - planted.getFullYear();
    const m = today.getMonth() - planted.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < planted.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} years` : "-";
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

    // Images
    let imagesHTML = "-";
    if (plant.image_urls) {
      imagesHTML = plant.image_urls
        .split(",")
        .map(
          url => `
          <img src="${url.trim()}"
               style="width:160px;margin:6px;border-radius:8px"
               onerror="this.style.display='none'">
        `
        )
        .join("");
    }

    const ageText = calculateAge(plant.date_of_planting);

    // ✅ CONVERSATIONAL TEXT (PLANT → HUMAN)
    const conversationText = `
      Hi! I am <strong>${plant.common_name || "a plant"}</strong>.
      My scientific name is <em>${plant.scientific_name || "not documented yet"}</em>.
      I originally come from ${plant.origin || "a beautiful place"}.
      I am about ${ageText !== "-" ? ageText : "a few years"} old.
      I bloom during ${plant.seasonal_flowering || "different seasons"}.
      People value me because ${plant.medicinal_value || "I help nature and humans in many ways"}.
    `;

    /* ---------- PAGE CONTENT ---------- */
    container.innerHTML = `
      <h2>${plant.common_name}</h2>

      <!-- 🌱 Conversational Text -->
      <div style="
        background:#f1f8f4;
        padding:15px;
        border-radius:10px;
        margin:15px 0;
        font-size:16px;
        line-height:1.6;
        color:#2e7d32;">
        ${conversationText}
      </div>

      <!-- 🔊 Speak / Stop Button -->
      <button id="speakBtn"
        style="margin-bottom:15px;padding:8px 14px;border:none;
               background:#2e7d32;color:white;
               border-radius:6px;cursor:pointer;">
        🔊 Speak
      </button>

      <table class="plant-table">
        <tr><th>Scientific Name</th><td>${plant.scientific_name || "-"}</td></tr>
        <tr><th>Category</th><td>${plant.category || "-"}</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Age</th><td>${ageText}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Geo Location</th><td>${plant.geo_location || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Additional Info</th><td>${plant.additional_info || "-"}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;

    /* ---------- SPEAK / STOP LOGIC ---------- */
    const speakBtn = document.getElementById("speakBtn");
    let isSpeaking = false;
    let utterance;

    speakBtn.addEventListener("click", () => {
      if (!isSpeaking) {

        let textToSpeak = `
          Hi! I am ${plant.common_name || "a plant"}.
          My scientific name is ${plant.scientific_name || "not documented yet"}.
          I originally come from ${plant.origin || "a beautiful place"}.
          I am about ${ageText !== "-" ? ageText : "a few years"} old.
          I bloom during ${plant.seasonal_flowering || "different seasons"}.
          People value me because ${plant.medicinal_value || "I help nature and humans in many ways"}.
        `;

        utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "en-IN";
        utterance.rate = 1;

        utterance.onend = () => {
          isSpeaking = false;
          speakBtn.textContent = "🔊 Speak";
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);

        speakBtn.textContent = "⏹ Stop";
        isSpeaking = true;

      } else {
        window.speechSynthesis.cancel();
        speakBtn.textContent = "🔊 Speak";
        isSpeaking = false;
      }
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
});

// Stop speech if page changes
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});
