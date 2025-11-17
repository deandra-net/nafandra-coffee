document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('reservations-container');
    let reservations = JSON.parse(localStorage.getItem('reservations') || "[]");

    if (reservations.length === 0) {
        container.innerHTML = "<p>Tidak ada reservasi ditemukan.</p>";
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
        html += `<tr>
            <td>${res.name}</td>
            <td>${res.email}</td>
            <td>${res.number}</td>
            <td>${res.message}</td>
            <td>${new Date(res.date).toLocaleString()}</td>
        </tr>`;
    });
    html += "</table>";
    container.innerHTML = html;
});