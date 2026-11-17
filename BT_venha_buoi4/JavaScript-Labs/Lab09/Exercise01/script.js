const variants = {
  anc: {
    title: "Tai Nghe Bluetooth Chống Ồn Chủ Động ANC",
    desc: "Thời lượng pin lên đến 40 giờ, kết nối Bluetooth 5.3 ổn định và bảo hành chính hãng 12 tháng tại UEHMart.",
    badge: "Giảm 28%",
    price: "1.290.000 đ",
    specs: ["Pin: 40 giờ", "Bảo hành: 12 tháng", "Đổi trả: 7 ngày"],
    img: "../../images/products/product-demo.jpg",
    alt: "Tai nghe Bluetooth Chống Ồn Chủ Động ANC"
  },
  keyboard: {
    title: "Bàn Phím Cơ Không Dây 3 Mode Hotswap RGB",
    desc: "Hỗ trợ 3 chế độ kết nối Bluetooth / Wireless 2.4GHz / Type-C, switch gõ êm cho sinh viên và văn phòng.",
    badge: "Giảm 35%",
    price: "845.000 đ",
    specs: ["Kết nối: 3 Mode", "Tính năng: Hotswap", "Đèn nền: LED RGB"],
    img: "../../images/products/Phimgo.jpg",
    alt: "Bàn Phím Cơ Không Dây 3 Mode RGB"
  },
  book: {
    title: "Sách: Nền Tảng Phát Triển Ứng Dụng Web & TMĐT",
    desc: "Tài liệu tham khảo chuẩn hóa cho sinh viên chuyên ngành Kỹ thuật Phần mềm & Thương mại Điện tử UEH.",
    badge: "Giảm 20%",
    price: "196.000 đ",
    specs: ["Tình trạng: Sách mới", "Đã bán: 1.2k+", "Đánh giá: ★ 5.0"],
    img: "../../images/products/docsach.jpg",
    alt: "Sách Nền Tảng Phát Triển Ứng Dụng Web & TMĐT"
  },
  mouse: {
    title: "Chuột Không Dây Công Thái Học Click Êm Silent",
    desc: "Thiết kế ôm tay giảm mỏi cổ tay khi code lâu, nút bấm không gây tiếng ồn và sạc nhanh qua cổng Type-C.",
    badge: "Giảm 40%",
    price: "299.000 đ",
    specs: ["Cổng sạc: Type-C", "Công tắc: Silent", "Bảo hành: 12 tháng"],
    img: "../../images/products/chuot.jpg",
    alt: "Chuột Không Dây Công Thái Học Silent"
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

  updateLog(`Đã cập nhật DOM cho sản phẩm "${data.title}" (src, alt, textContent và ${specChips.length} spec-chip).`);
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

applyVariant("anc");
