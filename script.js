document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    setupCart();
});

let cart = [];

function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(products => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.forEach(product => {
                let productCard = document.createElement("div");
                productCard.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

                productCard.innerHTML = `
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <p class="price"><strong>$ ${product.price.toFixed(2)}</strong></p>
                            <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
                                Add to Cart
                            </button>
                        </div>
                    </div>`;

                productList.appendChild(productCard);
            });
        });
}

function setupCart() {
    let cartButton = document.getElementById("cart-btn");
    let cartSidebar = document.getElementById("cart-sidebar");

    
    cartButton.addEventListener("click", (event) => {
        event.stopPropagation();
        cartSidebar.classList.add("show");
    });

    document.addEventListener("click", (event) => {
        if (!cartSidebar.contains(event.target) && event.target !== cartButton) {
            cartSidebar.classList.remove("show");
        }
    });

    // Prevent cart from closing when clicking inside it
    cartSidebar.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}

function addToCart(id, title, price, image) {
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }

    updateCartUI();
}

function updateCartUI() {
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");
    let clearCartBtn = document.getElementById("clear-cart-btn");

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        let cartItem = document.createElement("li");
        cartItem.classList.add("list-group-item", "cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <strong>${item.title}</strong>
                <p>$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="decrementCartItem(${item.id})">➖</button>
                <span>${item.quantity}</span>
                <button onclick="incrementCartItem(${item.id})">➕</button>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">✖</button>
        `;

        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = itemCount;

    
}

function incrementCartItem(id) {
    let item = cart.find(item => item.id === id);
    if (item) {
        item.quantity++;
    }
    updateCartUI();
}

function decrementCartItem(id) {
    let item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(id);
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}
