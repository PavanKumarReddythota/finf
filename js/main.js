const page = document.body.dataset.page;

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden'), 350);
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileToggle?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('active');
    });

    mobileMenu?.addEventListener('click', (event) => {
        const target = event.target;
        if (target?.matches('a')) {
            mobileMenu.classList.remove('active');
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === location.href || link.href === location.href.split('#')[0]) {
            link.classList.add('active');
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(elem => {
            const rect = elem.getBoundingClientRect();
            if (rect.top < triggerBottom) elem.classList.add('active');
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    if (page === 'home') initializeHome();
    if (page === 'listings') initializeListings();
    if (page === 'property') initializeProperty();
    if (page === 'login') initializeAuth();
    if (page === 'dashboard') initializeDashboard();

    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', handleContactSubmit);
});

function initializeHome() {
    const heroSearch = document.getElementById('heroSearchForm');
    heroSearch?.addEventListener('submit', event => {
        event.preventDefault();
        const query = new URLSearchParams(new FormData(heroSearch)).toString();
        window.location.href = `listings.html?${query}`;
    });
}

function initializeListings() {
    const filters = {
        city: document.getElementById('filterCity'),
        type: document.getElementById('filterType'),
        budget: document.getElementById('filterBudget'),
        rooms: document.getElementById('filterRooms'),
    };
    const cards = Array.from(document.querySelectorAll('.listing-card'));

    const searchForm = document.getElementById('listSearchForm');
    searchForm?.addEventListener('submit', event => {
        event.preventDefault();
        applyListingFilters(filters, cards);
    });

    const resetBtn = document.getElementById('resetFilters');
    resetBtn?.addEventListener('click', () => {
        filters.city.value = 'Bangalore';
        filters.type.value = 'All';
        filters.budget.value = 'Any';
        filters.rooms.value = 'Any';
        applyListingFilters(filters, cards);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
        const mapped = {
            city: params.get('city'),
            type: params.get('type'),
            budget: params.get('budget'),
        };
        Object.entries(mapped).forEach(([key, value]) => {
            if (value && filters[key]) filters[key].value = value;
        });
        applyListingFilters(filters, cards);
    }
}

function applyListingFilters(filters, cards) {
    const selectedCity = filters.city.value;
    const selectedType = filters.type.value;
    const selectedBudget = filters.budget.value;
    const selectedRooms = filters.rooms.value;

    cards.forEach(card => {
        const cardCity = card.dataset.city;
        const cardType = card.dataset.type;
        const cardBudget = parseInt(card.dataset.budget, 10);
        const cardRooms = card.dataset.rooms;

        const budgetMatch = selectedBudget === 'Any' || cardBudget <= parseInt(selectedBudget, 10);
        const typeMatch = selectedType === 'All' || cardType === selectedType;
        const cityMatch = selectedCity === 'Any' || cardCity === selectedCity;
        const roomsMatch = selectedRooms === 'Any' || cardRooms === selectedRooms;

        card.style.display = budgetMatch && typeMatch && cityMatch && roomsMatch ? '' : 'none';
    });
}

function initializeProperty() {
    const galleryImages = document.querySelectorAll('.gallery-thumb');
    const mainImage = document.querySelector('.gallery-main');
    galleryImages.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const source = thumb.dataset.src;
            if (mainImage) mainImage.src = source;
        });
    });

    const bookForm = document.getElementById('bookingForm');
    bookForm?.addEventListener('submit', event => {
        event.preventDefault();
        const submitButton = bookForm.querySelector('button');
        if (!submitButton) return;
        submitButton.textContent = 'Booking...';
        setTimeout(() => {
            submitButton.textContent = 'Booked Successfully';
            submitButton.classList.add('btn-secondary');
        }, 1200);
    });
}

function initializeAuth() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'grid';
            registerForm.style.display = 'none';
        });
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'grid';
            loginForm.style.display = 'none';
        });
    }

    loginForm?.addEventListener('submit', event => {
        event.preventDefault();
        alert('Logged in successfully.');
    });
    registerForm?.addEventListener('submit', event => {
        event.preventDefault();
        alert('Account created successfully.');
    });
}

function initializeDashboard() {
    const expandButtons = document.querySelectorAll('.card-toggle');
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.solid-card');
            card?.classList.toggle('expanded');
        });
    });
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button');
    if (!button) return;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;
    setTimeout(() => {
        button.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully';
        button.disabled = false;
        form.reset();
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2200);
    }, 1400);
}
