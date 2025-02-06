// Мобильное меню
const mobileMenu = document.getElementById('mobile-menu');
const nav = document.querySelector('.nav');

mobileMenu.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  nav.classList.toggle('active');
});

// Фиксация шапки при скролле
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});


function startSlider(yacht) {
    let images = yacht.querySelectorAll("img");
    let index = 0;

    yacht.dataset.interval = setInterval(() => {
        images.forEach((img, i) => img.style.opacity = i === index ? "1" : "0");
        index = (index + 1) % images.length;
    }, 1500);
}

function stopSlider(yacht) {
    clearInterval(yacht.dataset.interval);
    let images = yacht.querySelectorAll("img");
    images.forEach((img, i) => img.style.opacity = i === 0 ? "1" : "0");
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".yacht-image img:first-child").forEach(img => img.style.opacity = "1");
});


document.addEventListener("DOMContentLoaded", function () {
    const advantages = document.querySelectorAll(".advantage");

    function showAdvantages() {
        advantages.forEach((adv, index) => {
            const rect = adv.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                setTimeout(() => {
                    adv.style.opacity = "1";
                    adv.style.transform = "translateY(0)";
                }, index * 150);
            }
        });
    }

    window.addEventListener("scroll", showAdvantages);
    showAdvantages();
});


let currentReview = 0;
const reviews = document.querySelectorAll(".review");

function showReview(index) {
    reviews.forEach((review, i) => {
        review.classList.remove("active");
        if (i === index) {
            review.classList.add("active");
        }
    });
}

function nextReview() {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
}

function prevReview() {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    showReview(currentReview);
}

// Показываем первый отзыв
showReview(currentReview);


document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let message = document.getElementById("message").value;

    console.log("Заявка отправлена:");
    console.log("ФИО:", name);
    console.log("Телефон:", phone);
    console.log("Комментарий:", message);

    alert("✅ Ваша заявка успешно отправлена!");
    
    // Очистка формы
    document.getElementById("contactForm").reset();
});