function escapeXml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeGallerySvg(label, detail, c1, c2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect width="600" height="340" fill="url(#g)"/>
    <rect x="40" y="40" width="520" height="260" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    <text x="50%" y="48%" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#fff">${escapeXml(label)}</text>
    <text x="50%" y="62%" text-anchor="middle" font-family="system-ui, sans-serif" font-size="17" fill="rgba(255,255,255,0.9)">${escapeXml(detail)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const galleryItems = [
  {
    id: 0,
    caption: "Góc chính diện — Máy đánh trứng 7 tốc độ màu Trắng Ngọc",
    src: makeGallerySvg("Góc chính diện", "Thiết kế gọn nhẹ · 7 cấp tốc độ", "#1e3a8a", "#3b82f6")
  },
  {
    id: 1,
    caption: "Bộ phụ kiện — 2 que đánh kem & 2 que nhào bột inox 304",
    src: makeGallerySvg("Phụ kiện Inox 304", "4 que trộn chuyên dụng đi kèm", "#0f766e", "#14b8a6")
  },
  {
    id: 2,
    caption: "Chi tiết nút gạt — Điều chỉnh công suất 180W êm ái",
    src: makeGallerySvg("Động cơ 180W", "Nút gạt 7 mức · Thoát nhiệt kép", "#7c2d12", "#ea580c")
  },
  {
    id: 3,
    caption: "Đóng gói hộp quà — Bảo hành chính hãng 12 tháng",
    src: makeGallerySvg("Hộp & Bảo hành", "Tem chính hãng · Đổi mới 30 ngày", "#4c1d95", "#8b5cf6")
  }
];

const mainGalleryImg = document.getElementById("mainGalleryImg");
const previewCaption = document.getElementById("previewCaption");
const thumbRow = document.getElementById("thumbRow");
const hoverStatus = document.getElementById("hoverStatus");
const btnMinus = document.getElementById("btnMinus");
const btnPlus = document.getElementById("btnPlus");
const qtyInput = document.getElementById("qtyInput");
const totalPriceLabel = document.getElementById("totalPriceLabel");
const orderNote = document.getElementById("orderNote");
const noteCount = document.getElementById("noteCount");
const eventLogList = document.getElementById("eventLogList");
const clearEventLog = document.getElementById("clearEventLog");

const UNIT_PRICE = 320000;
let lockedIndex = 0;

function logEvent(eventName, detail) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString("vi-VN");
  li.textContent = `[${time}] (${eventName}) ${detail}`;
  eventLogList.prepend(li);
  while (eventLogList.children.length > 25) {
    eventLogList.lastElementChild.remove();
  }
}

function showImage(index, isTemporary = false) {
  const item = galleryItems[index];
  if (!item) return;
  mainGalleryImg.src = item.src;
  mainGalleryImg.alt = item.caption;
  previewCaption.textContent = isTemporary ? `[Xem trước] ${item.caption}` : item.caption;
}

function renderThumbnails() {
  galleryItems.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `thumb-btn ${idx === lockedIndex ? "is-active" : ""}`;
    btn.setAttribute("aria-label", item.caption);

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption;
    btn.appendChild(img);

    btn.addEventListener("mouseover", () => {
      showImage(idx, true);
      hoverStatus.textContent = `Đang xem trước ảnh #${idx + 1} (mouseover).`;
      logEvent("mouseover", `Xem trước ảnh #${idx + 1}`);
    });

    btn.addEventListener("mouseout", () => {
      showImage(lockedIndex, false);
      hoverStatus.textContent = `Đã quay về ảnh đã chọn #${lockedIndex + 1} (mouseout).`;
      logEvent("mouseout", `Trả lại ảnh cố định #${lockedIndex + 1}`);
    });

    btn.addEventListener("click", () => {
      lockedIndex = idx;
      document.querySelectorAll(".thumb-btn").forEach((b, bIdx) => {
        b.classList.toggle("is-active", bIdx === lockedIndex);
      });
      showImage(lockedIndex, false);
      hoverStatus.textContent = `Đã khóa ảnh #${idx + 1} (click).`;
      logEvent("click", `Chọn cố định ảnh #${idx + 1}`);
    });

    thumbRow.appendChild(btn);
  });
}

function updateQuantity(nextQty) {
  const clamped = Math.max(1, Math.min(99, nextQty));
  qtyInput.value = String(clamped);
  totalPriceLabel.textContent = `${(clamped * UNIT_PRICE).toLocaleString("vi-VN")} đ`;
}

btnMinus.addEventListener("click", () => {
  const current = parseInt(qtyInput.value, 10) || 1;
  updateQuantity(current - 1);
  logEvent("click", `Giảm số lượng xuống ${qtyInput.value}`);
});

btnPlus.addEventListener("click", () => {
  const current = parseInt(qtyInput.value, 10) || 1;
  updateQuantity(current + 1);
  logEvent("click", `Tăng số lượng lên ${qtyInput.value}`);
});

qtyInput.addEventListener("keyup", () => {
  const digits = qtyInput.value.replace(/\D/g, "");
  const parsed = parseInt(digits, 10);
  if (!Number.isNaN(parsed) && parsed > 0) {
    updateQuantity(parsed);
    logEvent("keyup", `Nhập số lượng trực tiếp: ${qtyInput.value}`);
  } else {
    totalPriceLabel.textContent = `${UNIT_PRICE.toLocaleString("vi-VN")} đ`;
  }
});

qtyInput.addEventListener("blur", () => {
  const parsed = parseInt(qtyInput.value, 10);
  updateQuantity(Number.isNaN(parsed) || parsed < 1 ? 1 : parsed);
});

orderNote.addEventListener("keyup", () => {
  const len = orderNote.value.length;
  noteCount.textContent = `${len} / 80 ký tự`;
  logEvent("keyup", `Ghi chú đơn hàng (${len} ký tự)`);
});

clearEventLog.addEventListener("click", () => {
  eventLogList.innerHTML = "";
});

renderThumbnails();
showImage(0, false);
updateQuantity(1);
logEvent("init", "Khởi tạo thư viện ảnh và bộ đếm số lượng.");
