const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('login-error');

// Saat halaman dibuka, coba load data. Jika gagal (401), tampilkan login.
document.addEventListener("DOMContentLoaded", function() {
    loadReservations(); 
});

// Handle Submit Login
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            // Login Sukses
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            loadReservations(); // Ambil data
        } else {
            // Login Gagal
            errorMsg.textContent = "Username atau Password salah!";
            errorMsg.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Fungsi Mengambil Data dari Golang
async function loadReservations() {
    try {
        const response = await fetch('/api/admin/reservations');
        
        if (response.status === 401) {
            // Jika server bilang "Unauthorized", tampilkan form login
            loginSection.style.display = 'block';
            dashboardSection.style.display = 'none';
            return;
        }

        const reservations = await response.json();
        
        // Jika sudah login, tampilkan dashboard
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';

        renderTable(reservations);

    } catch (error) {
        console.log("Belum login atau server error");
    }
}

// Fungsi Render Tabel (Sama seperti logikamu sebelumnya, tapi data dari Server)
function renderTable(reservations) {
    const container = document.getElementById('reservations-container');
    
    if (!reservations || reservations.length === 0) {
        container.innerHTML = "<p style='font-size:1.5rem; text-align:center;'>Tidak ada reservasi ditemukan.</p>";
        return;
    }

    let html = `<table border="1" cellpadding="10">
        <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Nomor HP</th>
            <th>Pesan</th>
            <th>Tanggal</th>
        </tr>`;
        
    reservations.forEach(res => {
        // Format tanggal dari Go ISO String ke format lokal
        const dateObj = new Date(res.date); 
        const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();

        html += `<tr>
            <td>${res.name}</td>
            <td>${res.email}</td>
            <td>${res.number}</td>
            <td>${res.message}</td>
            <td>${dateStr}</td>
        </tr>`;
    });
    html += "</table>";
    container.innerHTML = html;
}

function logout() {
    // Cara mudah logout: hapus cookie dengan set expired date ke masa lalu
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
}
