
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        rating: 4.5,
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        rating: 4.4,
        image: "⌚"
    },
    {
        id: 3,
        name: "Men's Casual Shirt",
        category: "Fashion",
        price: 999,
        rating: 4.3,
        image: "👕"
    },
    {
        id: 4,
        name: "Women's Handbag",
        category: "Fashion",
        price: 1599,
        rating: 4.6,
        image: "👜"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2199,
        rating: 4.7,
        image: "👟"
    },
    {
        id: 6,
        name: "Sports Sneakers",
        category: "Shoes",
        price: 2799,
        rating: 4.5,
        image: "🥾"
    },
    {
        id: 7,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 799,
        rating: 4.2,
        image: "🕶️"
    },
    {
        id: 8,
        name: "Leather Wallet",
        category: "Accessories",
        price: 699,
        rating: 4.4,
        image: "👛"
    }
];

let cart = [];
let wishlist = [];

function displayProducts(list = products) {
    const container = document.getElementById("productContainer");

    if (list.length === 0) {
        container.innerHTML = "<h2>No products found.</h2>";
        return;
    }

    container.innerHTML = list.map(product => `
        <div class="product-card">
            <button class="wishlist" onclick="toggleWishlist(${product.id})">
                ${wishlist.includes(product.id) ? "❤️" : "🤍"}
            </button>

            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-info">
                <span class="category-name">${product.category}</span>
                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating}
                </div>

                <div class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <button class="add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
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
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = count;
    cartTotal.textContent = "₹" + total.toLocaleString("en-IN");

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center;padding:50px 10px;">
                <h2>🛒</h2>
                <p>Your cart is empty.</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">

            <div class="cart-item-image">
                ${item.image}
            </div>

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    <button class="remove" onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            </div>

        </div>
    `).join("");
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(product => product.id !== id);
    updateCart();
}

function openCart() {
    document.getElementById("cartPanel").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
    document.getElementById("cartPanel").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
}

function filterProducts(category) {
    document.querySelectorAll(".category").forEach(button => {
        button.classList.remove("active");

        if (button.textContent === category) {
            button.classList.add("active");
        }
    });

    if (category === "All") {
        displayProducts(products);
    } else {
        const filtered = products.filter(
            product => product.category === category
        );

        displayProducts(filtered);
    }
}

function searchProducts() {
    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );

    displayProducts(filtered);
}

document.getElementById("searchInput").addEventListener("keyup", searchProducts);

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    document.getElementById("wishlistCount").textContent = wishlist.length;

    displayProducts();
}

function showWishlist() {
    const wishlistProducts = products.filter(product =>
        wishlist.includes(product.id)
    );

    if (wishlistProducts.length === 0) {
        alert("Your wishlist is empty.");
        return;
    }

    displayProducts(wishlistProducts);
    document.getElementById("productsSection").scrollIntoView({
        behavior: "smooth"
    });
}

function scrollToProducts() {
    document.getElementById("productsSection").scrollIntoView({
        behavior: "smooth"
    });
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    closeCart();
    document.getElementById("checkoutModal").classList.add("show");
}

function closeCheckout() {
    document.getElementById("checkoutModal").classList.remove("show");
}

function placeOrder(event) {
    event.preventDefault();

    alert("🎉 Order placed successfully!");

    cart = [];
    updateCart();
    closeCheckout();
}

displayProducts();
updateCart();

