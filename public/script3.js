```javascript
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
        rating: 4.6,
        image: "⌚"
    },
    {
        id: 3,
        name: "Men's Shirt",
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
        rating: 4.7,
        image: "👜"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2199,
        rating: 4.8,
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
        name: "Sunglasses",
        category: "Accessories",
        price: 799,
        rating: 4.4,
        image: "🕶️"
    },
    {
        id: 8,
        name: "Leather Wallet",
        category: "Accessories",
        price: 699,
        rating: 4.3,
        image: "👛"
    }
];

let cart = [];
let wishlist = [];

const productGrid = document.getElementById("productGrid");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");
const cartCount = document.getElementById("cartCount");
const wishCount = document.getElementById("wishCount");
const modal = document.getElementById("modal");

function showProducts(list) {
    if (list.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px">
                <h2>No products found</h2>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = list.map(product => `
        <div class="card">

            <button class="heart" onclick="toggleWishlist(${product.id})">
                ${wishlist.includes(product.id) ? "❤️" : "🤍"}
            </button>

            <div class="product-image">
                ${product.image}
            </div>

            <div class="card-content">
                <span class="category">${product.category}</span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating}
                </div>

                <div class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <button class="add" onclick="addToCart(${product.id})">
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
    let count = 0;
    let sum = 0;

    cart.forEach(item => {
        count += item.quantity;
        sum += item.price * item.quantity;
    });

    cartCount.textContent = count;
    total.textContent = "₹" + sum.toLocaleString("en-IN");

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center;padding:50px">
                <h2>🛒</h2>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">

            <div class="cart-img">
                ${item.image}
            </div>

            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button class="remove"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>
            </div>

        </div>
    `).join("");
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

function removeItem(id) {
    cart = cart.filter(product => product.id !== id);
    updateCart();
}

function openCart() {
    cart.classList.add("show");
    overlay.classList.add("show");
}

function closeCart() {
    cart.classList.remove("show");
    overlay.classList.remove("show");
}

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    wishCount.textContent = wishlist.length;

    showProducts(products);
}

function filterProducts(category) {
    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
    });

    document
        .querySelector(`[data-category="${category}"]`)
        .classList.add("active");

    if (category === "All") {
        showProducts(products);
    } else {
        const filtered = products.filter(
            product => product.category === category
        );

        showProducts(filtered);
    }
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        filterProducts(button.dataset.category);
    });
});

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

document.getElementById("shopNow").addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("homeBtn").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("searchBtn").addEventListener("click", search);

document.getElementById("search").addEventListener("input", search);

function search() {
    const text = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    const result = products.filter(product =>
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text)
    );

    showProducts(result);
}

document.getElementById("wishlistBtn").addEventListener("click", () => {
    const result = products.filter(product =>
        wishlist.includes(product.id)
    );

    if (result.length === 0) {
        alert("Your wishlist is empty.");
        return;
    }

    showProducts(result);

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    closeCart();
    modal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.remove("show");
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    alert("🎉 Order placed successfully!");

    cart = [];

    updateCart();

    modal.classList.remove("show");

    event.target.reset();
});

showProducts(products);
updateCart();
```
