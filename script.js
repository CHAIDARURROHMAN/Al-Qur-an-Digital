// script.js yang Bersih dan Fokus Koneksi
const apiUrl = 'https://equran.id/api/v2/surat'; 
const container = document.getElementById('quran-list-container');

function loadSurahList() {
    container.innerHTML = '<p class="loading">Memuat daftar surah...</p>'; 

    // Menggunakan try-catch untuk penanganan error yang lebih baik
    try {
        fetch(apiUrl)
            .then(response => {
                // Tambahkan penanganan error HTTP (misal: 404 atau 500)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                container.innerHTML = ''; // Hapus pesan memuat

                if (data.code === 200 && data.data) {
                    data.data.forEach(surah => {
                        const card = document.createElement('div');
                        card.className = 'surah-card';
                        card.setAttribute('data-nomor', surah.nomor); 
                        
                        card.innerHTML = `
                            <div class="surah-number">${surah.nomor}</div>
                            <div class="surah-details">
                                <h3>${surah.namaLatin}</h3>
                                <p>${surah.arti} (${surah.jumlahAyat} ayat)</p>
                                <p class="arab">${surah.nama}</p>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = '<p class="error">Gagal memuat data surah. Respon API tidak valid.</p>';
                }
            })
            .catch(error => {
                // Menampilkan error jika API diblokir atau terjadi Timeout
                console.error('Error fetching data:', error);
                container.innerHTML = `<p class="error">Gagal memuat. API mungkin diblokir atau Timeout. Detail: ${error.message}</p>`;
            });
    } catch (error) {
        container.innerHTML = `<p class="error">Terjadi kesalahan fatal saat memulai fetch. ${error.message}</p>`;
    }
}

// Inisialisasi: Memuat konten
document.addEventListener('DOMContentLoaded', () => {
    loadSurahList();
});
