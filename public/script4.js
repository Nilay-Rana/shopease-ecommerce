
const products = [

    {
        id: 1,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        oldPrice: 4999,
        rating: 4.7,
        image: "⌚",
        description: "Smart fitness watch with heart-rate tracking, notifications and multiple sports modes."
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        oldPrice: 3999,
        rating: 4.5,
        image: "🎧",
        description: "Wireless headphones with clear sound, comfortable ear cushions and long battery life."
    },

    {
        id: 3,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1799,
        oldPrice: 2999,
        rating: 4.4,
        image: "🔊",
        description: "Portable Bluetooth speaker with powerful sound and compact design."
    },

    {
        id: 4,
        name: "Men's Casual Shirt",
        category: "Fashion",
        price: 999,
        oldPrice: 1499,
        rating: 4.3,
        image: "👕",
        description: "Comfortable casual shirt suitable for everyday wear."
    },

    {
        id: 5,
        name: "Women's Handbag",
        category: "Fashion",
        price: 1599,
        oldPrice: 2499,
        rating: 4.6,
        image: "👜",
        description: "Stylish handbag with spacious compartments and modern design."
    },

    {
        id: 6,
        name: "Running Shoes",
        category: "Shoes",
        price: 2199,
        oldPrice: 3499,
        rating: 4.8,
        image: "👟",
        description: "Lightweight running shoes designed for comfortable daily activities."
    },

    {
        id: 7,
        name: "Sports Sneakers",
        category: "Shoes",
        price: 2799,
        oldPrice: 3999,
        rating: 4.5,
        image: "🥾",
        description: "Modern sports sneakers with comfortable sole and stylish appearance."
    },

    {
        id: 8,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 799,
        oldPrice: 1299,
        rating: 4.4,
        image: "🕶️",
        description: "Classic sunglasses with a stylish frame for everyday use."
    },

    {
        id: 9,
        name: "Leather Wallet",
        category: "Accessories",
        price: 699,
        oldPrice: 999,
        rating: 4.3,
        image: "👛",
        description: "Compact wallet with multiple card slots and a premium design."
    },

    {
        id: 10,
        name: "Travel Backpack",
        category: "Accessories",
        price: 1299,
        oldPrice: 1999,
        rating: 4.6,
        image: "🎒",
        description: "Durable backpack with multiple compartments for travel and college."
    }

];


let cart = [];

let wishlist = [];


const productGrid =
    document.getElementById("productGrid");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const cartPanel =
    document.getElementById("cartPanel");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const cartTotal =
    document.getElementById("cartTotal");

const resultText =
    document.getElementById("resultText");

const checkoutModal =
    document.getElementById("checkoutModal");


/* DISPLAY PRODUCTS */

function displayProducts(productList) {

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">

                <h2>😔 Product Not Found</h2>

                <p>
                    Try searching for Smart Watch,
                    Headphones, Shoes or Shirt.
                </p>

            </div>
        `;

        return;
    }


    productGrid.innerHTML =
        productList.map(product => `

        <div class="product-card">

            <button
                class="heart-button"
                onclick="toggleWishlist(${product.id})"
            >
                ${
                    wishlist.includes(product.id)
                    ? "❤️"
                    : "🤍"
                }
            </button>


            <div class="product-image">
                ${product.image}
            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <div class="rating">
                    ⭐ ${product.rating} / 5
                </div>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="price">

                    ₹${product.price.toLocaleString("en-IN")}

                    <span class="old-price">
                        ₹${product.oldPrice.toLocaleString("en-IN")}
                    </span>

                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>

    `).join("");
}


/* SEARCH */

function searchProducts() {

    const searchValue =
        searchInput.value
        .toLowerCase()
        .trim();


    if (searchValue === "") {

        displayProducts(products);

        resultText.textContent =
            "Explore our latest products";

        return;
    }


    const filteredProducts =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(searchValue)

            ||

            product.category
                .toLowerCase()
                .includes(searchValue)

            ||

            product.description
                .toLowerCase()
                .includes(searchValue)

        );


    displayProducts(filteredProducts);


    if (filteredProducts.length > 0) {

        resultText.textContent =
            `Showing ${filteredProducts.length} product(s) for "${searchInput.value}"`;

    } else {

        resultText.textContent =
            `No results for "${searchInput.value}"`;

    }


    document
        .getElementById("productsSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


searchButton.addEventListener(
    "click",
    searchProducts
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    }
);


/* CATEGORY FILTER */

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".category")
                    .forEach(btn => {

                        btn.classList.remove("active");

                    });


                this.classList.add("active");


                const category =
                    this.dataset.category;


                if (category === "All") {

                    displayProducts(products);

                    resultText.textContent =
                        "Explore our latest products";

                } else {

                    const filtered =
                        products.filter(product =>
                            product.category === category
                        );


                    displayProducts(filtered);

                    resultText.textContent =
                        `${category} Products`;
                }


                document
                    .getElementById("productsSection")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* ADD TO CART */

function addToCart(id) {

    const product =
        products.find(item =>
            item.id === id
        );


    const existing =
        cart.find(item =>
            item.id === id
        );


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


/* UPDATE CART */

function updateCart() {

    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        totalItems += item.quantity;

        totalPrice +=
            item.price * item.quantity;

    });


    cartCount.textContent =
        totalItems;


    cartTotal.textContent =
        "₹" +
        totalPrice.toLocaleString("en-IN");


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:60px 20px;
                "
            >

                <div
                    style="
                        font-size:50px;
                        margin-bottom:15px;
                    "
                >
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some products to your cart.
                </p>

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(item => `

        <div class="cart-item">

            <div class="cart-item-image">
                ${item.image}
            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                </p>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                    <button
                        class="remove-button"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        </div>

    `).join("");

}


/* CHANGE QUANTITY */

function changeQuantity(id, amount) {

    const item =
        cart.find(product =>
            product.id === id
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(product =>
                product.id !== id
            );

    }


    updateCart();

}


/* REMOVE FROM CART */

function removeFromCart(id) {

    cart =
        cart.filter(product =>
            product.id !== id
        );


    updateCart();

}


/* OPEN CART */

function openCart() {

    cartPanel.classList.add("show");

    cartOverlay.classList.add("show");

}


/* CLOSE CART */

function closeCart() {

    cartPanel.classList.remove("show");

    cartOverlay.classList.remove("show");

}


document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCartButton")
    .addEventListener(
        "click",
        closeCart
    );


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* WISHLIST */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item =>
                item !== id
            );

    } else {

        wishlist.push(id);

    }


    wishlistCount.textContent =
        wishlist.length;


    displayProducts(products);

}


/* WISHLIST BUTTON */

document
    .getElementById("wishlistButton")
    .addEventListener(
        "click",
        function() {

            const wishlistProducts =
                products.filter(product =>
                    wishlist.includes(product.id)
                );


            if (wishlistProducts.length === 0) {

                alert(
                    "Your wishlist is empty."
                );

                return;

            }


            displayProducts(
                wishlistProducts
            );


            resultText.textContent =
                "Your Wishlist";


            document
                .getElementById("productsSection")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* HOME BUTTON */

document
    .getElementById("homeButton")
    .addEventListener(
        "click",
        function() {

            searchInput.value = "";

            displayProducts(products);

            resultText.textContent =
                "Explore our latest products";


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


/* SHOP NOW */

document
    .getElementById("shopNowButton")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("productsSection")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* CHECKOUT */

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            closeCart();

            checkoutModal.classList.add(
                "show"
            );

        }
    );


/* CLOSE CHECKOUT */

document
    .getElementById("closeCheckoutButton")
    .addEventListener(
        "click",
        function() {

            checkoutModal.classList.remove(
                "show"
            );

        }
    );


/* PLACE ORDER */

document
    .getElementById("checkoutForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "🎉 Order placed successfully!"
            );


            cart = [];

            updateCart();


            checkoutModal.classList.remove(
                "show"
            );


            this.reset();

        }
    );


/* INITIAL DISPLAY */

displayProducts(products);

updateCart();

