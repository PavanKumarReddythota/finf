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
        rooms: document.getElementById('filterRooms')
    };
    const cards = Array.from(document.querySelectorAll('.listing-card'));
    const filterSummary = document.getElementById('filterSummary');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const listSearchForm = document.getElementById('listSearchForm');

    if (listSearchForm) {
        listSearchForm.addEventListener('submit', event => {
            event.preventDefault();
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', () => applyListingFilters(filters, cards));
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (filters.city) filters.city.value = 'Any';
            if (filters.type) filters.type.value = 'All';
            if (filters.budget) filters.budget.value = 'Any';
            if (filters.rooms) filters.rooms.value = 'Any';
            applyListingFilters(filters, cards);
        });
    }

    Object.values(filters).forEach(input => {
        if (input) {
            input.addEventListener('change', () => applyListingFilters(filters, cards));
        }
    });

    if (filterSummary) {
        filterSummary.textContent = `Showing ${cards.length} rooms available.`;
    }

    const params = new URLSearchParams(window.location.search);
    const mapped = {
        city: params.get('city'),
        type: params.get('type'),
        budget: params.get('budget'),
        rooms: params.get('rooms')
    };

    Object.entries(mapped).forEach(([key, value]) => {
        if (value && filters[key]) {
            filters[key].value = value;
        }
    });

    applyListingFilters(filters, cards);
}

function applyListingFilters(filters, cards) {
    const selectedCity = filters.city ? filters.city.value : 'Any';
    const selectedType = filters.type ? filters.type.value : 'All';
    const selectedBudget = filters.budget ? filters.budget.value : 'Any';
    const selectedRooms = filters.rooms ? filters.rooms.value : 'Any';
    const filterSummary = document.getElementById('filterSummary');

    let visibleCount = 0;
    cards.forEach(card => {
        const cardCity = card.getAttribute('data-city');
        const cardType = card.getAttribute('data-type');
        const cardBudget = parseInt(card.getAttribute('data-budget'), 10);
        const cardRooms = card.getAttribute('data-rooms');

        const budgetMatch = selectedBudget === 'Any' || cardBudget <= parseInt(selectedBudget, 10);
        const typeMatch = selectedType === 'All' || cardType === selectedType;
        const cityMatch = selectedCity === 'Any' || cardCity === selectedCity;
        const roomsMatch = selectedRooms === 'Any' || cardRooms === selectedRooms;

        const show = budgetMatch && typeMatch && cityMatch && roomsMatch;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount += 1;
    });

    if (filterSummary) {
        filterSummary.textContent = visibleCount > 0
            ? `Showing ${visibleCount} room${visibleCount === 1 ? '' : 's'} available.`
            : 'No matching rooms found. Try a different filter or reset the search.';
    }
}

const propertyDetails = {
    'cozy-koramangala': {
        title: 'Cozy single room with attached bathroom and fast Wi-Fi.',
        location: 'Koramangala, Bangalore',
        price: '₹9,500 / month',
        type: 'PG',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'Wi-Fi, Laundry, Power Backup',
        moveIn: 'Immediate',
        deposit: '₹9,500',
        rating: '4.9',
        owner: 'Rohan Patel',
        description: 'A bright, furnished single room in a verified PG building. Ideal for working professionals and students, this room includes fast Wi-Fi, daily housekeeping support, and a secure community environment close to cafes and shopping.',
        amenities: ['Private bed', '24/7 water', 'Fast Wi-Fi', 'Laundry service', 'Housekeeping', 'Power backup'],
        features: ['Verified owner', 'Flexible move-in', 'In-room storage', 'Common lounge', 'Nearby metro station', 'Security guard'],
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'premium-shared-hostel': {
        title: 'Premium shared hostel room with meals included.',
        location: 'Indiranagar, Bangalore',
        price: '₹7,200 / month',
        type: 'Hostel',
        rooms: 'Shared',
        bathroom: 'Common',
        utilities: 'Meals, Wi-Fi, Housekeeping',
        moveIn: 'Jul 2026',
        deposit: '₹4,500',
        rating: '4.8',
        owner: 'Nisha Verma',
        description: 'A premium shared hostel offering comfortable bunk beds, three daily meals, and a community lounge. Perfect for those looking for affordable stays with a convenient location close to cafes and coworking spaces.',
        amenities: ['Meal plan', 'Bunk bed', 'Wi-Fi', 'Laundry', 'Common kitchen', '24/7 security'],
        features: ['Meal included', 'Regular sanitization', 'Friendly community', 'Fast internet', 'Reading room', 'Flexible lease'],
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'bright-studio-apartment': {
        title: 'Bright studio apartment near MG Road.',
        location: 'MG Road, Bangalore',
        price: '₹14,000 / month',
        type: 'Apartment',
        rooms: 'Studio',
        bathroom: 'Attached',
        utilities: 'Gym, Parking, Power Backup',
        moveIn: 'Aug 2026',
        deposit: '₹14,000',
        rating: '4.7',
        owner: 'Anjali Rao',
        description: 'A modern studio apartment with a well-lit living area, kitchenette, and premium finishes. Great for a solo stay close to the city center, shopping, and metro access.',
        amenities: ['Furnished studio', 'Gym access', 'Car parking', 'Power backup', '24/7 security', 'Lift access'],
        features: ['City center convenience', 'Premium building', 'In-house gym', 'Easy commute', 'Modern interiors', 'Secure parking'],
        images: [
            'https://images.unsplash.com/photo-1598928506311-7f4cdf9d0f06?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'single-hostel-electronic-city': {
        title: 'Single hostel room in Electronic City.',
        location: 'Electronic City, Bangalore',
        price: '₹8,200 / month',
        type: 'Hostel',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'Meals, Wi-Fi, Laundry',
        moveIn: 'Immediate',
        deposit: '₹8,200',
        rating: '4.6',
        owner: 'Suresh Jain',
        description: 'A comfortable single hostel room with private bed, attached bathroom, and meal plan options. Ideal for IT professionals working in Electronic City.',
        amenities: ['Private room', 'Meals available', 'Wi-Fi', 'Laundry', 'Housekeeping', '24/7 water'],
        features: ['Single occupancy', 'Near tech parks', 'Meal options', 'Secure hostel', 'Easy commute', 'Regular cleaning'],
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'private-hostel-hsr': {
        title: 'Private hostel room near HSR Layout.',
        location: 'HSR Layout, Bangalore',
        price: '₹10,400 / month',
        type: 'Hostel',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'AC, Meals, Housekeeping',
        moveIn: 'Immediate',
        deposit: '₹10,400',
        rating: '4.8',
        owner: 'Priya Nair',
        description: 'A private room in a premium hostel with AC, meals, and daily housekeeping. Close to HSR Layout commercial streets and offices.',
        amenities: ['AC room', 'Meal plan', 'Wi-Fi', 'Housekeeping', 'Laundry', 'Common lounge'],
        features: ['Private hostel', 'AC included', 'Meal options', 'Near offices', 'Clean rooms', 'Security guard'],
        images: [
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-7f4cdf9d0f06?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'fast-wifi-pg': {
        title: 'Single PG room with fast Wi-Fi.',
        location: 'Marathahalli, Bangalore',
        price: '₹9,800 / month',
        type: 'PG',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'Wi-Fi, Laundry, Security',
        moveIn: 'Jul 2026',
        deposit: '₹9,800',
        rating: '4.7',
        owner: 'Manish Shah',
        description: 'A furnished single PG room with high-speed internet and housekeeping services. Great for students and remote workers near Outer Ring Road.',
        amenities: ['Fast Wi-Fi', 'Single occupancy', 'Laundry', 'Security', 'Power backup', 'Study table'],
        features: ['High-speed internet', 'Study-friendly', 'Secure PG', 'Near tech hubs', 'Flexible move-in', 'Daily cleaning'],
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'shared-pg-koramangala': {
        title: 'Shared PG room with 24/7 water and Wi-Fi.',
        location: 'Koramangala, Bangalore',
        price: '₹8,800 / month',
        type: 'PG',
        rooms: 'Shared',
        bathroom: 'Attached',
        utilities: 'Wi-Fi, Meals optional, Housekeeping',
        moveIn: 'Immediate',
        deposit: '₹8,800',
        rating: '4.6',
        owner: 'Sapna Kulkarni',
        description: 'A shared PG room in a modern apartment with continuous water supply and optional meals. Perfect for those who want affordable living in Koramangala.',
        amenities: ['Shared room', 'Wi-Fi', 'Optional meals', 'Housekeeping', 'Security', 'Power backup'],
        features: ['Affordable stay', 'Modern amenities', 'Secure building', 'Near cafes', 'Flexible sharing', 'Good commute'],
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'private-apartment-jayanagar': {
        title: 'Private single bedroom apartment in Jayanagar.',
        location: 'Jayanagar, Bangalore',
        price: '₹12,500 / month',
        type: 'Apartment',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'Kitchenette, Parking',
        moveIn: 'Aug 2026',
        deposit: '₹12,500',
        rating: '4.8',
        owner: 'Deepak Kumar',
        description: 'A premium private apartment with kitchenette and dedicated parking. Great for a peaceful and independent stay in South Bangalore.',
        amenities: ['Kitchenette', 'Parking', 'Furnished room', 'Power backup', 'Security', 'Elevator'],
        features: ['Private apartment', 'South Bangalore', 'Quiet neighborhood', 'Secure access', 'Fully furnished', 'Flexible lease'],
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'mysore-pg-vijayanagar': {
        title: 'Shared PG near Mysore University.',
        location: 'Vijayanagar, Mysore',
        price: '₹9,000 / month',
        type: 'PG',
        rooms: 'Shared',
        bathroom: 'Common',
        utilities: 'Wi-Fi, Housekeeping',
        moveIn: 'Jul 2026',
        deposit: '₹4,500',
        rating: '4.5',
        owner: 'Geetha R.',
        description: 'A shared PG room with a lively student community and convenient access to Mysore University. Meals and utilities are available at affordable rates.',
        amenities: ['Shared room', 'Wi-Fi', 'Housekeeping', 'Common lounge', 'Security', 'Power backup'],
        features: ['Student-friendly', 'Near university', 'Affordable', 'Secure PG', 'Community living', 'Clean environment'],
        images: [
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    'chennai-anna-nagar-apartment': {
        title: 'Single apartment with kitchen in Anna Nagar.',
        location: 'Anna Nagar, Chennai',
        price: '₹12,000 / month',
        type: 'Apartment',
        rooms: 'Single',
        bathroom: 'Attached',
        utilities: 'Kitchen, Parking, Security',
        moveIn: 'Aug 2026',
        deposit: '₹12,000',
        rating: '4.7',
        owner: 'Priya Menon',
        description: 'A compact, secure single apartment with a private kitchen and premium building amenities. Ideal for professionals relocating to Chennai with a flexible move-in date.',
        amenities: ['Private kitchen', 'Parking', 'Furnished room', 'Security', 'Lift', 'Power backup'],
        features: ['City apartment', 'Private space', 'Safe neighborhood', 'Easy commute', 'Quality fixtures', 'Well-maintained'],
        images: [
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-7f4cdf9d0f06?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ]
    }
};

function initializeProperty() {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('property') || 'cozy-koramangala';
    const property = propertyDetails[propertyId];
    const notFound = document.getElementById('propertyNotFound');
    const content = document.querySelector('.property-page-content');

    if (!property) {
        if (notFound) notFound.classList.add('active');
        if (content) content.classList.add('hidden');
        return;
    }

    if (notFound) notFound.classList.remove('active');
    if (content) content.classList.remove('hidden');

    const mainImage = document.querySelector('.gallery-main');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-thumb'));

    if (mainImage) mainImage.src = property.images[0];
    galleryImages.forEach((thumb, index) => {
        const image = property.images[index] || property.images[0];
        thumb.dataset.src = image;
        thumb.src = image;
        thumb.addEventListener('click', () => {
            if (mainImage) mainImage.src = image;
        });
    });

    const setText = (selector, value) => {
        const element = document.getElementById(selector);
        if (element) element.textContent = value;
    };

    setText('propertyTitle', property.title);
    setText('propertySubtitle', `${property.type} • ${property.location}`);
    setText('propertyPrice', property.price);
    setText('propertyType', property.type);
    setText('propertyRooms', property.rooms);
    setText('propertyBathroom', property.bathroom);
    setText('propertyUtilities', property.utilities);
    setText('propertyMoveIn', property.moveIn);
    setText('propertyDeposit', property.deposit);
    setText('propertyOwnerName', property.owner);
    setText('propertyRating', property.rating);
    setText('propertyDescription', property.description);

    const amenitiesList = document.getElementById('amenitiesList');
    if (amenitiesList) {
        amenitiesList.innerHTML = property.amenities.map(item => `<li><i class="fa-solid fa-check"></i>${item}</li>`).join('');
    }

    const featureList = document.getElementById('featureList');
    if (featureList) {
        featureList.innerHTML = property.features.map(item => `<li><i class="fa-solid fa-star"></i>${item}</li>`).join('');
    }

    const bookForm = document.getElementById('bookingForm');
    bookForm?.addEventListener('submit', event => {
        event.preventDefault();
        const submitButton = bookForm.querySelector('button');
        if (!submitButton) return;
        submitButton.textContent = 'Booking...';
        submitButton.disabled = true;
        setTimeout(() => {
            submitButton.textContent = 'Booked Successfully';
            submitButton.classList.add('btn-secondary');
            submitButton.disabled = false;
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
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.expandable-card');
            if (!card) return;
            const details = card.querySelector('.booking-details');
            const isHidden = details.style.display === 'none';
            details.style.display = isHidden ? 'block' : 'none';
            button.textContent = isHidden ? 'Collapse' : 'Expand';
        });
    });
    
    const confirmButtons = document.querySelectorAll('.btn-primary');
    confirmButtons.forEach(button => {
        if (button.textContent.includes('Confirm') || button.textContent.includes('Pay') || button.textContent.includes('View')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const originalText = button.textContent;
                button.textContent = 'Processing...';
                setTimeout(() => {
                    button.textContent = 'Done!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 1500);
                }, 1200);
            });
        }
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
