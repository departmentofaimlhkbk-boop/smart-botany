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
    ta: p => `வணக்கம்! நான் ${p}, ${campusText} வளாகத்தில் நன்றாக வளர்ந்து கொண்டிருக்கிறேன் 🌿.`,
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
    en: "en-IN",
    kn: "kn-IN",
    ta: "ta-IN",
    te: "te-IN",
    ml: "ml-IN",
    hi: "hi-IN"
  };

  /* ---------- MULTILINGUAL VALUE TEMPLATES ---------- */
  const valueText = {
    en: {
      sci: v => `My scientific name is ${v}.`,
      cat: v => `I belong to the ${v} category.`,
      org: v => `I originally come from ${v}.`,
      plant: v => `I was planted on ${v}.`,
      age: v => v,
      flow: v => `I bloom during ${v}.`,
      quan: v => `Here is a fact about me: ${v}.`,
      geo: v => `You can find me at ${v}.`,
      height: v => `I can grow up to ${v}.`,
      water: v => `I grow best with ${v}.`,
      med: v => `I am valued because ${v}.`
    },
    kn: {
      sci: v => `ನನ್ನ ವೈಜ್ಞಾನಿಕ ಹೆಸರು ${v}.`,
      cat: v => `ನಾನು ${v} ವರ್ಗಕ್ಕೆ ಸೇರಿದ್ದೇನೆ.`,
      org: v => `ನಾನು ಮೂಲತಃ ${v}ನಿಂದ ಬಂದಿದ್ದೇನೆ.`,
      plant: v => `ನನ್ನನ್ನು ${v} ರಂದು ನೆಡಲಾಯಿತು.`,
      age: v => v,
      flow: v => `ನಾನು ${v} ಸಮಯದಲ್ಲಿ ಹೂ ಬಿಡುತ್ತೇನೆ.`,
      quan: v => `ನನ್ನ ಬಗ್ಗೆ ಒಂದು ಮಾಹಿತಿ: ${v}.`,
      geo: v => `ನನ್ನನ್ನು ${v} ನಲ್ಲಿ ಕಾಣಬಹುದು.`,
      height: v => `ನಾನು ${v} ವರೆಗೆ ಬೆಳೆಯಬಹುದು.`,
      water: v => `ನಾನು ${v} ನೀರಿನಿಂದ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತೇನೆ.`,
      med: v => `ನನ್ನ ಔಷಧೀಯ ಮೌಲ್ಯ: ${v}.`
    },
    ta: {
      sci: v => `என் அறிவியல் பெயர் ${v}.`,
      cat: v => `நான் ${v} வகையை சேர்ந்தவன்.`,
      org: v => `நான் முதலில் ${v} இலிருந்து வந்தேன்.`,
      plant: v => `என்னை ${v} அன்று நட்டனர்.`,
      age: v => v,
      flow: v => `நான் ${v} காலத்தில் பூக்கும்.`,
      quan: v => `என்னைப் பற்றிய ஒரு தகவல்: ${v}.`,
      geo: v => `என்னை ${v} இடத்தில் காணலாம்.`,
      height: v => `நான் ${v} வரை வளரக்கூடும்.`,
      water: v => `நான் ${v} நீரால் நன்றாக வளர்கிறேன்.`,
      med: v => `என் மருத்துவ பயன்பாடு: ${v}.`
    },
    te: {
      sci: v => `నా శాస్త్రీయ పేరు ${v}.`,
      cat: v => `నేను ${v} వర్గానికి చెందినవాడిని.`,
      org: v => `నేను మొదట ${v} నుంచి వచ్చాను.`,
      plant: v => `నన్ను ${v} నాటారు.`,
      age: v => v,
      flow: v => `నేను ${v} సమయంలో పుష్పిస్తాను.`,
      quan: v => `నన్ను గురించి ఒక విషయం: ${v}.`,
      geo: v => `నన్ను ${v} వద్ద చూడవచ్చు.`,
      height: v => `నేను ${v} వరకు పెరుగుతాను.`,
      water: v => `నేను ${v} నీటితో బాగా పెరుగుతాను.`,
      med: v => `నా ఔషధ గుణం: ${v}.`
    },
    ml: {
      sci: v => `എന്റെ ശാസ്ത്രീയ പേര് ${v}.`,
      cat: v => `ഞാൻ ${v} വിഭാഗത്തിൽപ്പെടുന്നു.`,
      org: v => `ഞാൻ ആദ്യം ${v} നിന്നാണ്.`,
      plant: v => `എന്നെ ${v} ന് നട്ടു.`,
      age: v => v,
      flow: v => `ഞാൻ ${v} കാലത്ത് പൂക്കും.`,
      quan: v => `എന്നെക്കുറിച്ചുള്ള ഒരു വിവരം: ${v}.`,
      geo: v => `എന്നെ ${v} ൽ കാണാം.`,
      height: v => `ഞാൻ ${v} വരെ വളരും.`,
      water: v => `ഞാൻ ${v} വെള്ളത്തിൽ നന്നായി വളരും.`,
      med: v => `എന്റെ ഔഷധ മൂല്യം: ${v}.`
    },
    hi: {
      sci: v => `मेरा वैज्ञानिक नाम ${v} है।`,
      cat: v => `मैं ${v} श्रेणी से संबंधित हूँ।`,
      org: v => `मैं मूल रूप से ${v} से हूँ।`,
      plant: v => `मुझे ${v} को लगाया गया था।`,
      age: v => v,
      flow: v => `मैं ${v} के समय खिलता हूँ।`,
      quan: v => `मेरे बारे में एक तथ्य: ${v}।`,
      geo: v => `मुझे ${v} में पाया जा सकता है।`,
      height: v => `मैं ${v} तक बढ़ सकता हूँ।`,
      water: v => `मैं ${v} पानी में अच्छे से बढ़ता हूँ।`,
      med: v => `मेरे औषधीय गुण: ${v}।`
    }
  };

  /* ---------- FETCH DATA ---------- */
  const { data: plant } = await supabaseClient
    .from("plants")
    .select("*")
    .eq("id", plantId)
    .single();

  let currentLang = "en";
  let isSpeaking = false;

  const ageText = calculateAge(plant.date_of_planting);

  const getName = () =>
    plantNameMap[plant.id]?.[currentLang] || plant.common_name;

  /* ---------- RENDER ---------- */
  function render() {
    container.innerHTML = `
      <h2 id="greetingText">${greetings[currentLang](getName())}</h2>

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
        <tr><th>Scientific Name</th><td>${valueText[currentLang].sci(plant.scientific_name)}</td></tr>
        <tr><th>Category</th><td>${valueText[currentLang].cat(plant.category)}</td></tr>
        <tr><th>Origin</th><td>${valueText[currentLang].org(plant.origin)}</td></tr>
        <tr><th>Date of Planting</th><td>${valueText[currentLang].plant(plant.date_of_planting)}</td></tr>
        <tr><th>Age</th><td>${valueText[currentLang].age(ageText)}</td></tr>
        <tr><th>Seasonal Flowering</th><td>${valueText[currentLang].flow(plant.seasonal_flowering)}</td></tr>
        <tr><th>Quantitative Data</th><td>${valueText[currentLang].quan(plant.quantitative_data)}</td></tr>
        <tr><th>Geo Location</th><td>${valueText[currentLang].geo(plant.geo_location)}</td></tr>
        <tr><th>Max Height</th><td>${valueText[currentLang].height(plant.max_height)}</td></tr>
        <tr><th>Water Requirement</th><td>${valueText[currentLang].water(plant.water_requirement)}</td></tr>
        <tr><th>Medicinal Value</th><td>${valueText[currentLang].med(plant.medicinal_value)}</td></tr>
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
        render();
        isSpeaking = true;
        langBtn.textContent = "⏹ Stop";
        speechSynthesis.speak(
          new SpeechSynthesisUtterance(
            greetingSpeech[currentLang](getName())
          )
        );
      };
    });
  }

  render();
});

window.addEventListener("beforeunload", () => speechSynthesis.cancel());
