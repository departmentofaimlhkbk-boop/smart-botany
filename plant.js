document.addEventListener("DOMContentLoaded", async () => {

  if (!window.location.pathname.includes("plant.html")) return;

  const container = document.getElementById("plant-card");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const plantId = Number(params.get("id"));

  if (!plantId || isNaN(plantId)) {
    container.innerHTML = "<p>❌ Invalid plant ID.</p>";
    return;
  }

  // ---------- AGE CALCULATION ----------
  function calculateAge(dateString) {
    if (!dateString) return "My age is a little secret 🤫.";
    const planted = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - planted.getFullYear();
    const m = today.getMonth() - planted.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < planted.getDate())) age--;
    return age >= 0
      ? `I am about ${age} years old.`
      : "My age is a little secret 🤫.";
  }

  // ---------- LANGUAGE GREETING TEMPLATES ----------
  const greetings = {
    en: (name) => `Hi! I'm ${name}, flourishing at HKBK 🌿.`,
    kn: (name) => `ನಮಸ್ಕಾರ! ನಾನು ${name}, HKBKನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ 🌿.`,
    ta: (name) => `வணக்கம்! நான் ${name}, HKBK வளாகத்தில் நன்றாக வளர்ந்து கொண்டிருக்கிறேன் 🌿.`,
    te: (name) => `నమస్కారం! నేను ${name}, HKBKలో సంతోషంగా పెరుగుతున్నాను 🌿.`,
    ml: (name) => `നമസ്കാരം! ഞാൻ ${name}, HKBK ക്യാമ്പസിൽ നന്നായി വളരുന്നു 🌿.`,
    hi: (name) => `नमस्ते! मैं ${name}, HKBK में अच्छी तरह से बढ़ रहा हूँ 🌿.`
  };

  const speechLang = {
    en: "en-IN",
    kn: "kn-IN",
    ta: "ta-IN",
    te: "te-IN",
    ml: "ml-IN",
    hi: "hi-IN"
  };

  let currentLang = "en";
  let isSpeaking = false;
  let utterance;

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

    const ageText = calculateAge(plant.date_of_planting);

    let imagesHTML = "-";
    if (plant.image_urls) {
      imagesHTML = plant.image_urls
        .split(",")
        .map(url => `
          <img src="${url.trim()}"
               style="width:160px;margin:6px;border-radius:8px"
               onerror="this.style.display='none'">
        `)
        .join("");
    }

    // ---------- INITIAL PAGE (ENGLISH DEFAULT) ----------
    container.innerHTML = `
      <h2 id="greetingText">${greetings.en(plant.common_name)}</h2>

      <!-- 🌐 Language / Stop Button -->
      <button id="langBtn"
        style="margin:10px 0;padding:8px 14px;border:none;
               background:#2e7d32;color:white;
               border-radius:6px;cursor:pointer;">
        🌐 Language
      </button>

      <!-- Language Popup -->
      <div id="langPopup"
           style="display:none;position:absolute;
                  background:#fff;border:1px solid #ccc;
                  border-radius:6px;padding:6px;
                  box-shadow:0 4px 12px rgba(0,0,0,0.15);">
        <div data-lang="en">English</div>
        <div data-lang="kn">ಕನ್ನಡ</div>
        <div data-lang="ta">தமிழ்</div>
        <div data-lang="te">తెలుగు</div>
        <div data-lang="ml">മലയാളം</div>
        <div data-lang="hi">हिन्दी</div>
      </div>

      <table class="plant-table">
        <tr><th>Scientific Name</th><td>My scientific name is ${plant.scientific_name || "still being studied"}.</td></tr>
        <tr><th>Category</th><td>I belong to the ${plant.category || "plant"} category.</td></tr>
        <tr><th>Origin</th><td>${plant.origin ? `I originally come from ${plant.origin}.` : "My origin is a bit of a mystery."}</td></tr>
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

    const langBtn = document.getElementById("langBtn");
    const popup = document.getElementById("langPopup");
    const greetingEl = document.getElementById("greetingText");

    // Toggle popup
    langBtn.addEventListener("click", () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        langBtn.textContent = "🌐 Language";
        return;
      }
      popup.style.display = popup.style.display === "block" ? "none" : "block";
    });

    // Language selection
    popup.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        popup.style.display = "none";
        currentLang = item.dataset.lang;

        const greeting = greetings[currentLang](plant.common_name);
        greetingEl.textContent = greeting;

        utterance = new SpeechSynthesisUtterance(greeting);
        utterance.lang = speechLang[currentLang];
        utterance.rate = 1;

        utterance.onend = () => {
          isSpeaking = false;
          langBtn.textContent = "🌐 Language";
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);

        langBtn.textContent = "⏹ Stop";
        isSpeaking = true;
      });
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
});

// Stop speech if page unloads
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});
