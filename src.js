// ---------- VARS ----------
const cart = []; // [{name, price, image, qty, favorite}]
const cartSection = document.getElementById("shopping-cart");
const cartOverlay = document.getElementById("cart-bg");
const viewCartBtn = document.getElementById("viewCart");
const viewCartMbBtn = document.getElementById("viewCart-mobile");
const closeCartBtn = document.getElementById("close-cart");
const cartNtf = document.getElementById("cart-ntf");

// ---------- INIT ----------
window.addEventListener("DOMContentLoaded", () => {
  hideCart(); // HIDE CART ON LOAD
  attachAddToCartEvents();
});

// ---------- DISPLAYING CART ----------
function showCart() {
  cartSection.classList.add("show");
  cartOverlay.classList.add("show");
}

function hideCart() {
  cartSection.classList.remove("show");
  cartOverlay.classList.remove("show");
}

// ---------- EVENTS OPEN / CLOSE ----------
viewCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showCart();
});
viewCartMbBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showCart();
});

closeCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  hideCart();
});

cartOverlay.addEventListener("click", hideCart);

// ---------- ADDING PRODUCTS ----------
function attachAddToCartEvents() {
  document.querySelectorAll(".btn.tocart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const box = e.target.closest(".box");
      const name = box.querySelector(".box-title").textContent.trim();
      const price = parseFloat(box.querySelector(".price").textContent.trim());
      const image = box.querySelector(".product-img").src;

      addToCart(name, price, image);

      if (window.innerWidth > 768) {
        showCart();
      }
    });
  });
}

function addToCart(name, price, image) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, image, qty: 1, favorite: false });
  }
  renderCart();
}

// ---------- DELETION AND UPDATE ----------
function updateQty(name, delta) {
  const item = cart.find((p) => p.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      deleteItem(name);
    } else {
      renderCart();
    }
  }
}

function deleteItem(name) {
  const index = cart.findIndex((p) => p.name === name);
  if (index > -1) {
    cart.splice(index, 1);
  }
  renderCart();
}

function displayNotification(cart) {
    if (cart.length > 0){
        cartNtf.innerHTML = cart.length;
        cartNtf.classList.add("show");
    }
}

// ---------- LIKE ----------
function toggleFavorite(name) {
  const item = cart.find((p) => p.name === name);
  if (item) {
    item.favorite = !item.favorite;
    renderCart();
  }
}

// ---------- SHOWING CART ----------
function renderCart() {
  const container = document.querySelector("#shopping-cart .cart-items");
  const totalDiv = document.querySelector("#shopping-cart .cart-total");
  if (!container) {
    const div = document.createElement("div");
    div.className = "cart-items";
    cartSection.appendChild(div);

    const total = document.createElement("div");
    total.className = "cart-total";
    cartSection.appendChild(total);
  }

  const cartItemsDiv = document.querySelector("#shopping-cart .cart-items");
  const totalContainer = document.querySelector("#shopping-cart .cart-total");
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p class="empty-cart">Your Shopping Cart is empty !</p>`;
    totalContainer.innerHTML = "";
    cartNtf.classList.remove("show");
    cartNtf.innerHTML = 0;
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>${item.price.toFixed(2)} TND</p>
        <div class="qty-controls">
          <button class="qty-btn minus">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn plus">+</button>
        </div>
      </div>
      <div class="cart-actions">
        <button class="fav-btn">
          <i class="fa-solid fa-heart ${item.favorite ? "favorite" : ""}"></i>
        </button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    // EVENTS
    div.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.name));
    div.querySelector(".plus").addEventListener("click", () => updateQty(item.name, 1));
    div.querySelector(".minus").addEventListener("click", () => updateQty(item.name, -1));
    div.querySelector(".fav-btn").addEventListener("click", () => toggleFavorite(item.name));

    cartItemsDiv.appendChild(div);
    displayNotification(cart);
  });

  const total = cart.reduce((acc, p) => acc + p.price * p.qty, 0);
  totalContainer.innerHTML = `<h4>Total: ${total.toFixed(2)} TND</h4>`;
}
