function escapeXml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Tạo ảnh SVG nhúng dạng Data URI để luôn hiển thị sắc nét offline lẫn GitHub Pages
function makeProductSvg(title, subtitle, color1, color2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs>
    <rect width="600" height="320" fill="url(#g)"/>
    <circle cx="510" cy="65" r="55" fill="rgba(255,255,255,0.12)"/>
    <circle cx="95" cy="260" r="70" fill="rgba(255,255,255,0.1)"/>
    <text x="50%" y="48%" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#ffffff">${escapeXml(title)}</text>
    <text x="50%" y="62%" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" fill="rgba(255,255,255,0.88)">${escapeXml(subtitle)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const variants = {
  cake: {
    title: "Combo Làm Bánh Bông Lan Cơ Bản",
    desc: "Bao gồm bột mì mịn số 8, bơ lạt nhập khẩu và khuôn tròn chống dính 18cm cho người mới bắt đầu.",
    badge: "Bán chạy #1",
    price: "249.000 đ",
    specs: ["Trọng lượng: 1.5 kg", "Xuất xứ: Pháp / VN", "Đổi trả: 7 ngày"],
    img: makeProductSvg("Combo Bông Lan", "Bột mì số 8 · Bơ lạt · Khuôn 18cm", "#1e3a8a", "#2563eb"),
    alt: "Hình minh họa Combo Làm Bánh Bông Lan Cơ Bản"
  },
  tart: {
    title: "Combo Làm Bánh Tart Trứng Hồng Kông",
    desc: "Gồm đế tart ngàn lớp làm sẵn, kem sữa Whipping Anchor và công thức nướng chuẩn vị giòn rụm.",
    badge: "Giảm 15%",
    price: "195.000 đ",
    specs: ["Số lượng: 24 đế tart", "Bảo quản: Ngăn đông", "Giao nhanh: 2 giờ"],
    img: makeProductSvg("Combo Tart Trứng", "24 Đế ngàn lớp · Whipping Cream", "#9a3412", "#ea580c"),
    alt: "Hình minh họa Combo Làm Bánh Tart Trứng"
  },
  cookie: {
    title: "Combo Cookie Bơ Hạnh Nhân Giòn Tan",
    desc: "Đầy đủ bột mì, đường bột icing, hạnh nhân lát rang thơm và bơ lạt cao cấp đóng gói tiện lợi.",
    badge: "Mới về",
    price: "219.000 đ",
    specs: ["Thành phẩm: ~45 bánh", "Hạn dùng: 6 tháng", "Tặng túi zip đóng gói"],
    img: makeProductSvg("Combo Cookie Bơ", "Bơ lạt · Hạnh nhân lát · Đường bột", "#065f46", "#059669"),
    alt: "Hình minh họa Combo Cookie Bơ Hạnh Nhân"
  }
};

// Truy xuất phần tử bằng querySelector & querySelectorAll
const themeSwitchBtn = document.querySelector("#themeSwitchBtn");
const productImg = document.querySelector("#productImg");
const productBadge = document.querySelector("#productBadge");
const productTitle = document.querySelector("#productTitle");
const productDesc = document.querySelector("#productDesc");
const productPrice = document.querySelector("#productPrice");
const specChips = document.querySelectorAll(".spec-chip");
const variantButtons = document.querySelectorAll(".variant-btn");
const customTitleInput = document.querySelector("#customTitleInput");
const applyTitleBtn = document.querySelector("#applyTitleBtn");
const highlightChipsBtn = document.querySelector("#highlightChipsBtn");
const resetChipsBtn = document.querySelector("#resetChipsBtn");
const domLog = document.querySelector("#domLog");

function updateLog(message) {
  domLog.textContent = `Trạng thái DOM: ${message}`;
}

function applyVariant(key) {
  const data = variants[key];
  if (!data) return;

  productImg.setAttribute("src", data.img);
  productImg.setAttribute("alt", data.alt);
  productTitle.textContent = data.title;
  productDesc.textContent = data.desc;
  productBadge.textContent = data.badge;
  productPrice.textContent = data.price;

  specChips.forEach((chip, idx) => {
    chip.textContent = data.specs[idx] || "";
  });

  variantButtons.forEach((btn) => {
    const active = btn.dataset.variant === key;
    btn.classList.toggle("btn--primary", active);
    btn.classList.toggle("btn--outline", !active);
  });

  updateLog(`Đã cập nhật DOM cho mẫu "${data.title}" (src, alt, textContent và ${specChips.length} spec-chip).`);
}

themeSwitchBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("theme-dark");
  themeSwitchBtn.textContent = isDark ? "☀️ Chuyển giao diện Sáng" : "🌙 Chuyển giao diện Tối";
  updateLog(`Đã chuyển Theme sang chế độ ${isDark ? "Tối (theme-dark)" : "Sáng (mặc định)"}.`);
});

variantButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyVariant(btn.dataset.variant));
});

applyTitleBtn.addEventListener("click", () => {
  const nextTitle = customTitleInput.value.trim();
  if (!nextTitle) {
    updateLog("Vui lòng nhập tiêu đề mới trước khi áp dụng.");
    return;
  }
  productTitle.textContent = nextTitle;
  updateLog(`Đã thay đổi #productTitle.textContent thành "${nextTitle}".`);
});

highlightChipsBtn.addEventListener("click", () => {
  specChips.forEach((chip) => chip.classList.add("is-highlighted"));
  updateLog(`querySelectorAll('.spec-chip') đã thêm class .is-highlighted cho ${specChips.length} phần tử.`);
});

resetChipsBtn.addEventListener("click", () => {
  specChips.forEach((chip) => chip.classList.remove("is-highlighted"));
  updateLog(`Đã xóa class .is-highlighted khỏi ${specChips.length} phần tử.`);
});

applyVariant("cake");
