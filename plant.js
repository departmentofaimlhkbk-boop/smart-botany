document.addEventListener("DOMContentLoaded", async () => {

  if (!window.location.pathname.includes("plant.html")) return;

  const container = document.getElementById("plant-card");
  if (!container) return;

  container.innerHTML = "Loading plant details...";

  const params = new URLSearchParams(window.location.search);
  const plantId = Number(params.get("id"));

  if (!plantId) {
    container.innerHTML = "<p>❌ Invalid plant ID</p>";
    return;
  }

  /* ---------- SAFE AGE ---------- */
  function calculateAge(dateString) {
    if (!dateString) return "My age is a little secret 🤫.";
    const d = new Date(dateString);
    if (isNaN(d)) return "My age is a little secret 🤫.";
    const t = new Date();
    let age = t.getFullYear() - d.getFullYear();
    if (
      t.getMonth() < d.getMonth() ||
      (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
    ) age--;
    return age >= 0 ? `I am about ${age} years old.` : "My age is a little secret 🤫.";
  }

  /* ---------- CAMPUS ---------- */
  const campusText = "HKBK";
  const campusSpeak = {
    en: "H K B K",
    kn: "ಎಚ್ ಕೆ ಬಿ ಕೆ",
    ta: "எச் கே பி கே",
    te: "హెచ్ కె బి కె",
    ml: "എച്ച് കെ ബി കെ",
    hi: "एच के बी के"
  };

  /* ---------- GREETINGS ---------- */
  const greetings = {
    en: p => `Hi! I'm ${p}, flourishing at ${campusText} 🌿.`,
    kn: p => `ನಮಸ್ಕಾರ! ನಾನು ${p}, ${campusText}ನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ 🌿.`,
    ta: p => `வணக்கம்! நான் ${p}, ${campusText} வளாகத்தில் நன்றாக வளர்கிறேன் 🌿.`,
    te: p => `నమస్కారం! నేను ${p}, ${campusText}లో సంతోషంగా పెరుగుతున్నాను 🌿.`,
    ml: p => `നമസ്കാരം! ഞാൻ ${p}, ${campusText} ക്യാമ്പസിൽ നന്നായി വളരുന്നു 🌿.`,
    hi: p => `नमस्ते! मैं ${p}, ${campusText} में अच्छी तरह से बढ़ रहा हूँ 🌿.`
  };

  const greetingSpeech = {
    en: p => `Hi! I'm ${p}, flourishing at ${campusSpeak.en}.`,
    kn: p => `ನಮಸ್ಕಾರ! ನಾನು ${p}, ${campusSpeak.kn}ನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ.`,
    ta: p => `வணக்கம்! நான் ${p}, ${campusSpeak.ta} வளாகத்தில் நன்றாக வளர்கிறேன்.`,
    te: p => `నమస్కారం! నేను ${p}, ${campusSpeak.te}లో సంతోషంగా పెరుగుతున్నాను.`,
    ml: p => `നമസ്കാരം! ഞാൻ ${p}, ${campusSpeak.ml} ക്യാമ്പസിൽ നന്നായി വളരുന്നു.`,
    hi: p => `नमस्ते! मैं ${p}, ${campusSpeak.hi} में अच्छी तरह से बढ़ रहा हूँ.`
  };

  const speechLang = {
    en: "en-IN", kn: "kn-IN", ta: "ta-IN",
    te: "te-IN", ml: "ml-IN", hi: "hi-IN"
  };

  /* ---------- FETCH PLANT ---------- */
  let plant;
  try {
    const res = await supabaseClient
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .single();

    if (res.error || !res.data) throw new Error();
    plant = res.data;
  } catch {
    container.innerHTML = "<p>❌ Plant not found</p>";
    return;
  }

  /* ---------- SAFE NAME ---------- */
  let currentLang = "en";
  let isSpeaking = false;

  function getPlantName() {
    return plant.common_name || "Plant";
  }

  const ageText = calculateAge(plant.date_of_planting);

  /* ---------- RENDER ONCE ---------- */
  function render() {
    container.innerHTML = `
      <h2 id="greetingText">${greetings[currentLang](getPlantName())}</h2>

      <button id="langBtn"
        style="margin:10px 0;padding:8px 14px;
               background:#2e7d32;color:white;
               border:none;border-radius:6px;">
        🌐 Language
      </button>

      <div id="langPopup" style="display:none">
        <div data-lang="en">English</div>
        <div data-lang="kn">ಕನ್ನಡ</div>
        <div data-lang="ta">தமிழ்</div>
        <div data-lang="te">తెలుగు</div>
        <div data-lang="ml">മലയാളം</div>
        <div data-lang="hi">हिन्दी</div>
      </div>

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
      </table>
    `;

    const langBtn = document.getElementById("langBtn");
    const popup = document.getElementById("langPopup");

    langBtn.onclick = () => {
      if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        langBtn.textContent = "🌐 Language";
        return;
      }
      popup.style.display = popup.style.display === "block" ? "none" : "block";
    };

    popup.querySelectorAll("div").forEach(d => {
      d.onclick = () => {
        currentLang = d.dataset.lang;
        popup.style.display = "none";
        isSpeaking = true;
        langBtn.textContent = "⏹ Stop";
        document.getElementById("greetingText").textContent =
          greetings[currentLang](getPlantName());
        speechSynthesis.speak(
          new SpeechSynthesisUtterance(
            greetingSpeech[currentLang](getPlantName())
          )
        );
      };
    });
  }

  render();
});

window.addEventListener("beforeunload", () => speechSynthesis.cancel());
