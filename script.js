// URL API untuk mengambil daftar 114 surah
const apiUrl = 'http://googleusercontent.com/api/v2/surat'; 
const container = document.getElementById('quran-list-container');

// Fungsi utama untuk mengambil dan menampilkan daftar surah
function loadSurahList() {
    container.innerHTML = '<p class="loading">Memuat daftar surah...</p>'; 

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; // Hapus pesan memuat

            // Cek apakah data berhasil diambil (kode 200)
            if (data.code === 200 && data.data) {
                data.data.forEach(surah => {
                    const card = document.createElement('div');
                    card.className = 'surah-card';
                    
                    // Kita akan menggunakan nomor surah untuk fungsionalitas lanjutan di masa depan
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
            console.error('Error fetching data:', error);
            container.innerHTML = '<p class="error">Terjadi kesalahan koneksi. Pastikan Anda terhubung ke internet.</p>';
        });
}

// Fungsi untuk mengaktifkan/menonaktifkan Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    // Simpan pilihan ke local storage agar tetap aktif saat browser dibuka lagi
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Inisialisasi: Memuat konten dan Dark Mode
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek preferensi Dark Mode dari local storage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    // 2. Hubungkan tombol toggle dengan fungsinya
    document.getElementById('mode-toggle').addEventListener('click', toggleDarkMode);
    
    // 3. Muat konten Al-Qur'an
    loadSurahList();
});
