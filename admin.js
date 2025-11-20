document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById('reservations-container');

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzOTLZTyovTfHBjLGStLQ3yBNt4Zg-7-ELTA8DHVQCbfnTnz6P1jIqMl5Pdogpz9AKA/exec");
        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = "<p>Tidak ada reservasi ditemukan.</p>";
            return;
        }

        let html = `
            <table border="1" cellpadding="10">
                <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Nomor HP</th>
                    <th>Pesan</th>
                    <th>Tanggal</th>
                </tr>
        `;

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.name}</td>
                    <td>${row.email}</td>
                    <td>${row.number}</td>
                    <td>${row.message}</td>
                    <td>${row.date}</td>
                </tr>
            `;
        });

        html += "</table>";
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = "<p>Error mengambil data.</p>";
        console.error(error);
    }
});
