const products = [
  { id: "BM01", name: "Bột mì số 13 Baker's Choice 1kg", category: "Nguyên liệu", price: 32000, stock: 40 },
  { id: "BM02", name: "Bơ lạt Anchor 227g", category: "Sữa & Bơ", price: 78000, stock: 25 },
  { id: "BM03", name: "Whipping Cream Anchor 1L", category: "Sữa & Bơ", price: 165000, stock: 12 },
  { id: "BM04", name: "Chocolate đen 70% Puratos 500g", category: "Topping", price: 115000, stock: 18 },
  { id: "BM05", name: "Khuôn tròn đế rời 20cm", category: "Dụng cụ", price: 95000, stock: 30 },
  { id: "BM06", name: "Men nở ngọt Instant Mauripan 50g", category: "Nguyên liệu", price: 18000, stock: 60 }
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
    id: `BM${String(products.length + 1).padStart(2, "0")}`,
    name,
    category,
    price,
    stock
  };

  products.push(newProduct);
  console.table(products);
  addProductForm.reset();
  document.getElementById("prodPrice").value = 65000;
  document.getElementById("prodStock").value = 20;
  renderProducts();
});

[searchInput, categoryFilter, sortSelect, discountPreviewToggle].forEach((el) => {
  el.addEventListener("input", renderProducts);
  el.addEventListener("change", renderProducts);
});

renderProducts();
console.table(products);
