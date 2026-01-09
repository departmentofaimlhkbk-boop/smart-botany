document.addEventListener("DOMContentLoaded", async () => {

  // Run ONLY on plant.html
  if (!window.location.pathname.includes("plant.html")) return;

  const container = document.getElementById("plant-card");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const plantId = Number(params.get("id"));

  if (!plantId || isNaN(plantId)) {
    container.innerHTML = "<p>❌ Invalid plant ID.</p>";
    return;
  }

  // ✅ Age calculation (auto updates every year)
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
        .map(url => `
          <img src="${url.trim()}"
               style="width:160px;margin:6px;border-radius:8px"
               onerror="this.style.display='none'">
        `)
        .join("");
    }

    const ageText = calculateAge(plant.date_of_planting);

    // ---------- PAGE CONTENT (TABLE STYLE – SAME AS OLD) ----------
    container.innerHTML = `
      <h2>${plant.common_name}</h2>

      <button id="speakBtn"
        style="margin:10px 0;padding:8px 14px;border:none;
               background:#2e7d32;color:white;
               border-radius:6px;cursor:pointer;">
        🔊 Speak
      </button>

      <table class="plant-table">
        <tr>
          <th>Scientific Name</th>
          <td>My scientific name is ${plant.scientific_name || "still being studied"}.</td>
        </tr>
        <tr>
          <th>Category</th>
          <td>I belong to the ${plant.category || "plant"} category.</td>
        </tr>
        <tr>
          <th>Origin</th>
          <td>
            ${plant.origin
              ? `I originally come from ${plant.origin}, but now I happily grow here.`
              : "My origin is a bit of a mystery."}
          </td>
        </tr>
        <tr>
          <th>Date of Planting</th>
          <td>
            ${plant.date_of_planting
              ? `I was planted on ${plant.date_of_planting}.`
              : "I don’t remember the exact date I was planted 🌱."}
          </td>
        </tr>
        <tr>
          <th>Age</th>
          <td>${ageText}</td>
        </tr>
        <tr>
          <th>Seasonal Flowering</th>
          <td>
            ${plant.seasonal_flowering
              ? `I bloom during ${plant.seasonal_flowering}.`
              : "I may surprise you with flowers anytime!"}
          </td>
        </tr>
        <tr>
          <th>Quantitative Data</th>
          <td>
            ${plant.quantitative_data
              ? `Here’s a fun fact about me: ${plant.quantitative_data}.`
              : "I don’t have extra numbers to share yet."}
          </td>
        </tr>
        <tr>
          <th>Geo Location</th>
          <td>
            ${plant.geo_location
              ? `You can find me at ${plant.geo_location}.`
              : "My exact location is kept private."}
          </td>
        </tr>
        <tr>
          <th>Max Height</th>
          <td>
            ${plant.max_height
              ? `I can grow up to ${plant.max_height}.`
              : "I’m still growing taller!"}
          </td>
        </tr>
        <tr>
          <th>Water Requirement</th>
          <td>
            ${plant.water_requirement
              ? `I grow best with ${plant.water_requirement}.`
              : "I’m not very picky about water."}
          </td>
        </tr>
        <tr>
          <th>Medicinal Value</th>
          <td>
            ${plant.medicinal_value
              ? `People value me because ${plant.medicinal_value}.`
              : "I don’t have known medicinal uses."}
          </td>
        </tr>
        <tr>
          <th>Additional Info</th>
          <td>
            ${plant.additional_info || "That’s all about me for now 😊."}
          </td>
        </tr>
        <tr>
          <th>Images</th>
          <td>${imagesHTML}</td>
        </tr>
      </table>
    `;

    // ---------- SPEAK (ONLY CONTENT, NO HEADINGS) ----------
    const speakBtn = document.getElementById("speakBtn");
    let isSpeaking = false;

    speakBtn.addEventListener("click", () => {
      if (!isSpeaking) {
        const contentText = Array.from(
          container.querySelectorAll("td")
        ).map(td => td.innerText).join(" ");

        const utterance = new SpeechSynthesisUtterance(contentText);
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

// Stop speech on page exit
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});
