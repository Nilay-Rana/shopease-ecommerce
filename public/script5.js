const products = [
    {
        id: 1,
        name: "Smart Watch",
        category: "Electronics",
        rating: 4.7,
        price: 3299,
        oldPrice: 4999,
        image: "⌚",
        description: "Smart fitness watch with heart-rate monitoring, notifications, sports modes and long battery life."
    },
    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        rating: 4.5,
        price: 2499,
        oldPrice: 3999,
        image: "🎧",
        description: "Wireless headphones with clear sound, comfortable design and long battery life."
    },
    {
        id: 3,
        name: "Smartphone",
        category: "Electronics",
        rating: 4.6,
        price: 15999,
        oldPrice: 18999,
        image: "📱",
        description: "Modern smartphone with powerful processor, quality camera and large display."
    },
    {
        id: 4,
        name: "Laptop",
        category: "Electronics",
        rating: 4.8,
        price: 45999,
        oldPrice: 52999,
        image: "💻",
        description: "Powerful laptop suitable for study, programming and everyday work."
    },
    {
        id: 5,
        name: "Men's Casual Shirt",
        category: "Fashion",
        rating: 4.3,
        price: 999,
        oldPrice: 1499,
        image: "👕",
        description: "Comfortable casual shirt suitable for everyday use."
    },
    {
        id: 6,
        name: "Running Shoes",
        category: "Shoes",
        rating: 4.8,
        price: 2199,
        oldPrice: 3499,
        image: "👟",
        description: "Lightweight running shoes designed for comfortable daily activities."
    },
    {
        id: 7,
        name: "Classic Sunglasses",
        category: "Accessories",
        rating: 4.4,
        price: 799,
        oldPrice: 1299,
        image: "🕶️",
        description: "Stylish sunglasses suitable for everyday use."
    },
    {
        id: 8,
        name: "Backpack",
        category: "Accessories",
        rating: 4.5,
        price: 1299,
        oldPrice: 1999,
        image: "🎒",
        description: "Spacious backpack suitable for college, travel and everyday use."
    }
];

let cart = [];
let wishlist = [];
let paymentVerified = false;
let selectedPayment = "UPI";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultText = document.getElementById("resultText");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCartButton");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishlistButton = document.getElementById("wishlistButton");
const wishlistCount = document.getElementById("wishlistCount");

const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutButton = document.getElementById("closeCheckoutButton");

const checkoutForm = document.getElementById("checkoutForm");
const customerCity = document.getElementById("customerCity");
const deliveryPreview = document.getElementById("deliveryPreview");

const checkoutStep1 = document.getElementById("checkoutStep1");
const checkoutStep2 = document.getElementById("checkoutStep2");
const checkoutStep3 = document.getElementById("checkoutStep3");

const paymentAmount = document.getElementById("paymentAmount");
const upiPaymentButton = document.getElementById("upiPaymentButton");
const gpayPaymentButton = document.getElementById("gpayPaymentButton");
const scanPaymentButton = document.getElementById("scanPaymentButton");
const paymentMessage = document.getElementById("paymentMessage");
const placeOrderButton = document.getElementById("placeOrderButton");

const continueShoppingButton = document.getElementById("continueShoppingButton");

function formatPrice(price) {
    return price.toLocaleString("en-IN");
}

function displayProducts(list) {

    if (list.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">
                <h2>❌ Product Not Found</h2>
                <p>Try searching Smart Watch, Headphones, Smartphone or Shoes.</p>
            </div>
        `;

        return;
    }

    productGrid.innerHTML = "";

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-info">

                <span class="product-category">
                    Category: ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating} / 5
                </div>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="price">
                    ₹${formatPrice(product.price)}
                    <span class="old-price">
                        ₹${formatPrice(product.oldPrice)}
                    </span>
                </div>

                <div class="product-actions">

                    <button class="add-cart" onclick="addToCart(${product.id})">
                        🛒 Add to Cart
                    </button>

                    <button class="details-button" onclick="showProductDetails(${product.id})">
                        View Details
                    </button>

                </div>

            </div>
        `;

        productGrid.appendChild(card);
    });
}

function searchProducts() {

    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {

        displayProducts(products);

        resultText.textContent = "Explore our latest products";

        return;
    }

    const results = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    displayProducts(results);

    if (results.length > 0) {

        resultText.innerHTML =
            `Search result for: <strong>${searchInput.value}</strong>`;

    } else {

        resultText.innerHTML =
            `No product found for: <strong>${searchInput.value}</strong>`;
    }

    document.getElementById("productsSection").scrollIntoView({
        behavior: "smooth"
    });
}

searchButton.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchProducts();
    }

});

function showCategory(category) {

    if (category === "All") {

        displayProducts(products);

        resultText.textContent = "All Products";

        return;
    }

    const filtered = products.filter(
        product => product.category === category
    );

    displayProducts(filtered);

    resultText.textContent = category + " Products";

    document.getElementById("productsSection").scrollIntoView({
        behavior: "smooth"
    });
}

function addToCart(id) {

    const product = products.find(product => product.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    openCart();
}

function updateCart() {

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="no-products">
                <h3>Your cart is empty</h3>
                <p>Add some products to continue.</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(item => {

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-item-image">
                ${item.image}
            </div>

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>₹${formatPrice(item.price)}</p>

                <div class="quantity">

                    <button onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <strong>${item.quantity}</strong>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

                <button
                    class="remove-button"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>
        `;

        cartItems.appendChild(div);
    });
}

function changeQuantity(id, amount) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();
}

function openCart() {

    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {

    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
}

cartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);

    } else {

        wishlist.push(id);
    }

    wishlistCount.textContent = wishlist.length;
}

wishlistButton.addEventListener("click", function() {

    if (wishlist.length === 0) {

        alert("Your wishlist is empty.");

        return;
    }

    const names = wishlist.map(id => {

        const product = products.find(p => p.id === id);

        return product.name;

    });

    alert("Wishlist:\n\n" + names.join("\n"));
});

function showProductDetails(id) {

    const product = products.find(product => product.id === id);

    if (!product) return;

    alert(
        product.name +
        "\n\n" +
        "Category: " + product.category +
        "\nRating: ⭐ " + product.rating + " / 5" +
        "\nPrice: ₹" + formatPrice(product.price) +
        "\nOld Price: ₹" + formatPrice(product.oldPrice) +
        "\n\n" +
        product.description
    );
}

document.getElementById("shopNowButton").addEventListener("click", function() {

    document.getElementById("productsSection").scrollIntoView({
        behavior: "smooth"
    });

});

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Please add a product to your cart first.");

        return;
    }

    closeCart();

    checkoutModal.classList.add("show");

    checkoutStep1.classList.remove("hidden");
    checkoutStep2.classList.add("hidden");
    checkoutStep3.classList.add("hidden");

});

closeCheckoutButton.addEventListener("click", function() {

    checkoutModal.classList.remove("show");

});

function getDeliveryDate(city) {

    const today = new Date();

    let daysToAdd;

    if (city === "Ahmedabad") {

        daysToAdd = 2;

    } else if (city === "Surat") {

        daysToAdd = 3;

    } else {

        daysToAdd = 4;
    }

    const deliveryDate = new Date(today);

    deliveryDate.setDate(today.getDate() + daysToAdd);

    return deliveryDate;
}

function getTimeSlot(city) {

    if (city === "Ahmedabad") {

        return "10:00 AM - 2:00 PM";

    }

    if (city === "Surat") {

        return "2:00 PM - 6:00 PM";
    }

    return "10:00 AM - 6:00 PM";
}

function formatDate(date) {

    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

customerCity.addEventListener("change", function() {

    const city = customerCity.value;

    if (!city) {

        deliveryPreview.innerHTML =
            "🚚 Select your city to see estimated delivery";

        return;
    }

    const deliveryDate = getDeliveryDate(city);

    const timeSlot = getTimeSlot(city);

    deliveryPreview.innerHTML = `
        🚚 <strong>Estimated Delivery</strong><br>
        📍 ${city}, Gujarat<br>
        📅 ${formatDate(deliveryDate)}<br>
        🕐 ${timeSlot}
    `;

});

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const mobile = document.getElementById("customerMobile").value;

    if (!/^[0-9]{10}$/.test(mobile)) {

        alert("Please enter a valid 10 digit mobile number.");

        return;
    }

    const pincode = document.getElementById("customerPincode").value;

    if (!/^[0-9]{6}$/.test(pincode)) {

        alert("Please enter a valid 6 digit pincode.");

        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    paymentAmount.textContent = formatPrice(total);

    checkoutStep1.classList.add("hidden");
    checkoutStep2.classList.remove("hidden");

    paymentVerified = false;

    placeOrderButton.disabled = true;

    paymentMessage.textContent = "";

});

upiPaymentButton.addEventListener("click", function() {

    selectedPayment = "UPI";

    upiPaymentButton.classList.add("active");
    gpayPaymentButton.classList.remove("active");

});

gpayPaymentButton.addEventListener("click", function() {

    selectedPayment = "Google Pay";

    gpayPaymentButton.classList.add("active");
    upiPaymentButton.classList.remove("active");

});

scanPaymentButton.addEventListener("click", function() {

    paymentMessage.innerHTML =
        "⏳ Verifying demo payment...";

    scanPaymentButton.disabled = true;

    setTimeout(function() {

        paymentVerified = true;

        paymentMessage.innerHTML =
            "✅ Demo payment verified successfully using " +
            selectedPayment + "!";

        placeOrderButton.disabled = false;

        scanPaymentButton.disabled = false;

    }, 1500);

});

placeOrderButton.addEventListener("click", function() {

    if (!paymentVerified) {

        alert("Please verify the demo payment first.");

        return;
    }

    placeOrder();

});

function placeOrder() {

    const name = document.getElementById("customerName").value;
    const city = document.getElementById("customerCity").value;

    const deliveryDate = getDeliveryDate(city);

    const timeSlot = getTimeSlot(city);

    const orderId =
        "SE" +
        Date.now().toString().slice(-8);

    const productNames = cart.map(
        item => item.name + " × " + item.quantity
    );

    document.getElementById("orderId").textContent = orderId;

    document.getElementById("orderProduct").textContent =
        productNames.join(", ");

    document.getElementById("orderCity").textContent =
        city + ", Gujarat";

    document.getElementById("orderDate").textContent =
        formatDate(deliveryDate);

    document.getElementById("orderTime").textContent =
        timeSlot;

    checkoutStep2.classList.add("hidden");
    checkoutStep3.classList.remove("hidden");

    cart = [];

    updateCart();

    console.log("Order placed by:", name);
    console.log("Payment:", selectedPayment);
}

continueShoppingButton.addEventListener("click", function() {

    checkoutModal.classList.remove("show");

    checkoutStep3.classList.add("hidden");
    checkoutStep1.classList.remove("hidden");

});

displayProducts(products);
updateCart();