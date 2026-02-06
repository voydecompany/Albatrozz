const productsDB = {
    men: [
        { id: 101, name: "OS ACID TEE", price: 1499, type: "tees", image: "Acidtee.jpg" },
        { id: 102, name: "CARGO BLACK", price: 2999, type: "pants", image: "Blackcargo.jpg" },
        { id: 103, name: "FLANNEL SHIRT", price: 2499, type: "shirts", image: "Flannelshirt.jpg" },
        { id: 104, name: "BASIC VEST", price: 799, type: "inners", image: "Basicvest.jpg" },
        { id: 105, name: "GRAPHIC HOODIE", price: 3499, type: "tees", image: "Graphichoodie.jpg" }
    ],
    women: [
        { id: 201, name: "CROP TOP", price: 1299, type: "tees", image: "Croptop.jpg" },
        { id: 202, name: "BAGGY JEANS", price: 2999, type: "pants", image: "Baggywoman.jpg" },
        { id: 203, name: "OVERSIZED TEE", price: 1499, type: "tees", image: "shirt.png" },
        { id: 204, name: "MESH TOP", price: 1999, type: "shirts", image: "shirt.png" },
        { id: 205, name: "SPORTS BRA", price: 1499, type: "inners", image: "shirt.png" }
    ]
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCountElement = document.getElementById('cartCount');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.getElementById('closeModal');
const payNowBtn = document.getElementById('payNowBtn');
const totalAmountElement = document.getElementById('totalAmount');
const successOverlay = document.getElementById('successOverlay');
const closeSuccess = document.getElementById('closeSuccess');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cart = [];

// Custom Cursor
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Render Products with Filter
function renderProducts(category = 'men', filter = 'all') {
    if (!productsGrid) return; // Exit if page doesn't have grid (e.g. index.html)

    const items = productsDB[category] || [];
    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.type === filter);

    productsGrid.innerHTML = filteredItems.map(product => `
        <div class="product-card">
            <div class="product-img-box">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="buy-btn" onclick="addToCart(${product.id}, '${category}')">ADD TO BAG</button>
            </div>
        </div>
    `).join('');
}

// Global filter function
window.filterProducts = (type) => {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Re-render
    const category = window.currentCategory || 'men'; // assigned in inline script of html
    renderProducts(category, type);
};

window.addToCart = (id, category) => {
    const product = productsDB[category].find(p => p.id === id);
    cart.push(product);
    updateCartUI();

    // Feedback
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
};

function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }

    if (totalAmountElement) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalAmountElement.innerText = total;
    }
}

// Modal Toggle
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your bag is empty! Add some drip first.");
            return;
        }
        if (paymentModal) paymentModal.classList.add('active');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (paymentModal) paymentModal.classList.remove('active');
    });
}

// Payment Simulation
if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
        payNowBtn.innerText = "PROCESSING...";
        payNowBtn.disabled = true;

        setTimeout(() => {
            paymentModal.classList.remove('active');
            if (successOverlay) successOverlay.classList.add('active');

            // Reset Cart
            cart = [];
            updateCartUI();
            payNowBtn.innerText = "PAY NOW";
            payNowBtn.disabled = false;
        }, 2000);
    });
}

if (closeSuccess) {
    closeSuccess.addEventListener('click', () => {
        if (successOverlay) successOverlay.classList.remove('active');
    });
}

// Initial Render Logic
document.addEventListener('DOMContentLoaded', () => {
    if (window.currentCategory) {
        renderProducts(window.currentCategory, 'all');
    }
    updateCartUI();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
