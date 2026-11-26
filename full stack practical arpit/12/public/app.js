
let cart = [];
let editingProductId = null;

const $ = id => document.getElementById(id);


// =========================
// NAVIGATION
// =========================

function showTab(tab) {
    ["shop", "cart", "orders", "seller"].forEach(x => {
        $(x).hidden = x !== tab;
    });

    if (tab === "cart") renderCart();
    if (tab === "orders") loadOrders();
    if (tab === "seller") loadSeller();
}


// =========================
// HELPER FUNCTION
// =========================

function safe(s = "") {
    return String(s).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function updateCartCount() {
    $("cartCount").textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
}


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {
    const response = await fetch("/api/products");
    const data = await response.json();

    $("products").innerHTML = data.map(p => `
        <article class="card">
            <h3>${safe(p.name)}</h3>

            <p>${safe(p.description || "")}</p>

            <b>₹${p.price}</b>

            <p>
                <button onclick="addCart('${p._id}')">
                    Add to Cart
                </button>
            </p>
        </article>
    `).join("") || "<p>No products available.</p>";
}


// =========================
// CART FUNCTIONS
// =========================

async function addCart(id) {
    const response = await fetch("/api/products");
    const products = await response.json();

    const product = products.find(p => p._id === id);

    if (!product) return;

    const found = cart.find(x => x.productId === id);

    if (found) {
        found.quantity++;
    } else {
        cart.push({
            productId: id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartCount();

    alert("Product added to cart!");
}


function increaseQuantity(id) {
    const item = cart.find(x => x.productId === id);

    if (item) {
        item.quantity++;
    }

    updateCartCount();
    renderCart();
}


function decreaseQuantity(id) {
    const item = cart.find(x => x.productId === id);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(x => x.productId !== id);
    }

    updateCartCount();
    renderCart();
}


function removeCart(id) {
    cart = cart.filter(x => x.productId !== id);

    updateCartCount();
    renderCart();
}


function renderCart() {
    $("cartItems").innerHTML = cart.map(item => `
        <div class="card">

            <h3>${safe(item.name)}</h3>

            <p>Price: ₹${item.price}</p>

            <p>
                Quantity:
                <button onclick="decreaseQuantity('${item.productId}')">−</button>

                <b>${item.quantity}</b>

                <button onclick="increaseQuantity('${item.productId}')">+</button>
            </p>

            <p>
                Subtotal: ₹${item.price * item.quantity}
            </p>

            <button onclick="removeCart('${item.productId}')">
                Remove
            </button>

        </div>
    `).join("") || "<p>Your cart is empty.</p>";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    $("total").textContent = "Total: ₹" + total;
}


// =========================
// CHECKOUT
// =========================


// =========================
// SIMULATED PAYMENT CHECKOUT
// =========================

// Open payment window when customer submits checkout

$("checkout").addEventListener("submit", e => {
    e.preventDefault();

    if (cart.length === 0) {
        $("checkoutMessage").textContent = "Your cart is empty.";
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    $("paymentAmount").textContent = "₹" + total;

    $("checkoutMessage").textContent = "";

    $("paymentModal").hidden = false;
});


// Close payment window

$("cancelPayment").addEventListener("click", () => {
    $("paymentModal").hidden = true;
});


// Simulate failed payment

$("paymentFailure").addEventListener("click", () => {
    $("paymentModal").hidden = true;

    $("checkoutMessage").textContent =
        "Payment failed! No order has been placed. Please try again.";
});


// Simulate successful payment

$("paymentSuccess").addEventListener("click", async () => {

    if (cart.length === 0) {
        $("paymentModal").hidden = true;
        $("checkoutMessage").textContent = "Your cart is empty.";
        return;
    }

    const successButton = $("paymentSuccess");

    successButton.disabled = true;
    successButton.textContent = "Processing...";

    try {

        const response = await fetch("/api/orders", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                items: cart,
                customerEmail: $("email").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Order could not be placed.");
        }

        // Clear cart after successful demo order

        cart = [];

        updateCartCount();
        renderCart();

        $("checkout").reset();

        $("paymentModal").hidden = true;

        $("checkoutMessage").textContent =
            "Payment successful! Your demo order has been placed.";

    } catch (error) {

        $("checkoutMessage").textContent = error.message;

        $("paymentModal").hidden = true;

    } finally {

        successButton.disabled = false;
        successButton.textContent = "Simulate Successful Payment";

    }

});



// =========================
// SELLER PANEL
// =========================

$("sellerForm").addEventListener("submit", async e => {
    e.preventDefault();

    const product = {
        name: $("pname").value.trim(),
        price: Number($("pprice").value),
        description: $("pdesc").value.trim()
    };

    if (!product.name || !Number.isFinite(product.price) || product.price <= 0) {
        alert("Enter a valid product name and price.");
        return;
    }

    const url = editingProductId
        ? "/api/products/" + editingProductId
        : "/api/products";

    const method = editingProductId ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        alert("Unable to save product.");
        return;
    }

    alert(editingProductId
        ? "Product updated successfully!"
        : "Product added successfully!");

    resetSellerForm();

    loadProducts();
    loadSeller();
});


async function loadSeller() {
    const response = await fetch("/api/products");
    const data = await response.json();

    $("sellerProducts").innerHTML = data.map(p => `
        <p>
            <span>
                <b>${safe(p.name)}</b> — ₹${p.price}
            </span>

            <span>
                <button onclick="editProduct('${p._id}')">
                    Edit
                </button>

                <button onclick="deleteProduct('${p._id}')">
                    Delete
                </button>
            </span>
        </p>
    `).join("") || "<p>No products available.</p>";
}


// =========================
// EDIT PRODUCT
// =========================

async function editProduct(id) {
    const response = await fetch("/api/products");
    const products = await response.json();

    const product = products.find(p => p._id === id);

    if (!product) return;

    editingProductId = id;

    $("pname").value = product.name;
    $("pprice").value = product.price;
    $("pdesc").value = product.description || "";

    $("sellerFormTitle").textContent = "Edit Product";
    $("sellerSubmit").textContent = "Update Product";
    $("cancelEdit").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function resetSellerForm() {
    editingProductId = null;

    $("sellerForm").reset();

    $("sellerFormTitle").textContent = "Add New Product";
    $("sellerSubmit").textContent = "Add Product";
    $("cancelEdit").hidden = true;
}


$("cancelEdit").addEventListener("click", resetSellerForm);


// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    const response = await fetch("/api/products/" + id, {
        method: "DELETE"
    });

    if (!response.ok) {
        alert("Unable to delete product.");
        return;
    }

    cart = cart.filter(item => item.productId !== id);

    updateCartCount();

    loadProducts();
    loadSeller();
}


// =========================
// ORDER MANAGEMENT
// =========================

async function loadOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();

    $("ordersList").innerHTML = data.map(o => `
        <article class="card">

            <h3>Order Details</h3>

            <b>${safe(o.customerEmail)}</b>

            <p>Total: ₹${o.total}</p>

            <p>Status: ${safe(o.status)}</p>

            <p>
                ${o.items.map(i =>
                    safe(i.name) + " × " + i.quantity
                ).join(", ")}
            </p>

        </article>
    `).join("") || "<p>No orders yet.</p>";
}


// =========================
// INITIAL LOAD
// =========================

loadProducts();
