document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-btn"); // Изменено на твой класс
    const closeMenuButton = document.getElementById("close-menu");
    const overlay = document.getElementById("overlay");
    const mobileMenu = document.getElementById("mobile-menu");

    // Проверяем, существуют ли элементы перед добавлением событий
    if (menuButton && closeMenuButton && overlay && mobileMenu) {
        // Функция открытия меню
        function openMenu() {
            mobileMenu.classList.add("active");
            overlay.classList.add("active");
        }

        // Функция закрытия меню
        function closeMenu() {
            mobileMenu.classList.remove("active");
            overlay.classList.remove("active");
        }

        // Назначаем события
        menuButton.addEventListener("click", openMenu); // Теперь работает по .menu-btn
        closeMenuButton.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu);
    } else {
        console.error("❌ Ошибка: Один или несколько элементов меню не найдены в DOM.");
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     const rentButtons = document.querySelectorAll(".btn-rent");

//     rentButtons.forEach(button => {
//         button.addEventListener("click", function (event) {
//             event.preventDefault();
//             alert("Функция аренды пока недоступна. Свяжитесь с менеджером!");
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const rentButtons = document.querySelectorAll(".btn-rent");
    const modal = document.getElementById("booking-popup");
    const overlay = document.getElementById("popup-overlay");
    const closeModal = document.getElementById("booking-close");
    const submitBtn = document.getElementById("submit-btn");
    const policyCheckbox = document.getElementById("policy");
    const bookingForm = document.getElementById("booking-form");
    const boatImage = document.getElementById("booking-boat-img");
    const boatName = document.getElementById("booking-boat-name");

    // ДАННЫЕ ТЕЛЕГРАМ-БОТА
    const TELEGRAM_BOT_TOKEN = "5807422883:AAGkbgd6-bUeFRkguNHaJwZ77auV1XjAV7c";  // Вставь сюда токен бота
    const TELEGRAM_CHAT_ID = "1301142907"; // Вставь сюда ID канала (с -100 в начале, если приватный)

    // Открытие модального окна
    rentButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const boatCard = this.closest(".catalog-item");
            const boatImgSrc = boatCard.querySelector(".catalog-image img").src;
            const boatTitle = boatCard.querySelector("h3").textContent;

            boatImage.src = boatImgSrc;
            boatName.textContent = boatTitle;

            modal.classList.add("active");
            overlay.classList.add("active");
        });
    });

    // Закрытие окна
    closeModal.addEventListener("click", closeBooking);
    overlay.addEventListener("click", closeBooking);

    function closeBooking() {
        modal.classList.remove("active");
        overlay.classList.remove("active");
        submitBtn.textContent = "Отправить заявку"; // Сбрасываем кнопку
        submitBtn.classList.remove("loading"); // Убираем состояние загрузки
        submitBtn.removeAttribute("disabled"); // Включаем кнопку
    }

    // Активация кнопки "Отправить заявку" только при согласии с политикой
    policyCheckbox.addEventListener("change", function () {
        if (this.checked) {
            submitBtn.classList.add("active");
            submitBtn.removeAttribute("disabled");
        } else {
            submitBtn.classList.remove("active");
            submitBtn.setAttribute("disabled", "true");
        }
    });

    // Отправка заявки в Telegram
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (submitBtn.disabled) return; // Если кнопка уже нажата – выходим

        const userName = document.getElementById("name").value.trim();
        const userPhone = document.getElementById("phone").value.trim();
        const userComment = document.getElementById("comment").value.trim();
        const boatTitle = boatName.textContent;

        if (!userName || !userPhone) {
            alert("Заполните имя и телефон!");
            return;
        }

        // Блокируем кнопку во время отправки
        submitBtn.textContent = "Отправка...";
        submitBtn.classList.add("loading");
        submitBtn.setAttribute("disabled", "true");

        // Формируем текст сообщения
        const message = `
🚤 *Новая заявка на аренду!*
🛥️ Яхта: *${boatTitle}*
👤 Имя: *${userName}*
📞 Телефон: *${userPhone}*
📝 Комментарий: ${userComment || "Не указан"}
        `;

        // Отправляем данные в Telegram через API
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("✅ Заявка успешно отправлена!");
                bookingForm.reset();
                closeBooking();
            } else {
                alert("❌ Ошибка при отправке. Попробуйте снова.");
                submitBtn.textContent = "Отправить заявку";
                submitBtn.classList.remove("loading");
                submitBtn.removeAttribute("disabled");
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("❌ Ошибка при отправке. Попробуйте позже.");
            submitBtn.textContent = "Отправить заявку";
            submitBtn.classList.remove("loading");
            submitBtn.removeAttribute("disabled");
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const reviewContainer = document.querySelector(".reviews-container");
    
    let isDown = false;
    let startX;
    let scrollLeft;

    // Начало перетаскивания
    reviewContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        reviewContainer.classList.add("active");
        startX = e.pageX - reviewContainer.offsetLeft;
        scrollLeft = reviewContainer.scrollLeft;
    });

    // Конец перетаскивания
    reviewContainer.addEventListener("mouseleave", () => {
        isDown = false;
        reviewContainer.classList.remove("active");
    });

    reviewContainer.addEventListener("mouseup", () => {
        isDown = false;
        reviewContainer.classList.remove("active");
        snapToNearest();
    });

    // Движение по оси X
    reviewContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reviewContainer.offsetLeft;
        const walk = (x - startX) * 2; // Скорость прокрутки
        reviewContainer.scrollLeft = scrollLeft - walk;
    });

    // Функция фиксации отзыва
    function snapToNearest() {
        const reviewWidth = 340; // Фиксированная ширина карточки + отступы
        const scrollPosition = reviewContainer.scrollLeft;
        const nearestReview = Math.round(scrollPosition / reviewWidth) * reviewWidth;
        
        reviewContainer.scrollTo({
            left: nearestReview,
            behavior: "smooth"
        });
    }
});
