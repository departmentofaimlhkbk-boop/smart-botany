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

  /* ---------- AGE CALCULATION ---------- */
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

  /* ---------- PHONETIC CAMPUS NAME (FOR TTS) ---------- */
  const campusName = {
    en: "HKBK",
    kn: "ಎಚ್ ಕೆ ಬಿ ಕೆ",
    ta: "எச் கே பி கே",
    te: "హెచ్ కె బి కె",
    ml: "എച്ച് കെ ബി കെ",
    hi: "एच के बी के"
  };

  /* ---------- GREETINGS ---------- */
  const greetings = {
    en: p => `Hi! I'm ${p}, flourishing at ${campusName.en} 🌿.`,
    kn: p => `ನಮಸ್ಕಾರ! ನಾನು ${p}, ${campusName.kn}ನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ 🌿.`,
    ta: p => `வணக்கம்! நான் ${p}, ${campusName.ta} வளாகத்தில் நன்றாக வளர்ந்து கொண்டிருக்கிறேன் 🌿.`,
    te: p => `నమస్కారం! నేను ${p}, ${campusName.te}లో సంతోషంగా పెరుగుతున్నాను 🌿.`,
    ml: p => `നമസ്കാരം! ഞാൻ ${p}, ${campusName.ml} ക്യാമ്പസിൽ നന്നായി വളരുന്നു 🌿.`,
    hi: p => `नमस्ते! मैं ${p}, ${campusName.hi} में अच्छी तरह से बढ़ रहा हूँ 🌿.`
  };

  const speechLang = {
    en: "en-IN",
    kn: "kn-IN",
    ta: "ta-IN",
    te: "te-IN",
    ml: "ml-IN",
    hi: "hi-IN"
  };

  /* ---------- PLANT NAME MAP ---------- */
  const plantNameMap = {
    1: {
      en: "Copperleaf",
      kn: "ತಾಮ್ರ ಎಲೆ ಸಸ್ಯ",
      ta: "செம்பருத்தி இலை",
      te: "కాపర్ లీఫ్ మొక్క",
      ml: "കോപ്പർലീഫ് ചെടി",
      hi: "कॉपरलीफ पौधा"
    },
    2: {
      en: "Aloe Vera",
      kn: "ಲೋಳೆ ಸರ",
      ta: "கற்றாழை",
      te: "కలబంద",
      ml: "കറ്റാർവാഴ",
      hi: "घृतकुमारी"
    },
    3: {
      en: "Sugar Apple",
      kn: "ಸೀತಾಫಲ",
      ta: "சீதாப்பழம்",
      te: "సీతాఫలం",
      ml: "സീതപ്പഴം",
      hi: "सीताफल"
    },
    4: {
      en: "Arborvitae",
      kn: "ತುಜಾ ಮರ",
      ta: "துஜா மரம்",
      te: "తూజా చెట్టు",
      ml: "തുജ മരങ്ങൾ",
      hi: "थूजा वृक्ष"
    },
    5: {
      en: "Avocado",
      kn: "ಅವಕಾಡೊ",
      ta: "அவகேடோ",
      te: "అవకాడో",
      ml: "അവക്കാഡോ",
      hi: "एवोकाडो"
    }
  };

  let currentLang = "en";
  let isSpeaking = false;

  /* ---------- VOICE HANDLING ---------- */
  function getVoice(langCode) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    let voice = voices.find(v => v.lang === langCode);
    if (!voice) {
      const base = langCode.split("-")[0];
      voice = voices.find(v => v.lang.startsWith(base));
    }
    return voice || null;
  }

  function speakText(text, langCode) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 1;

    const voice = getVoice(langCode);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      isSpeaking = false;
      langBtn.textContent = "🌐 Language";
    };

    window.speechSynthesis.speak(utterance);
  }

  // Force voice loading (important for Indian languages)
  window.speechSynthesis.onvoiceschanged = () => {};

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

    const getPlantName = () =>
      plantNameMap[plant.id]?.[currentLang] ||
      plant.common_name;

    /* ---------- PAGE RENDER ---------- */
    container.innerHTML = `
      <h2 id="greetingText">${greetings.en(getPlantName())}</h2>

      <button id="langBtn"
        style="margin:10px 0;padding:8px 14px;border:none;
               background:#2e7d32;color:white;
               border-radius:6px;cursor:pointer;">
        🌐 Language
      </button>

      <div id="langPopup"
           style="display:none;position:absolute;
                  background:#fff;border:1px solid #ccc;
                  border-radius:6px;padding:6px;">
        <div data-lang="en">English</div>
        <div data-lang="kn">ಕನ್ನಡ</div>
        <div data-lang="ta">தமிழ்</div>
        <div data-lang="te">తెలుగు</div>
        <div data-lang="ml">മലയാളം</div>
        <div data-lang="hi">हिन्दी</div>
      </div>

      <table class="plant-table">
        <tr><th>Scientific Name</th><td>My scientific name is ${plant.scientific_name || "-"}</td></tr>
        <tr><th>Category</th><td>I belong to the ${plant.category || "plant"} category.</td></tr>
        <tr><th>Origin</th><td>${plant.origin || "-"}</td></tr>
        <tr><th>Date of Planting</th><td>${plant.date_of_planting || "-"}</td></tr>
        <tr><th>Age</th><td>${ageText}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${plant.seasonal_flowering || "-"}</td></tr>
        <tr><th>Quantitative Data</th><td>${plant.quantitative_data || "-"}</td></tr>
        <tr><th>Geo Location</th><td>${plant.geo_location || "-"}</td></tr>
        <tr><th>Max Height</th><td>${plant.max_height || "-"}</td></tr>
        <tr><th>Water Requirement</th><td>${plant.water_requirement || "-"}</td></tr>
        <tr><th>Medicinal Value</th><td>${plant.medicinal_value || "-"}</td></tr>
        <tr><th>Images</th><td>${imagesHTML}</td></tr>
      </table>
    `;

    const langBtn = document.getElementById("langBtn");
    const popup = document.getElementById("langPopup");
    const greetingEl = document.getElementById("greetingText");

    langBtn.addEventListener("click", () => {
      if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        langBtn.textContent = "🌐 Language";
        return;
      }
      popup.style.display = popup.style.display === "block" ? "none" : "block";
    });

    popup.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        popup.style.display = "none";
        currentLang = item.dataset.lang;

        const plantName = getPlantName();
        const greeting = greetings[currentLang](plantName);

        greetingEl.textContent = greeting;
        langBtn.textContent = "⏹ Stop";
        isSpeaking = true;

        speakText(greeting, speechLang[currentLang]);
      });
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Something went wrong.</p>";
  }
});

window.addEventListener("beforeunload", () => {
  speechSynthesis.cancel();
});
