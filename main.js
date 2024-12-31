let dataKarakter = null;
let score = 0;

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
