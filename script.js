// Data Produk (sesuai permintaan Anda)
let products = [
  {
    id: 1,
    name: "Nasi Kuning",
    price: 10000,
    category: "makanan",
    img: "asset/nasi-kuning.jpg",
  },
  {
    id: 2,
    name: "Nasi Putih Campur",
    price: 10000,
    category: "makanan",
    img: "asset/nasi-putih.jpg",
  },
  {
    id: 3,
    name: "Es Teh Poci",
    price: 5000,
    category: "minuman",
    img: "asset/teh-poci.jpeg",
  },
  {
    id: 4,
    name: "Kopi Susu",
    price: 8000,
    category: "minuman",
    img: "asset/es-kopi-susu.png",
  },
  {
    id: 5,
    name: "SuperStar",
    price: 7000,
    category: "snack",
    img: "asset/superstar.png",
  },
  {
    id: 6,
    name: "Top",
    price: 9000,
    category: "snack",
    img: "asset/top.png",
  },
  {
    id: 7,
    name: "Aqua Galon",
    price: 18000,
    category: "minuman",
    img: "asset/aqua-galon.png",
  },
  {
    id: 8,
    name: "Aqua Botol Tanggung",
    price: 10000,
    category: "minuman",
    img: "asset/aqua-botol.png",
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
            <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150x110/cccccc/666666?text=No+Image'">
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

// Render Keranjang dengan tombol delete
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
            <div class="cart-item-info">
                <span>${item.name} × ${item.qty}</span>
                <span style="display:block; color:#e74c3c;">Rp ${itemTotal.toLocaleString("id-ID")}</span>
            </div>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
    cartItems.appendChild(div);
  });

  // Event delete
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      cart.splice(index, 1);
      renderCart();
    });
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

  cart = [];
  renderCart();
  document.getElementById("checkoutModal").style.display = "none";
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("checkoutModal").style.display = "none";
});

// History
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
      '<p style="text-align:center; color:#777; padding:20px;">Belum ada transaksi</p>';
    return;
  }

  transactions.forEach((t) => {
    let itemsHTML = t.items
      .map(
        (item) =>
          `<div style="margin:4px 0;">${item.name} ×${item.qty} - Rp ${(item.price * item.qty).toLocaleString("id-ID")}</div>`,
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

// Search
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm),
  );
  renderProducts(filtered);
}); 

// Inisialisasi
renderProducts(products);
