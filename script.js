var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname, event) {
    // Remove active classes from all tabs
    for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }
    // Remove active classes from all tab contents
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");
    }
    // Add active classes to clicked tab
    event.currentTarget.classList.add("active-link");
    const tabContent = document.getElementById(tabname);
    if (tabContent) {
        tabContent.classList.add("active-tab");
    }
}

// Initialize first tab as active on page load
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const firstTabLink = aboutSection.querySelector('.tab-links');
        const firstTabContent = aboutSection.querySelector('.tab-contents');
        
        if (firstTabLink && firstTabContent) {
            firstTabLink.classList.add("active-link");
            firstTabContent.classList.add("active-tab");
        }
    }
});

// Mobile menu functionality
const sidemenu = document.getElementById("sidemenu");
const menuIcon = document.querySelector('.mobile-menu-icon');
const closeIcon = document.querySelector('.fa-xmark');

function openmenu() {
    if (sidemenu) {
        sidemenu.style.right = "0";
    }
}

function closemenu() {
    if (sidemenu) {
        sidemenu.style.right = "-200px";
    }
}

// Add event listeners for menu icons
document.addEventListener('DOMContentLoaded', () => {
    if (menuIcon) {
        menuIcon.addEventListener('click', openmenu);
    }
    if (closeIcon) {
        closeIcon.addEventListener('click', closemenu);
    }
});

// Portfolio show/hide functionality
document.getElementById('portfolio-see-more')?.addEventListener('click', function(e) {
    e.preventDefault();
    const hiddenProjects = document.querySelectorAll('.hidden-projects');
    hiddenProjects.forEach(project => {
        project.style.display = 'block';
    });
    this.style.display = 'none';
    document.getElementById('portfolio-show-less').style.display = 'block';
});

document.getElementById('portfolio-show-less')?.addEventListener('click', function(e) {
    e.preventDefault();
    const hiddenProjects = document.querySelectorAll('.hidden-projects');
    hiddenProjects.forEach(project => {
        project.style.display = 'none';
    });
    this.style.display = 'none';
    document.getElementById('portfolio-see-more').style.display = 'block';
});

// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const carousel = document.querySelector('.carousel');
    let currentIndex = 0;
    let intervalId;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function startAutoplay() {
        intervalId = setInterval(nextSlide, 3000);
    }

    function stopAutoplay() {
        clearInterval(intervalId);
    }

    prevBtn?.addEventListener('click', () => {
        prevSlide();
    });

    nextBtn?.addEventListener('click', () => {
        nextSlide();
    });

    carousel?.addEventListener('mouseenter', stopAutoplay);
    carousel?.addEventListener('mouseleave', startAutoplay);

    if (slides.length > 0) {
        showSlide(currentIndex);
        startAutoplay();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzyMW1ZywB1UJke1jGcKQ9iLXHi1hZM335d9By1lpPcOsy0KO0wEXwxoRSPv8yFn8QHZA/exec";
    const form = document.querySelector('form[name="submit-to-google-sheet"]');
    const responseMessage = document.getElementById("msg");

    if (!form || !responseMessage) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        responseMessage.textContent = "Submitting...";
        responseMessage.style.color = "black";

        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            responseMessage.textContent = "Please fill in all required fields.";
            responseMessage.style.color = "red";
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch(scriptURL, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log("Server Response:", result);

            responseMessage.textContent = result.message || "Form submitted successfully!";
            responseMessage.style.color = "green";
            form.reset();
        } catch (error) {
            responseMessage.textContent = "Error submitting form. Please try again.";
            responseMessage.style.color = "red";
            console.error("Fetch Error:", error);
        }
    });
});
