// URL API
const apiUrlList = 'https://equran.id/api/v2/surat';
// Format URL untuk detail Surah: .../surat/{nomor_surat}
const apiUrlDetail = 'https://equran.id/api/v2/surat/'; 
const container = document.getElementById('quran-list-container');

// =========================================================================
// 1. FUNGSI UNTUK MEMUAT DAFTAR 114 SURAH
// =========================================================================
function loadSurahList() {
    // Tampilkan Header dan Loading
    document.getElementById('header-title').textContent = "Al-Qur'an Digital";
    document.getElementById('header-subtitle').textContent = "Akses 114 Surat Lengkap dengan Terjemahan Bahasa Indonesia";
    container.innerHTML = '<p class="loading">Memuat daftar surah...</p>'; 

    fetch(apiUrlList)
        .then(response => {
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
                    
                    // 🔥🔥 INI KODE BARU: Menambahkan Listener Klik pada setiap card
                    card.addEventListener('click', () => {
                        loadSurahDetail(surah.nomor, surah.namaLatin);
                    });
                });
            } else {
                container.innerHTML = '<p class="error">Gagal memuat data surah.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            container.innerHTML = `<p class="error">Gagal memuat daftar surah. Cek koneksi Anda. Detail: ${error.message}</p>`;
        });
}

// =========================================================================
// 2. FUNGSI BARU: UNTUK MEMUAT DETAIL ISI SURAH
// =========================================================================
function loadSurahDetail(nomorSurah, namaSurah) {
    const fullUrl = `${apiUrlDetail}${nomorSurah}`;
    
    // Tampilkan Header dan Loading Baru
    document.getElementById('header-title').textContent = namaSurah;
    document.getElementById('header-subtitle').textContent = `Memuat isi Surah ${namaSurah}...`;
    container.innerHTML = '<p class="loading">Memuat ayat-ayat...</p>';
    
    fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; // Hapus pesan memuat

            if (data.code === 200 && data.data) {
                const surah = data.data;

                // Tombol Kembali ke Daftar
                container.innerHTML += `<button id="back-button">Kembali ke Daftar Surah</button>`;
                document.getElementById('back-button').addEventListener('click', loadSurahList);
                
                // Update Header dengan Info Surah
                document.getElementById('header-subtitle').textContent = `${surah.namaLatin} (${surah.arti}) - ${surah.jumlahAyat} Ayat`;

                // Tampilkan Setiap Ayat
                surah.ayat.forEach(ayat => {
                    const ayatCard = document.createElement('div');
                    ayatCard.className = 'ayat-card';
                    
                    ayatCard.innerHTML = `
                        <div class="ayat-nomor">${surah.nomor}:${ayat.nomorAyat}</div>
                        <p class="text-arab">${ayat.teksArab}</p>
                        <p class="text-terjemah">${ayat.terjemah}</p>
                    `;
                    container.appendChild(ayatCard);
                });
            } else {
                container.innerHTML = '<p class="error">Gagal memuat detail Surah.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching detail:', error);
            container.innerHTML = `<p class="error">Terjadi kesalahan saat mengambil detail Surah ${namaSurah}.</p>`;
        });
}


// =========================================================================
// 3. INISIALISASI
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Kita perlu sedikit modifikasi di index.html untuk membuat id header terpisah
    loadSurahList();
});
