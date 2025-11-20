// === MENU BUTTON ===
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};

// === IMAGE SLIDER (home image change) ===
document.querySelectorAll('.image-slider img').forEach(images => {
    images.onclick = () => {
        var src = images.getAttribute('src');
        document.querySelector('.main-home-image').src = src;
    };
});

// === SWIPER REVIEW SLIDER ===
var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        }
    },
});

// === RESERVATION FORM ===
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
