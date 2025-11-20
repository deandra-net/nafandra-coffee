document.addEventListener("DOMContentLoaded", function () {

    const reservationForm = document.getElementById('reservation-form');

    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const reservation = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                number: document.getElementById('number').value,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };

            let reservations = JSON.parse(localStorage.getItem('reservations') || "[]");
            reservations.push(reservation);
            localStorage.setItem('reservations', JSON.stringify(reservations));

            document.getElementById('reservation-success').style.display = "block";
            reservationForm.reset();
        });
    }

});
