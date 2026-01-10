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

  /* ---------------- AGE ---------------- */
  function calculateAge(dateString) {
    if (!dateString) return "My age is a little secret 🤫.";
    const planted = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - planted.getFullYear();
    const m = today.getMonth() - planted.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < planted.getDate())) age--;
    return age >= 0 ? `I am about ${age} years old.` : "My age is a little secret 🤫.";
  }

  /* ---------------- GREETINGS ---------------- */
  const greetings = {
    en: p => `Hi! I'm ${p}, flourishing at HKBK 🌿.`,
    kn: p => `ನಮಸ್ಕಾರ! ನಾನು ${p}, HKBKನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ 🌿.`,
    ta: p => `வணக்கம்! நான் ${p}, HKBK வளாகத்தில் நன்றாக வளர்ந்து கொண்டிருக்கிறேன் 🌿.`,
    te: p => `నమస్కారం! నేను ${p}, HKBKలో సంతోషంగా పెరుగుతున్నాను 🌿.`,
    ml: p => `നമസ്കാരം! ഞാൻ ${p}, HKBK ക്യാമ്പസിൽ നന്നായി വളരുന്നു 🌿.`,
    hi: p => `नमस्ते! मैं ${p}, HKBK में अच्छी तरह से बढ़ रहा हूँ 🌿.`
  };

  const speechLang = {
    en: "en-IN",
    kn: "kn-IN",
    ta: "ta-IN",
    te: "te-IN",
    ml: "ml-IN",
    hi: "hi-IN"
  };

  /* ---------------- PLANT NAME MAP (ALL 56) ---------------- */
  const plantNameMap = {
    1:{en:"Copperleaf",kn:"ತಾಮ್ರ ಎಲೆ ಸಸ್ಯ",ta:"செம்பருத்தி இலை",te:"కాపర్ లీఫ్",ml:"കോപ്പർലീഫ്",hi:"कॉपरलीफ"},
    2:{en:"Aloe Vera",kn:"ಲೋಳೆಸರ",ta:"கற்றாழை",te:"కలబంద",ml:"കറ്റാർവാഴ",hi:"घृतकुमारी"},
    3:{en:"Sugar Apple",kn:"ಸೀತಾಫಲ",ta:"சீதாப்பழம்",te:"సీతాఫలం",ml:"സീതപ്പഴം",hi:"सीताफल"},
    4:{en:"Arborvitae",kn:"ತುಜಾ ಮರ",ta:"துஜா மரம்",te:"తూజా చెట్టు",ml:"തുജ",hi:"थूजा"},
    5:{en:"Avocado",kn:"ಅವಕಾಡೊ",ta:"அவகேடோ",te:"అవకాడో",ml:"അവക്കാഡോ",hi:"एवोकाडो"},
    6:{en:"Bamboo",kn:"ಬಿದಿರು",ta:"மூங்கில்",te:"వెదురు",ml:"മുള",hi:"बाँस"},
    7:{en:"Banana",kn:"ಬಾಳೆ",ta:"வாழை",te:"అరటి",ml:"വാഴ",hi:"केला"},
    8:{en:"Banyan Tree",kn:"ಆಲದ ಮರ",ta:"ஆலமரம்",te:"మర్రి చెట్టు",ml:"ആൽമരം",hi:"बरगद"},
    9:{en:"Red Malabar Spinach",kn:"ಬಸಲೆ ಸೊಪ್ಪು",ta:"பசலைக்கீரை",te:"బచ్చలి కూర",ml:"ബസല",hi:"पोई साग"},
    10:{en:"Canna",kn:"ಕಣ್ಣ ಹೂವು",ta:"கன்னா",te:"కన్నా",ml:"കന്ന",hi:"कन्ना"},
    11:{en:"Caricature Plant",kn:"ಕಾಮಿಕ್ಸ್ ಸೊಪ್ಪು",ta:"கரிகேச்சர் செடி",te:"కారికేచర్ మొక్క",ml:"കാരിക്കേച്ചർ",hi:"कारिकेचर पौधा"},
    12:{en:"Castor Bean",kn:"ಎರೆಂಡೆ",ta:"ஆமணக்கு",te:"ఆముదం",ml:"ആമണക്ക",hi:"अरंडी"},
    13:{en:"Ti Plant",kn:"ಟಿ ಮರ",ta:"டி செடி",te:"టి మొక్క",ml:"ടി പ്ലാന്റ്",hi:"टी पौधा"},
    14:{en:"Crape Jasmine",kn:"ನಂದಿಬಟ್ಟಲು",ta:"நந்தியாவட்டை",te:"నందివర్ధనం",ml:"നന്ദിയാവട്ട",hi:"चांदनी"},
    15:{en:"Croton",kn:"ಕ್ರೋಟನ್",ta:"க்ரோட்டன்",te:"క్రోటాన్",ml:"ക്രോട്ടൺ",hi:"क्रोटन"},
    16:{en:"Crown of Thorns",kn:"ಕಂಟೆ ಗಿಡ",ta:"முள்ளுக்கிரீடம்",te:"ముల్ల మొక్క",ml:"മുള്‍ച്ചെടി",hi:"क्राउन ऑफ थॉर्न्स"},
    17:{en:"Emerald Green Thuja",kn:"ಹಸಿರು ಥುಜಾ",ta:"பச்சை துஜா",te:"పచ్చ తూజా",ml:"പച്ച തുജ",hi:"ग्रीन थूजा"},
    18:{en:"Canadian Horseweed",kn:"ಕೆನಡಾ ಸೊಪ್ಪು",ta:"குதிரைவால் செடி",te:"గుర్రపు తోక మొక్క",ml:"ഹോഴ്‌സ് വീഡ്",hi:"घोड़े की पूंछ"},
    19:{en:"False Ashoka",kn:"ಸೀತಾ ಅಶೋಕ",ta:"அசோக மரம்",te:"సీతాశోక",ml:"സീത അശോക",hi:"अशोक"},
    20:{en:"Flame Tree",kn:"ಅಗ್ನಿ ಮರ",ta:"தீமரம்",te:"అగ్ని చెట్టు",ml:"അഗ്നി വൃക്ഷം",hi:"गुलमोहर"},
    21:{en:"Frangipani",kn:"ಚಂಪಾ",ta:"சாம்பங்கி",te:"చంపా",ml:"ചമ്പ",hi:"चंपा"},
    22:{en:"Guava",kn:"ಪೇರಲೆ",ta:"கொய்யா",te:"జామ",ml:"പേര",hi:"अमरूद"},
    23:{en:"Hibiscus",kn:"ದಾಸವಾಳ",ta:"செம்பருத்தி",te:"మందార",ml:"ചെമ്പരത്തി",hi:"गुड़हल"},
    24:{en:"Jamaica Cherry",kn:"ಮುನ್ತಿಂಗಿಯಾ",ta:"ஜமைக்கா செர்ரி",te:"జమైకా చెర్రీ",ml:"ജമൈക്ക ചെറി",hi:"जमैका चेरी"},
    25:{en:"Jungle Flame",kn:"ವನ್ಯ ಫ್ಲೇಮ್",ta:"காட்டுத்தீ பூ",te:"అడవి జ్వాల",ml:"ജംഗിൾ ഫ്ലേം",hi:"जंगल ज्वाला"},
    26:{en:"Madagascar Dragon Tree",kn:"ಡ್ರಾಕೇನಾ",ta:"டிராகன் மரம்",te:"డ్రాగన్ ట్రీ",ml:"ഡ്രാസീന",hi:"ड्रैगन ट्री"},
    27:{en:"Mango",kn:"ಮಾವು",ta:"மாமரம்",te:"మామిడి",ml:"മാങ്ങ",hi:"आम"},
    28:{en:"Noni",kn:"ನೋನಿ",ta:"நோனி",te:"నోని",ml:"നോണി",hi:"नोनी"},
    29:{en:"Drumstick Tree",kn:"ನುಗ್ಗೆಕಾಯಿ ಮರ",ta:"முருங்கை",te:"మునగ",ml:"മുരിങ്ങ",hi:"सहजन"},
    30:{en:"Neem",kn:"ಬೇವು",ta:"வேம்பு",te:"వేప",ml:"വേപ്പ്",hi:"नीम"},
    31:{en:"Nile Trumpet Tree",kn:"ನೀಲಿ ಟ್ರಂಪೆಟ್ ಮರ",ta:"நீல குழல் மரம்",te:"నీలి ట్రంపెట్",ml:"നീല ട്രമ്പറ്റ്",hi:"नीला ट्रम्पेट"},
    32:{en:"Norfolk Island Pine",kn:"ನಾರ್ಫೋಕ್ ಪೈನ್",ta:"நார்ஃபோக் பைன்",te:"నార్ఫోక్ పైన్",ml:"നോർഫോക്ക് പൈൻ",hi:"नॉरफ़ॉक पाइन"},
    33:{en:"Oleander",kn:"ಕನೇರ",ta:"அரளி",te:"గన్నేరు",ml:"അരളി",hi:"कनेर"},
    34:{en:"Pacific Mahogany",kn:"ಪೆಸಿಫಿಕ್ ಮಹೋಗನಿ",ta:"மகோகனி",te:"మహాగని",ml:"മഹോഗനി",hi:"महोगनी"},
    35:{en:"Peepal Tree",kn:"ಅರಳಿ ಮರ",ta:"அரசமரம்",te:"అశ్వత్థం",ml:"അരയാൽ",hi:"पीपल"},
    36:{en:"Periwinkle",kn:"ಸದಾ ಸೊಪ್ಪು",ta:"நித்திய கல்யாணி",te:"బిల్ల గన్నేరు",ml:"നിത്യകല്യാണി",hi:"सदाबहार"},
    37:{en:"Persian Silk Tree",kn:"ಜುಬ್ಬು ಮರ",ta:"பர்ஷியன் சில்க் மரம்",te:"పర్షియన్ సిల్క్",ml:"പേർഷ്യൻ സിൽക്ക്",hi:"रेशमी वृक्ष"},
    38:{en:"Plumeria Pudica",kn:"ಪ್ಲುಮೇರಿಯಾ",ta:"ப்ளூமேரியா",te:"ప్లూమేరియా",ml:"പ്ലുമേറിയ",hi:"प्लूमेरिया"},
    39:{en:"Monkey’s Comb",kn:"ವಳ್ಳೆಚೆಂಬು ಮರ",ta:"குரங்கு சீப்பு",te:"కోతి దువ్వెన",ml:"കുരങ്ങൻ ചീപ്പ്",hi:"बंदर कंघी"},
    40:{en:"Pongamia",kn:"ಹೊಂಗೆ",ta:"புங்கன்",te:"కనుగ",ml:"പൊങ്ങാമിയ",hi:"करंज"},
    41:{en:"Pomegranate",kn:"ದಾಳಿಂಬೆ",ta:"மாதுளை",te:"దానిమ్మ",ml:"മാതളം",hi:"अनार"},
    42:{en:"Rain Tree",kn:"ಮಳೆ ಮರ",ta:"மழைமரம்",te:"వర్ష వృక్షం",ml:"മഴവൃക്ഷം",hi:"रेन ट्री"},
    43:{en:"Rose",kn:"ಗುಲಾಬಿ",ta:"ரோஜா",te:"గులాబీ",ml:"റോസ്",hi:"गुलाब"},
    44:{en:"Fringed Rue",kn:"ರು ಸೊಪ್ಪು",ta:"ரூ செடி",te:"రూ మొక్క",ml:"റൂ",hi:"रू"},
    45:{en:"Sago Palm",kn:"ಸೈಕಸ್",ta:"சாகோ பாம்",te:"సాగో పామ్",ml:"സാഗോ പാം",hi:"सागो पाम"},
    46:{en:"Silky Oak",kn:"ಬೆಳ್ಳಿದ ಮರ",ta:"சில்கி ஓக்",te:"సిల్కీ ఓక్",ml:"സിൽക്കി ഓക്ക്",hi:"सिल्की ओक"},
    47:{en:"Snake Plant",kn:"ನಾಗದಾಳ",ta:"நாகப்பூ",te:"స్నేక్ ప్లాంట్",ml:"സ്നേക്ക് പ്ലാന്റ്",hi:"स्नेक प्लांट"},
    48:{en:"Toddy Palm",kn:"ತಾಳೆ ಮರ",ta:"தாளை மரம்",te:"తాటి చెట్టు",ml:"താളിമരം",hi:"ताड़"},
    49:{en:"Tropical Almond",kn:"ಬಾದಾಮಿ ಮರ",ta:"கடல்பாதாம்",te:"బాదం చెట్టు",ml:"കടൽബദാം",hi:"जंगली बादाम"},
    50:{en:"Tropical Milkweed",kn:"ಅರಳಿ ಸೊಪ್ಪು",ta:"பால் முள்",te:"పాలమొక్క",ml:"പാൽചെടി",hi:"आक"},
    51:{en:"Tuckeroo",kn:"ಟಕರೂ",ta:"டகரூ",te:"టకరూ",ml:"ടക്കറൂ",hi:"टकरी"},
    52:{en:"Umbrella Plant",kn:"ಛತ್ರ ಸಸ್ಯ",ta:"குடை செடி",te:"గొడుగు మొక్క",ml:"കുടചെടി",hi:"छत्र पौधा"},
    53:{en:"Wax Mallow",kn:"ಮೆಣಸು ಸೊಪ್ಪು",ta:"மெழுகு மல்லோ",te:"మైల మల్లో",ml:"വാക്സ് മാലോ",hi:"वैक्स मल्लो"},
    54:{en:"Coffee Plant",kn:"ಕಾಫಿ ಗಿಡ",ta:"காப்பி செடி",te:"కాఫీ మొక్క",ml:"കാപ്പി ചെടി",hi:"कॉफी पौधा"},
    55:{en:"Karo",kn:"ಕಾರೋ",ta:"கரோ",te:"కారో",ml:"കാരോ",hi:"कारो"},
    56:{en:"Star Gooseberry",kn:"ನೆಲ್ಲಿಕಾಯಿ",ta:"நெல்லிக்காய்",te:"ఉసిరికాయ",ml:"നെല്ലിക്ക",hi:"आंवला"}
  };

  let currentLang = "en";
  let isSpeaking = false;

  function speak(text, lang) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onend = () => {
      isSpeaking = false;
      langBtn.textContent = "🌐 Language";
    };
    speechSynthesis.speak(u);
  }

  const { data: plant } = await supabaseClient
    .from("plants")
    .select("*")
    .eq("id", plantId)
    .single();

  const getName = () => plantNameMap[plantId]?.[currentLang] || plant.common_name;
  const ageText = calculateAge(plant.date_of_planting);

  container.innerHTML = `
    <h2 id="greet">${greetings.en(getName())}</h2>
    <button id="langBtn">🌐 Language</button>
    <div id="langs">
      <div data-l="en">English</div>
      <div data-l="kn">ಕನ್ನಡ</div>
      <div data-l="ta">தமிழ்</div>
      <div data-l="te">తెలుగు</div>
      <div data-l="ml">മലയാളം</div>
      <div data-l="hi">हिन्दी</div>
    </div>
  `;

  const greet = document.getElementById("greet");
  const langBtn = document.getElementById("langBtn");

  document.querySelectorAll("#langs div").forEach(d => {
    d.onclick = () => {
      currentLang = d.dataset.l;
      const text = greetings[currentLang](getName());
      greet.textContent = text;
      langBtn.textContent = "⏹ Stop";
      isSpeaking = true;
      speak(text, speechLang[currentLang]);
    };
  });

});
