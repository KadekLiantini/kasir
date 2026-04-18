// Data Produk
let products = [
  {
    id: 1,
    name: "Nasi Goreng",
    price: 15000,
    category: "makanan",
    img: "https://via.placeholder.com/150x100/FF5733/FFFFFF?text=Nasi+Goreng",
  },
  {
    id: 2,
    name: "Mie Ayam",
    price: 12000,
    category: "makanan",
    img: "https://via.placeholder.com/150x100/FF8C00/FFFFFF?text=Mie+Ayam",
  },
  {
    id: 3,
    name: "Es Teh Manis",
    price: 5000,
    category: "minuman",
    img: "https://via.placeholder.com/150x100/00BFFF/FFFFFF?text=Es+Teh",
  },
  {
    id: 4,
    name: "Kopi Susu",
    price: 8000,
    category: "minuman",
    img: "https://via.placeholder.com/150x100/4A2C00/FFFFFF?text=Kopi+Susu",
  },
  {
    id: 5,
    name: "Keripik Kentang",
    price: 7000,
    category: "snack",
    img: "https://via.placeholder.com/150x100/FFD700/333?text=Keripik",
  },
  {
    id: 6,
    name: "Chitato",
    price: 9000,
    category: "snack",
    img: "https://via.placeholder.com/150x100/FF4500/FFFFFF?text=Chitato",
  },
  {
    id: 7,
    name: "Ayam Geprek",
    price: 18000,
    category: "makanan",
    img: "https://via.placeholder.com/150x100/DC143C/FFFFFF?text=Ayam+Geprek",
  },
  {
    id: 8,
    name: "Jus Jeruk",
    price: 10000,
    category: "minuman",
    img: "https://via.placeholder.com/150x100/FFA500/FFFFFF?text=Jus+Jeruk",
  },
];

let cart = [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Render Produk
function renderProducts(filteredProducts) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString("id-ID")}</p>
            </div>
        `;
    card.onclick = () => addToCart(product);
    grid.appendChild(card);
  });
}

// Tambah ke Keranjang
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// Render Keranjang
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const totalAmount = document.getElementById("totalAmount");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <span>${item.name} x${item.qty}</span>
            <span>Rp ${itemTotal.toLocaleString("id-ID")}</span>
        `;
    cartItems.appendChild(div);
  });

  cartCount.textContent = cart.length;
  totalAmount.textContent = total.toLocaleString("id-ID");
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("modalTotal").textContent =
    total.toLocaleString("id-ID");
  document.getElementById("paidAmount").value = "";
  document.getElementById("changeAmount").textContent = "0";

  document.getElementById("checkoutModal").style.display = "flex";
});

// Hitung Kembalian
document.getElementById("paidAmount").addEventListener("input", function () {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const paid = parseFloat(this.value) || 0;
  const change = paid - total;
  document.getElementById("changeAmount").textContent = Math.max(
    0,
    change,
  ).toLocaleString("id-ID");
});

// Konfirmasi Transaksi
document.getElementById("confirmBtn").addEventListener("click", () => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const paid = parseFloat(document.getElementById("paidAmount").value) || 0;

  if (paid < total) {
    alert("Uang yang dibayarkan kurang!");
    return;
  }

  const date = new Date();
  const transaction = {
    id: Date.now(),
    date: date.toLocaleDateString("id-ID"),
    time: date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: [...cart],
    total: total,
    paid: paid,
    change: paid - total,
  };

  transactions.unshift(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  alert("✅ Transaksi berhasil disimpan!");

  // Reset
  cart = [];
  renderCart();
  document.getElementById("checkoutModal").style.display = "none";
});

// Batal Checkout
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("checkoutModal").style.display = "none";
});

// Tampilkan Riwayat
document.getElementById("historyBtn").addEventListener("click", () => {
  renderHistory();
  document.getElementById("historyModal").style.display = "flex";
});

document.getElementById("closeHistoryBtn").addEventListener("click", () => {
  document.getElementById("historyModal").style.display = "none";
});

function renderHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  if (transactions.length === 0) {
    historyList.innerHTML =
      '<p style="text-align:center; color:#777;">Belum ada transaksi</p>';
    return;
  }

  transactions.forEach((t) => {
    let itemsHTML = t.items
      .map(
        (item) =>
          `<div>${item.name} x${item.qty} - Rp ${(item.price * item.qty).toLocaleString("id-ID")}</div>`,
      )
      .join("");

    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
            <strong>${t.date} ${t.time}</strong><br>
            ${itemsHTML}
            <hr style="margin:8px 0">
            <strong>Total: Rp ${t.total.toLocaleString("id-ID")}</strong><br>
            <small>Kembalian: Rp ${t.change.toLocaleString("id-ID")}</small>
        `;
    historyList.appendChild(div);
  });
}

// Filter Kategori
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");

    let filtered = products;
    if (category !== "all") {
      filtered = products.filter((p) => p.category === category);
    }

    renderProducts(filtered);
  });
});

// Search Functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm),
  );

  renderProducts(filtered);
});

// Inisialisasi Awal
renderProducts(products);
