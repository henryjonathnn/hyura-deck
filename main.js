let dataKarakter = null;
let skor = 0;

// Function untuk load data kartu karakter
async function loadDataKarakter() {
  try {
    const response = await fetch("karakter.json");
    if (!response.ok) {
      throw new Error("Gagal load data karakter!");
    }
    dataKarakter = await response.json();
    return dataKarakter;
  } catch (error) {
    alert("Error load data karakter, sepertinya ada masalah pada server");
  }
}

// Function untuk menentukan rarity kartu berdasarkan probabilitas
function determineRarity() {
  const acak = Math.random();
  let probabilitas = 0;

  for (const [rarity, config] of Object.entries(dataKarakter.rarityConfig)) {
    probabilitas += config.chance;
    if (acak <= probabilitas) {
      return rarity;
    }
  }
  return "common"; //Fallback
}

// Function untuk mendapatkan karakter secara random dengan rarity yg spesifik
function getKarakterRandom(rarity) {
  const karakterRandom = dataKarakter.karakters.filter(
    (char) => char.rarity === rarity
  );
  if (karakterRandom.length === 0) {
    console.error(`Tidak ada karakter yang cocok dengan rarity: ${rarity}`);
    return null;
  }
  const randomIndex = Math.floor(Math.random() * karakterRandom.length);

  return karakterRandom[randomIndex];
}

// Function untuk update skor
function updateSkor(rarity) {
  const nilaSkor = {
    common: 2,
    rare: 5,
    epic: 10,
    legend: 20,
  };

  skor += nilaSkor[rarity];
  const skorElement = document.getElementById("scorePemain");
  if (skorElement) {
    skorElement.textContent = skor;
  }
}

// Function untuk create class badge element
function createClassBadge(className) {
  return `<span class="px-2 sm:px-3 py-1 rounded-md bg-purple-900/20 text-purple-400 text-xs font-semibold">${className}</span>`;
}

// Function untuk update UI kartu
function updateCardUI(karakter) {
  if (!karakter) return;

  const rarityConfig = dataKarakter.rarityConfig[karakter.rarity];

  const cardId = document.getElementById("cardId");
  const cardRarity = document.getElementById("cardRarity");
  if (cardId) cardId.textContent = `#${karakter.id}`;
  if (cardRarity) {
    cardRarity.textContent =
      karakter.rarity.charAt(0).toUpperCase() + karakter.rarity.slice(1);
    cardRarity.className = `text-sm rarity-${karakter.rarity}`;
  }

  const gambarKarakter = document.getElementById("gambarKarakter");
  if (gambarKarakter) {
    gambarKarakter.src = karakter.image;
    gambarKarakter.alt = karakter.name;
  }

  const namaKarakter = document.getElementById("namaKarakter");
  if (namaKarakter) namaKarakter.textContent = karakter.name;

  const classKarakter = document.getElementById("classKarakter");
  if (classKarakter) {
    classKarakter.innerHTML = karakter.class.map(createClassBadge).join("");
  }

  const hpKarakter = document.getElementById("hpKarakter");
  if (hpKarakter) hpKarakter.textContent = `HP: ${karakter.stats.hp}`;

  const elemenStat = {
    atk: document.getElementById("statAtk"),
    def: document.getElementById("statDef"),
    spd: document.getElementById("statSpd"),
  };

  for (const [stat, elemen] of Object.entries(elemenStat)) {
    if (elemen) elemen.textContent = karakter.stats[stat];
  }
}
