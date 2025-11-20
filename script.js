// URL API
const apiUrlList = 'https://equran.id/api/v2/surat';
const apiUrlDetail = 'https://equran.id/api/v2/surat/'; 
const container = document.getElementById('quran-list-container');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');

// =========================================================================
// 1. FUNGSI UNTUK MEMUAT DAFTAR 114 SURAH
// =========================================================================
function loadSurahList() {
    // Tampilkan Header Awal
    headerTitle.textContent = "Al-Qur'an Digital";
    headerSubtitle.textContent = "Akses 114 Surat Lengkap dengan Terjemahan Bahasa Indonesia";
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
                        <div class="surah-number" data-nomor="${surah.nomor}"></div> 
                        <div class="surah-details">
                            <h3>${surah.namaLatin}</h3>
                            <p>${surah.arti} | Mulai Juz ${surah.juz} (${surah.jumlahAyat} ayat)</p>
                            <p class="arab">${surah.nama}</p>
                        </div>
                    `;
                    container.appendChild(card);
                    
                    // Menambahkan Listener Klik
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
            container.innerHTML = `<p class="error">Gagal memuat daftar surah. Cek koneksi. Detail: ${error.message}</p>`;
        });
}

// =========================================================================
// 2. FUNGSI UNTUK MEMUAT DETAIL ISI SURAH
// =========================================================================
function loadSurahDetail(nomorSurah, namaSurah) {
    const fullUrl = `${apiUrlDetail}${nomorSurah}`;
    
    headerTitle.textContent = namaSurah;
    headerSubtitle.textContent = `Memuat isi Surah ${namaSurah}...`;
    container.innerHTML = '<p class="loading">Memuat ayat-ayat...</p>';
    
    fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = '';

            if (data.code === 200 && data.data) {
                const surah = data.data;

                // Tombol Kembali ke Daftar
                container.innerHTML += `<button id="back-button">Kembali ke Daftar Surah</button>`;
                document.getElementById('back-button').addEventListener('click', loadSurahList);
                
                // Update Header dengan Info Surah
                headerSubtitle.textContent = `${surah.namaLatin} (${surah.arti}) - ${surah.jumlahAyat} Ayat`;

                // Tampilkan Setiap Ayat
                surah.ayat.forEach(ayat => {
                    const ayatCard = document.createElement('div');
                    ayatCard.className = 'ayat-card';
                    
                    ayatCard.innerHTML = `
                        <div class="ayat-nomor">${surah.nomor}:${ayat.nomorAyat}</div>
                        <p class="text-arab">${ayat.teksArab}</p>
                        <p class="text-terjemah">${ayat.teksIndonesia}</p> 
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
document.addEventListener('DOMContentLoaded', loadSurahList);
