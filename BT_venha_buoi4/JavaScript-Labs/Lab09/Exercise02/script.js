const shoppingForm = document.getElementById("shoppingForm");
const itemNameInput = document.getElementById("itemNameInput");
const itemQtyInput = document.getElementById("itemQtyInput");
const itemCategoryInput = document.getElementById("itemCategoryInput");
const shoppingList = document.getElementById("shoppingList");
const listStats = document.getElementById("listStats");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.getElementById("clearDoneBtn");

let currentFilter = "all";

const initialItems = [
  { name: "Sách Nền tảng Web & TMĐT Hiện đại", qty: "1 cuốn", category: "Sách học tập", done: false },
  { name: "Chuột công thái học Silent Type-C", qty: "1 cái", category: "Phụ kiện PC", done: true },
  { name: "Tai nghe Bluetooth Chống Ồn ANC", qty: "1 bộ", category: "Âm thanh", done: false }
];

function createShoppingItemNode(name, qty, category, done = false) {
  const li = document.createElement("li");
  li.className = "shopping-item";
  if (done) li.classList.add("is-done");
  li.dataset.done = String(done);

  const leftWrap = document.createElement("div");
  leftWrap.className = "item-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = done;
  checkbox.ariaLabel = `Đánh dấu đã mua ${name}`;

  const titleSpan = document.createElement("span");
  titleSpan.className = "item-title";
  titleSpan.textContent = name;

  leftWrap.appendChild(checkbox);
  leftWrap.appendChild(titleSpan);

  const metaWrap = document.createElement("div");
  metaWrap.className = "item-meta";

  const qtyBadge = document.createElement("span");
  qtyBadge.className = "pill qty-pill";
  qtyBadge.textContent = qty || "1 phần";

  const catBadge = document.createElement("span");
  catBadge.className = "pill";
  catBadge.textContent = category;

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "Xóa";

  metaWrap.appendChild(qtyBadge);
  metaWrap.appendChild(catBadge);
  metaWrap.appendChild(delBtn);

  li.appendChild(leftWrap);
  li.appendChild(metaWrap);

  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    li.classList.toggle("is-done", isChecked);
    li.dataset.done = String(isChecked);
    refreshView();
  });

  delBtn.addEventListener("click", () => {
    li.remove();
    refreshView();
  });

  return li;
}

function refreshView() {
  const allItems = Array.from(shoppingList.children);
  const doneCount = allItems.filter((item) => item.dataset.done === "true").length;
  listStats.textContent = `Tổng: ${allItems.length} mục · Đã mua: ${doneCount} · Còn lại: ${allItems.length - doneCount}`;

  let visibleCount = 0;
  allItems.forEach((item) => {
    const isDone = item.dataset.done === "true";
    const show =
      currentFilter === "all" ||
      (currentFilter === "done" && isDone) ||
      (currentFilter === "pending" && !isDone);
    item.style.display = show ? "flex" : "none";
    if (show) visibleCount++;
  });

  emptyState.hidden = visibleCount > 0;
}

shoppingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = itemNameInput.value.trim();
  const qty = itemQtyInput.value.trim();
  const category = itemCategoryInput.value;

  if (!name) return;

  const node = createShoppingItemNode(name, qty, category, false);
  shoppingList.appendChild(node);

  itemNameInput.value = "";
  itemQtyInput.value = "1 cái";
  itemNameInput.focus();
  refreshView();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    refreshView();
  });
});

clearDoneBtn.addEventListener("click", () => {
  const doneItems = shoppingList.querySelectorAll('.shopping-item[data-done="true"]');
  doneItems.forEach((item) => item.remove());
  refreshView();
});

initialItems.forEach((item) => {
  shoppingList.appendChild(createShoppingItemNode(item.name, item.qty, item.category, item.done));
});
refreshView();
