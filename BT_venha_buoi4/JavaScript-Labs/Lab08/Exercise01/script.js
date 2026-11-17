// External JavaScript cho Lab 08 - Exercise 01

const shopName = "BakeMate Store";
const labNumber = 8;
const isPublished = true;
const discountRate = 0.15;

const sampleProducts = [
  { id: "SP01", name: "Bột mì số 13 Baker's Choice", category: "Nguyên liệu", price: 32000, stock: 45 },
  { id: "SP02", name: "Bơ lạt Anchor 227g", category: "Sữa & Bơ", price: 78000, stock: 22 },
  { id: "SP03", name: "Chocolate đen 70% Puratos", category: "Topping", price: 115000, stock: 16 },
  { id: "SP04", name: "Khuôn bánh tròn chống dính 20cm", category: "Dụng cụ", price: 95000, stock: 30 }
];

const externalOutput = document.getElementById("externalOutput");
const productTableBody = document.getElementById("productTableBody");
const consoleMirror = document.getElementById("consoleMirror");
const btnLogConsole = document.getElementById("btnLogConsole");
const btnTableConsole = document.getElementById("btnTableConsole");
const btnClearLog = document.getElementById("btnClearLog");

function appendMirrorLog(label, payload) {
  const time = new Date().toLocaleTimeString("vi-VN");
  const formatted = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  consoleMirror.textContent += `[${time}] ${label}\n${formatted}\n\n`;
  consoleMirror.scrollTop = consoleMirror.scrollHeight;
}

function renderExternalInfo() {
  externalOutput.innerHTML = `
    <ul class="info-list">
      <li><strong>Tên cửa hàng (string):</strong> ${shopName}</li>
      <li><strong>Bài thực hành (number):</strong> Lab ${labNumber}</li>
      <li><strong>Trạng thái (boolean):</strong> ${isPublished ? "Đang hoạt động" : "Tạm ẩn"}</li>
      <li><strong>Chiết khấu mẫu:</strong> ${discountRate * 100}%</li>
      <li><strong>Số sản phẩm mẫu (Array):</strong> ${sampleProducts.length} sản phẩm</li>
    </ul>
  `;
}

function renderProductsTable() {
  productTableBody.innerHTML = sampleProducts
    .map(
      (item) => `
      <tr>
        <td><code>${item.id}</code></td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.price.toLocaleString("vi-VN")} đ</td>
        <td>${item.stock}</td>
      </tr>
    `
    )
    .join("");
}

function runVariableInspect() {
  const variableTypes = {
    shopName: `${shopName} (${typeof shopName})`,
    labNumber: `${labNumber} (${typeof labNumber})`,
    isPublished: `${isPublished} (${typeof isPublished})`,
    sampleProducts: `Array(${sampleProducts.length}) (${typeof sampleProducts})`
  };

  console.log("=== [External JS] Kiểm tra biến & kiểu dữ liệu ===", variableTypes);
  console.warn("Lưu ý: typeof Array trong JavaScript trả về 'object'; dùng Array.isArray() để xác nhận.");
  appendMirrorLog("console.log() — Kiểm tra biến & typeof", variableTypes);
}

function runTableInspect() {
  console.log("=== [External JS] Bảng danh sách sản phẩm (console.table) ===");
  console.table(sampleProducts);
  appendMirrorLog("console.table() — Danh sách sản phẩm mẫu", sampleProducts);
}

btnLogConsole.addEventListener("click", runVariableInspect);
btnTableConsole.addEventListener("click", runTableInspect);
btnClearLog.addEventListener("click", () => {
  consoleMirror.textContent = "";
});

// Khởi chạy mặc định khi nạp xong script.js
renderExternalInfo();
renderProductsTable();
runVariableInspect();
runTableInspect();
