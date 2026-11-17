const products = [
  { id: "UM01", name: "Tai nghe Bluetooth Chống Ồn ANC", category: "Âm thanh", price: 1290000, stock: 24 },
  { id: "UM02", name: "Bàn phím cơ Không dây 3 Mode RGB", category: "Phụ kiện PC", price: 845000, stock: 18 },
  { id: "UM03", name: "Sách Nền tảng Web & TMĐT Hiện đại", category: "Sách công nghệ", price: 196000, stock: 45 },
  { id: "UM04", name: "Chuột không dây Công thái học Silent", category: "Phụ kiện PC", price: 299000, stock: 32 },
  { id: "UM05", name: "Giá đỡ Laptop hợp kim nhôm", category: "Phụ kiện PC", price: 245000, stock: 27 },
  { id: "UM06", name: "Đèn bàn học chống cận cảm ứng", category: "Gia dụng", price: 320000, stock: 15 }
];

const kpiCountEl = document.getElementById("kpiCount");
const kpiStockEl = document.getElementById("kpiStock");
const kpiValueEl = document.getElementById("kpiValue");
const kpiAvgEl = document.getElementById("kpiAvg");
const productBodyEl = document.getElementById("productBody");

const addProductForm = document.getElementById("addProductForm");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const discountPreviewToggle = document.getElementById("discountPreviewToggle");

function formatCurrency(value) {
  return `${Math.round(value).toLocaleString("vi-VN")} đ`;
}

function getFilteredProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortBy = sortSelect.value;

  // 1. Dùng filter() lọc theo từ khóa và danh mục
  const filtered = products.filter((item) => {
    const matchName = item.name.toLowerCase().includes(keyword);
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchName && matchCategory;
  });

  // 2. Dùng sort() trên bản sao mảng để không làm biến đổi thứ tự gốc
  const sorted = [...filtered];
  if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === "stock-desc") {
    sorted.sort((a, b) => b.stock - a.stock);
  }

  return sorted;
}

function computeSummary(list) {
  // 3. Dùng reduce() tổng hợp tồn kho và giá trị hàng hóa
  const totals = list.reduce(
    (acc, item) => {
      acc.totalStock += item.stock;
      acc.totalValue += item.price * item.stock;
      acc.priceSum += item.price;
      return acc;
    },
    { totalStock: 0, totalValue: 0, priceSum: 0 }
  );

  const avgPrice = list.length > 0 ? totals.priceSum / list.length : 0;
  return {
    count: list.length,
    totalStock: totals.totalStock,
    totalValue: totals.totalValue,
    avgPrice
  };
}

function renderProducts() {
  const applyDiscount = discountPreviewToggle.checked;
  const filteredList = getFilteredProducts();

  // 4. Dùng map() biến đổi giá hiển thị nếu bật chế độ giảm 10%
  const displayList = filteredList.map((item) => ({
    ...item,
    effectivePrice: applyDiscount ? item.price * 0.9 : item.price
  }));

  const summary = computeSummary(displayList);
  kpiCountEl.textContent = summary.count;
  kpiStockEl.textContent = summary.totalStock;
  kpiValueEl.textContent = formatCurrency(summary.totalValue);
  kpiAvgEl.textContent = formatCurrency(summary.avgPrice);

  if (displayList.length === 0) {
    productBodyEl.innerHTML = `<tr><td colspan="6">Không có sản phẩm nào khớp điều kiện lọc.</td></tr>`;
    return;
  }

  productBodyEl.innerHTML = displayList
    .map(
      (item) => `
      <tr>
        <td><code>${item.id}</code></td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>
          ${applyDiscount
            ? `<span class="old-price">${formatCurrency(item.price)}</span><span class="sale-price">${formatCurrency(item.effectivePrice)}</span>`
            : formatCurrency(item.effectivePrice)}
        </td>
        <td>${item.stock}</td>
        <td><strong>${formatCurrency(item.effectivePrice * item.stock)}</strong></td>
      </tr>
    `
    )
    .join("");
}

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("prodName").value.trim();
  const category = document.getElementById("prodCategory").value;
  const price = Math.max(1000, Number(document.getElementById("prodPrice").value) || 0);
  const stock = Math.max(0, parseInt(document.getElementById("prodStock").value, 10) || 0);

  if (!name) return;

  const newProduct = {
    id: `UM${String(products.length + 1).padStart(2, "0")}`,
    name,
    category,
    price,
    stock
  };

  products.push(newProduct);
  console.table(products);
  addProductForm.reset();
  document.getElementById("prodPrice").value = 350000;
  document.getElementById("prodStock").value = 20;
  renderProducts();
});

[searchInput, categoryFilter, sortSelect, discountPreviewToggle].forEach((el) => {
  el.addEventListener("input", renderProducts);
  el.addEventListener("change", renderProducts);
});

renderProducts();
console.table(products);
