const dataSiswaHariIni = [
    { nisn: "001", nama: "Siti Aminah", kelas: "XI IPS 2", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "002", nama: "Budi Santoso", kelas: "XI MIPA 1", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "003", nama: "Andi Wijaya", kelas: "X MIPA 3", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "004", nama: "Dina Mariana", kelas: "XI IPS 1", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "005", nama: "Eko Prasetyo", kelas: "XII MIPA 2", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "006", nama: "Fani Rahmawati", kelas: "X IPS 1", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "007", nama: "Gilang Dirga", kelas: "XI MIPA 2", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "008", nama: "Hani Amalia", kelas: "XII IPS 3", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "009", nama: "Indra Lesmana", kelas: "X MIPA 1", mood: "", status_isi: false, password: "123", konsultasi: null },
    { nisn: "010", nama: "Joko Anwar", kelas: "XII MIPA 1", mood: "", status_isi: false, password: "123", konsultasi: null }
];

let currentUserNISN = null; 
let isLaporanTerkirim = false;

// =========================================================
// 1. FUNGSI LOGOUT & MENU NAVIGASI
// =========================================================
function logout() {
    currentUserNISN = null;
    document.getElementById('formLogin').reset();
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function bukaMenu(idMenu, event = null) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    
    const targetSection = document.getElementById(idMenu);
    if(targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
    
    if (event) {
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
}

// =========================================================
// 2. LOGIKA KIRIM DATA SISWA (MOOD & KONSULTASI)
// =========================================================
document.getElementById('formMood').addEventListener('submit', function(e) {
    e.preventDefault();
    const moodTerpilih = document.querySelector('input[name="mood"]:checked').value;
    
    let indexSiswa = dataSiswaHariIni.findIndex(siswa => siswa.nisn === currentUserNISN);
    if(indexSiswa !== -1) {
        dataSiswaHariIni[indexSiswa].mood = moodTerpilih;
        dataSiswaHariIni[indexSiswa].status_isi = true;
        alert(`Terima kasih! Mood "${moodTerpilih}" berhasil dikirim ke Guru BK.`);
    }
    this.reset();
});

let isAnonim = false;
function toggleAnonim() {
    isAnonim = !isAnonim;
    const labelNama = document.getElementById('label-nama-konsultasi');
    const btnAnonim = document.getElementById('btn-anonim');
    
    if (isAnonim) {
        labelNama.innerText = "Anonim";
        btnAnonim.innerText = "Tampilkan Nama";
    } else {
        let siswa = dataSiswaHariIni.find(s => s.nisn === currentUserNISN);
        labelNama.innerText = siswa ? siswa.nama : "Nama Remaja";
        btnAnonim.innerText = "Anonimkan Nama";
    }
}

// Fungsi Menangkap Data Konsultasi Siswa
document.getElementById('formKonsultasi').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let usiaVal = document.getElementById('usia').value;
    let kategoriVal = document.getElementById('kategori-masalah').value;
    let bebanVal = document.querySelector('input[name="beban"]:checked').value;
    let ceritaVal = document.getElementById('cerita-masalah').value;

    let indexSiswa = dataSiswaHariIni.findIndex(siswa => siswa.nisn === currentUserNISN);
    if(indexSiswa !== -1) {
        dataSiswaHariIni[indexSiswa].konsultasi = {
            usia: usiaVal,
            kategori: kategoriVal,
            beban: bebanVal,
            cerita: ceritaVal,
            isAnonim: isAnonim
        };
        alert('Data konsultasi berhasil dikirim ke Guru BK!');
    }
    
    this.reset();
    isAnonim = false;
    let siswa = dataSiswaHariIni.find(s => s.nisn === currentUserNISN);
    document.getElementById('label-nama-konsultasi').innerText = siswa ? siswa.nama : "Nama Remaja";
    document.getElementById('btn-anonim').innerText = "Anonimkan Nama";
});

// =========================================================
// 3. FUNGSI GURU BK & KEPALA SEKOLAH
// =========================================================
function kirimLaporanKepsek() {
    isLaporanTerkirim = true;
    alert("Berhasil! Laporan Mood, Konsultasi, dan Refleksi hari ini telah dikirim ke dasbor Kepala Sekolah.");
    renderDataAdmin(); // Memperbarui tabel mood
    renderPanelLaporan(); // Memperbarui tabel konsultasi & refleksi
}

// Fungsi untuk membuka Popup Detail Konsultasi
function lihatDetail(nisnTarget) {
    let siswa = dataSiswaHariIni.find(s => s.nisn === nisnTarget);
    if(!siswa) return;

    document.getElementById('modal-nama').innerText = siswa.nama;
    document.getElementById('modal-kelas').innerText = siswa.kelas;
    document.getElementById('modal-mood').innerText = siswa.mood || "Belum Mengisi";

    let konDiv = document.getElementById('modal-konsultasi-data');
    if(siswa.konsultasi !== null) {
        let statusNama = siswa.konsultasi.isAnonim ? "<span style='color:#e74c3c;'>Meminta dirahasiakan (Anonim)</span>" : siswa.nama;
        konDiv.innerHTML = `
            <p><strong>Nama di Form :</strong> ${statusNama}</p>
            <p><strong>Usia :</strong> ${siswa.konsultasi.usia} Tahun</p>
            <p><strong>Kategori Masalah :</strong> ${siswa.konsultasi.kategori}</p>
            <p><strong>Tingkat Beban :</strong> ${siswa.konsultasi.beban}</p>
            <p style="margin-top: 10px;"><strong>Isi Cerita :</strong> <br>${siswa.konsultasi.cerita}</p>
        `;
    } else {
        konDiv.innerHTML = `<p style="color: #7f8c8d; font-style: italic; text-align: center;">Siswa belum mengirimkan form konsultasi masalah hari ini.</p>`;
    }

    document.getElementById('modal-detail').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('modal-detail').style.display = 'none';
}

function renderDataAdmin() {
    let totalSiswa = dataSiswaHariIni.length;
    let jumlahIsi = 0, jumlahPerluPerhatian = 0, jumlahKritis = 0;
    let jmlSangatBaik=0, jmlBaik=0, jmlBiasa=0, jmlBuruk=0, jmlSangatBuruk=0, jmlBelum=0;

    const tbodyBK = document.getElementById("tabel-mood-body");
    const tbodyKepsek = document.getElementById("tabel-mood-kepsek");
    
    if(tbodyBK) tbodyBK.innerHTML = "";
    let htmlTabelKepsek = "";

    dataSiswaHariIni.forEach(siswa => {
        if (siswa.status_isi) jumlahIsi++;
        if (siswa.mood === "Buruk" || siswa.mood === "Sangat Buruk") jumlahPerluPerhatian++;
        if (siswa.mood === "Sangat Buruk") jumlahKritis++;

        let badgeClass = "badge-neutral", teksMood = siswa.mood;
        if (!siswa.status_isi) { teksMood = "Belum Mengisi"; badgeClass = ""; jmlBelum++; }
        else if (siswa.mood === "Sangat Baik") { badgeClass = "badge-good"; jmlSangatBaik++; }
        else if (siswa.mood === "Baik") { badgeClass = "badge-good"; jmlBaik++; }
        else if (siswa.mood === "Biasa Saja") { badgeClass = "badge-neutral"; jmlBiasa++; }
        else if (siswa.mood === "Buruk") { badgeClass = "badge-bad"; jmlBuruk++; }
        else if (siswa.mood === "Sangat Buruk") { badgeClass = "badge-bad"; jmlSangatBuruk++; }

        if(tbodyBK) tbodyBK.innerHTML += `<tr>
            <td>${siswa.nisn}</td>
            <td>${siswa.nama}</td>
            <td>${siswa.kelas}</td>
            <td><span class="badge ${badgeClass}">${teksMood}</span></td>
            <td><button class="btn-small" style="padding: 5px 10px; font-size: 12px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="lihatDetail('${siswa.nisn}')">Lihat Detail</button></td>
        </tr>`;
        
        htmlTabelKepsek += `<tr><td>${siswa.nisn}</td><td>${siswa.nama}</td><td>${siswa.kelas}</td><td><span class="badge ${badgeClass}">${teksMood}</span></td></tr>`;
    });

    let persentaseIsi = (jumlahIsi / totalSiswa) * 100;
    let persentaseBuruk = jumlahIsi > 0 ? (jumlahPerluPerhatian / jumlahIsi) * 100 : 0;
    
    if(document.getElementById("bk-total")) {
        document.getElementById("bk-total").innerText = totalSiswa;
        document.getElementById("bk-mengisi").innerText = jumlahIsi;
        document.getElementById("bk-buruk").innerText = jumlahPerluPerhatian;
        
        let teksBK = `Dari total <b>${totalSiswa} siswa</b>, sebanyak <b>${persentaseIsi.toFixed(0)}%</b> telah mengisi formulir hari ini. `;
        if (jumlahPerluPerhatian > 0) teksBK += `<br><span style="color: #e74c3c;">Terdapat <b>${persentaseBuruk.toFixed(1)}%</b> melaporkan kondisi kurang baik.</span>`;
        else teksBK += `<br><span style="color: #2ecc71;">Kondisi mental siswa terpantau stabil.</span>`;
        document.getElementById("bk-persentase").innerHTML = teksBK;
    }

    const rekapHTML = `
        <div style="background: #2ecc71; color: white; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">S.Baik: <b>${jmlSangatBaik}</b></div>
        <div style="background: #27ae60; color: white; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">Baik: <b>${jmlBaik}</b></div>
        <div style="background: #f1c40f; color: #333; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">Biasa: <b>${jmlBiasa}</b></div>
        <div style="background: #e67e22; color: white; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">Buruk: <b>${jmlBuruk}</b></div>
        <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">S.Buruk: <b>${jmlSangatBuruk}</b></div>
        <div style="background: #95a5a6; color: white; padding: 10px; border-radius: 5px; flex: 1; text-align: center;">Belum: <b>${jmlBelum}</b></div>
    `;
    if(document.getElementById("rekap-mood-bk")) document.getElementById("rekap-mood-bk").innerHTML = rekapHTML;

    if (isLaporanTerkirim) {
        if(document.getElementById("kepsek-total")) document.getElementById("kepsek-total").innerText = totalSiswa;
        if(document.getElementById("kepsek-kritis")) document.getElementById("kepsek-kritis").innerText = jumlahKritis;
        if(document.getElementById("kepsek-partisipasi")) document.getElementById("kepsek-partisipasi").innerText = persentaseIsi.toFixed(0) + "%";
        
        let teksKepsek = `Hari ini partisipasi pengisian mood mencapai <b>${persentaseIsi.toFixed(0)}%</b>. `;
        if (jumlahKritis > 0) teksKepsek += `<span style="color: #c0392b;">Terdapat <b>${jumlahKritis} siswa</b> dalam kondisi kritis (Sangat Buruk).</span>`;
        else teksKepsek += `<span style="color: #27ae60;">Tidak ada kasus kritis hari ini. Kondisi sekolah terpantau kondusif.</span>`;
        
        if(document.getElementById("kepsek-kesimpulan")) document.getElementById("kepsek-kesimpulan").innerHTML = teksKepsek;
        
        if(tbodyKepsek) {
            tbodyKepsek.innerHTML = htmlTabelKepsek;
            document.getElementById("rekap-mood-kepsek").innerHTML = rekapHTML;
        }
    } else {
        if(document.getElementById("kepsek-total")) {
            document.getElementById("kepsek-total").innerText = "-";
            document.getElementById("kepsek-kritis").innerText = "-";
            document.getElementById("kepsek-partisipasi").innerText = "-";
            document.getElementById("kepsek-kesimpulan").innerHTML = "<span style='color: #e67e22; font-style: italic;'>Menunggu Guru BK mengirimkan laporan harian...</span>";
        }
        if(tbodyKepsek) {
            tbodyKepsek.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; font-style: italic; color: #7f8c8d;">Data kosong. Belum ada laporan yang dikirim oleh Guru BK.</td></tr>`;
            document.getElementById("rekap-mood-kepsek").innerHTML = "";
        }
    }
}

// =========================================================
// 4. LOGIKA LOGIN 
// =========================================================
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'gurubk' && pass === 'admin') {
        currentUserNISN = "bk";
        masukSistem('bk', 'Bapak/Ibu Konselor');
        return; 
    } 
    
    if (user === 'kepsek' && pass === 'admin') {
        currentUserNISN = "kepsek";
        masukSistem('kepsek', 'Bapak/Ibu Kepala Sekolah');
        return; 
    }

    const siswaDitemukan = dataSiswaHariIni.find(siswa => siswa.nisn === user && siswa.password === pass);
    if (siswaDitemukan) {
        currentUserNISN = siswaDitemukan.nisn; 
        masukSistem('siswa', siswaDitemukan.nama);
    } else {
        alert('Username atau password salah!');
    }
});

function masukSistem(role, namaPengguna) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    document.getElementById('nama-user-sidebar').innerText = namaPengguna;

    document.getElementById('menu-siswa').style.display = 'none';
    document.getElementById('menu-bk').style.display = 'none';
    document.getElementById('menu-kepsek').style.display = 'none';

    if (role === 'siswa') {
        document.getElementById('menu-siswa').style.display = 'block';
        document.getElementById('nama-siswa-teks').innerText = namaPengguna;
        
        if(document.getElementById('label-nama-konsultasi')) {
            document.getElementById('label-nama-konsultasi').innerText = namaPengguna;
        }
        bukaMenu('beranda-siswa');
    } else if (role === 'bk') {
        document.getElementById('menu-bk').style.display = 'block';
        bukaMenu('dashboard-bk');
        renderDataAdmin(); 
        renderPanelLaporan(); 
    } else if (role === 'kepsek') {
        document.getElementById('menu-kepsek').style.display = 'block';
        bukaMenu('dashboard-kepsek'); 
        renderDataAdmin(); 
    }
}

// =========================================================
// 5. RENDER DATA KE PANEL LAPORAN (KONSULTASI & REFLEKSI)
// =========================================================
document.getElementById('formRefleksiDiri').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let indexSiswa = dataSiswaHariIni.findIndex(siswa => siswa.nisn === currentUserNISN);
    if(indexSiswa !== -1) {
        dataSiswaHariIni[indexSiswa].refleksi = {
            q1: document.getElementById('ref-1').value,
            q2: document.getElementById('ref-2').value,
            q3: document.getElementById('ref-3').value,
            q4: document.getElementById('ref-4').value,
            q5: document.getElementById('ref-5').value
        };
        alert('Luar biasa! Jurnal Refleksi Diri kamu berhasil disimpan. Teruslah menjadi versi terbaik dari dirimu!');
    }
    
    this.reset();
});

function renderPanelLaporan() {
    // Target Tabel Dasbor Guru BK
    const tbodyKonsultasi = document.getElementById('tabel-konsultasi-masuk');
    const tbodyRefleksi = document.getElementById('tabel-refleksi-masuk');
    
    // Target Tabel Dasbor Kepala Sekolah (Pastikan ID ini ada di file HTML bagian Kepsek)
    const tbodyKonsultasiKepsek = document.getElementById('tabel-konsultasi-kepsek');
    const tbodyRefleksiKepsek = document.getElementById('tabel-refleksi-kepsek');

    let htmlKonsultasi = "";
    let htmlRefleksi = "";

    dataSiswaHariIni.forEach(siswa => {
        // Data Konsultasi
        if (siswa.konsultasi) {
            let statusNama = siswa.konsultasi.isAnonim ? "<i style='color:#e74c3c;'>Anonim (Rahasia)</i>" : siswa.nama;
            let badgeClass = siswa.konsultasi.beban === 'Berat' ? 'badge-bad' : (siswa.konsultasi.beban === 'Sedang' ? 'badge-neutral' : 'badge-good');
            
            htmlKonsultasi += `<tr>
                <td>${statusNama}</td>
                <td>${siswa.konsultasi.usia} thn</td>
                <td>${siswa.konsultasi.kategori}</td>
                <td><span class="badge ${badgeClass}">${siswa.konsultasi.beban}</span></td>
                <td><button class="btn-primary" style="padding: 5px 10px; font-size: 12px;" onclick="lihatDetail('${siswa.nisn}')">Lihat Detail</button></td>
            </tr>`;
        }

        // Data Refleksi
        if (siswa.refleksi) {
            htmlRefleksi += `<tr>
                <td>${siswa.nisn}</td>
                <td>${siswa.nama}</td>
                <td><span class="badge badge-good">Sudah Mengisi</span></td>
                <td><button class="btn-primary" style="background-color: #9b59b6; padding: 5px 10px; font-size: 12px;" onclick="lihatRefleksi('${siswa.nisn}')">Buka Jurnal</button></td>
            </tr>`;
        }
    });

    // 1. Tampilkan di Dasbor Guru BK secara Real-time
    if(tbodyKonsultasi) tbodyKonsultasi.innerHTML = htmlKonsultasi || `<tr><td colspan="5" style="text-align:center; padding:15px; color:#7f8c8d;">Belum ada form konsultasi yang masuk.</td></tr>`;
    if(tbodyRefleksi) tbodyRefleksi.innerHTML = htmlRefleksi || `<tr><td colspan="4" style="text-align:center; padding:15px; color:#7f8c8d;">Belum ada jurnal refleksi yang masuk.</td></tr>`;

    // 2. Tampilkan di Dasbor Kepsek HANYA jika tombol Kirim Laporan sudah ditekan
    if (isLaporanTerkirim) {
        if(tbodyKonsultasiKepsek) tbodyKonsultasiKepsek.innerHTML = htmlKonsultasi || `<tr><td colspan="5" style="text-align:center; padding:15px; color:#7f8c8d;">Tidak ada konsultasi hari ini.</td></tr>`;
        if(tbodyRefleksiKepsek) tbodyRefleksiKepsek.innerHTML = htmlRefleksi || `<tr><td colspan="4" style="text-align:center; padding:15px; color:#7f8c8d;">Tidak ada jurnal refleksi hari ini.</td></tr>`;
    } else {
        if(tbodyKonsultasiKepsek) tbodyKonsultasiKepsek.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; font-style:italic; color:#e67e22;">Menunggu laporan dari Guru BK...</td></tr>`;
        if(tbodyRefleksiKepsek) tbodyRefleksiKepsek.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; font-style:italic; color:#e67e22;">Menunggu laporan dari Guru BK...</td></tr>`;
    }
}

function lihatRefleksi(nisnTarget) {
    let siswa = dataSiswaHariIni.find(s => s.nisn === nisnTarget);
    if(!siswa || !siswa.refleksi) return;

    document.getElementById('modal-nama-refleksi').innerText = siswa.nama;
    
    let konDiv = document.getElementById('modal-refleksi-data');
    konDiv.innerHTML = `
        <p><strong>1. Hal yang paling disukai dari diri:</strong><br>${siswa.refleksi.q1}</p><br>
        <p><strong>2. Hal yang membuat bangga:</strong><br>${siswa.refleksi.q2}</p><br>
        <p><strong>3. Kebiasaan baik:</strong><br>${siswa.refleksi.q3}</p><br>
        <p><strong>4. Tindakan mencintai diri:</strong><br>${siswa.refleksi.q4}</p><br>
        <p><strong>5. Afirmasi positif:</strong><br><i>"${siswa.refleksi.q5}"</i></p>
    `;

    document.getElementById('modal-refleksi').style.display = 'flex';
}

function tutupModalRefleksi() {
    document.getElementById('modal-refleksi').style.display = 'none';
}