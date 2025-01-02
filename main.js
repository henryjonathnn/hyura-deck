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
    console.error("Error loading data:", error);
    alert("Error load data karakter, sepertinya ada masalah pada server");
    throw error;
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
  const karakterRandom = dataKarakter.karakter.filter(
    (char) => char.rarity.toLowerCase() === rarity.toLowerCase()
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
    legendary: 20,
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

    cardRarity.className = "text-sm";
    cardRarity.style.color = rarityConfig.color;
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
    classKarakter.innerHTML = karakter.classes.map(createClassBadge).join("");
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

  const gameCard = document.querySelector(".game-card");
  if (gameCard) {
    gameCard.classList.add("opacity-0");
    setTimeout(() => {
      gameCard.classList.remove("opacity-0");
      gameCard.classList.add("opacity-100");
    }, 50);
  }

  if (gameCard && rarityConfig.borderColor) {
    gameCard.className = gameCard.className.replace(/border-\w+-500/g, "");
    gameCard.classList.add(rarityConfig.borderColor);
  }
}

// Function untuk menampilkan kartu default
async function kartuDefault() {
  if (!dataKarakter) {
    await loadDataKarakter();
  }

  const rarity = determineRarity();
  const karakter = getKarakterRandom(rarity);

  if (karakter) {
    updateCardUI(karakter);
  }
}

// Function untuk menampilkan loading
function showLoading() {
  const loadingAnimation = document.getElementById("loadingAnimation");
  if (loadingAnimation) {
    loadingAnimation.style.opacity = "0";
    loadingAnimation.style.display = "flex";

    requestAnimationFrame(() => {
      loadingAnimation.style.transition = "opacity 0.5s ease";
      loadingAnimation.style.opacity = "1";
    });
  }
}

// Function untuk menutup loading
function hideLoading() {
  const loadingAnimation = document.getElementById("loadingAnimation");
  if (loadingAnimation) {
    loadingAnimation.style.transition = "opacity 0.5s ease";
    loadingAnimation.style.opacity = "0";

    setTimeout(() => {
      loadingAnimation.style.display = "none";
    }, 500);
  }
}

// Function generate kartu baru
async function generateKartuBaru() {
  if (!dataKarakter) {
    await loadDataKarakter();
  }

  showLoading();

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const rarity = determineRarity();
    const karakter = getKarakterRandom(rarity);

    if (karakter) {
      updateCardUI(karakter);
      updateSkor(rarity);
    }
  } finally {
    hideLoading();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadDataKarakter();
    await kartuDefault();

    const generateBtn = document.getElementById("generateBtn");
    if (generateBtn) {
      generateBtn.addEventListener("click", generateKartuBaru);
    }
  } catch (error) {
    console.error("Error saat inisialisasi:", error);
    alert("Terjadi kesalahan saat memuat aplikasi");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const welcomeModal = document.getElementById('welcomeModal');
  const startButton = document.getElementById('startButton');
  
  setTimeout(() => {
    welcomeModal.style.display = 'flex';
  }, 1000);
  
  startButton.addEventListener('click', () => {
    welcomeModal.classList.add('hiding');
    setTimeout(() => {
      welcomeModal.style.display = 'none';
      welcomeModal.classList.remove('hiding');
    }, 500);
  });
});



// MODAL DAFTAR KARTU
const cardListModal = document.getElementById('cardListModal');
const closeModal = document.getElementById('closeModal');
const cardGrid = document.getElementById('cardGrid');
const rarityFilters = document.getElementById('rarityFilters');
let currentRarity = 'all';
const rarityColors = {
  common: 'text-gray-500',
  rare: 'text-yellow-500',
  epic: 'text-purple-500',
  legendary: 'text-red-500'
};

// Function untuk menampilkan modal
document.querySelector('.btn-primary').addEventListener('click', async () => {
  document.body.style.overflow = 'hidden';
  cardListModal.classList.remove('hidden');
  if (!dataKarakter) {
    await loadDataKarakter();
  }
  displayCards(currentRarity);
});

// Function untuk tutup modal
function closeModalHandler() {
  document.body.style.overflow = '';
  cardListModal.classList.add('hidden');
}

closeModal.addEventListener('click', closeModalHandler);
cardListModal.addEventListener('click', (e) => {
  if (e.target === cardListModal) closeModalHandler();
});

// Handle escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !cardListModal.classList.contains('hidden')) {
    closeModalHandler();
  }
});

// Handle rarity filter jika diklik
rarityFilters.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  
  rarityFilters.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('bg-purple-500/20', 'text-purple-400', 'border', 'border-purple-500/40');
    btn.classList.add('text-gray-400', 'hover:bg-purple-500/10');
  });
  button.classList.remove('text-gray-400', 'hover:bg-purple-500/10');
  button.classList.add('bg-purple-500/20', 'text-purple-400', 'border', 'border-purple-500/40');
  
  currentRarity = button.dataset.rarity;
  displayCards(currentRarity);
});

// Function untuk menampilkan kartu kartu di modal
function displayCards(rarity) {
  if (!dataKarakter) return;
  
  const filteredCards = dataKarakter.karakter.filter(char => 
    rarity === 'all' || char.rarity === rarity
  );
  
  cardGrid.innerHTML = filteredCards.map(char => `
    <div class="bg-[#0A0B1A]/80 border border-purple-500/20 rounded-xl p-3 sm:p-4 hover:border-purple-500/40 transition-all">
      <div class="flex items-start justify-between mb-2 sm:mb-3">
        <span class="px-2 py-1 bg-purple-900/30 rounded-lg text-purple-400 text-xs sm:text-sm font-semibold">
          #${char.id}
        </span>
        <span class="${rarityColors[char.rarity]} text-xs sm:text-sm font-medium">
          ${char.rarity.charAt(0).toUpperCase() + char.rarity.slice(1)}
        </span>
      </div>
      
      <div class="relative h-32 sm:h-40 mb-2 sm:mb-3">
        <img 
          src="${char.image}"
          alt="${char.name}"
          class="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      
      <h3 class="text-sm sm:text-base text-white font-semibold mb-2">${char.name}</h3>
      
      <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        ${char.classes.map(className => `
          <span class="px-2 py-0.5 sm:py-1 bg-purple-900/20 rounded-md text-purple-400 text-xs font-medium">
            ${className}
          </span>
        `).join('')}
      </div>
      
      <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
        <div class="text-center p-1.5 sm:p-2 bg-purple-900/20 rounded-lg">
          <p class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">HP</p>
          <p class="text-xs sm:text-sm font-bold text-white">${char.stats.hp}</p>
        </div>
        <div class="text-center p-1.5 sm:p-2 bg-purple-900/20 rounded-lg">
          <p class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">ATK</p>
          <p class="text-xs sm:text-sm font-bold text-white">${char.stats.atk}</p>
        </div>
        <div class="text-center p-1.5 sm:p-2 bg-purple-900/20 rounded-lg">
          <p class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">DEF</p>
          <p class="text-xs sm:text-sm font-bold text-white">${char.stats.def}</p>
        </div>
        <div class="text-center p-1.5 sm:p-2 bg-purple-900/20 rounded-lg">
          <p class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">SPD</p>
          <p class="text-xs sm:text-sm font-bold text-white">${char.stats.spd}</p>
        </div>
      </div>
    </div>
  `).join('');
}