const galleryItems = [
  {
    id: 0,
    caption: "Tai nghe Bluetooth Chống Ồn Chủ Động ANC — Pin 40 giờ (1.290.000₫)",
    src: "../../images/products/product-demo.jpg"
  },
  {
    id: 1,
    caption: "Bàn phím cơ Không dây 3 Mode Hotswap LED RGB (845.000₫)",
    src: "../../images/products/Phimgo.jpg"
  },
  {
    id: 2,
    caption: "Sách Nền tảng Phát triển Ứng dụng Web & TMĐT (196.000₫)",
    src: "../../images/products/docsach.jpg"
  },
  {
    id: 3,
    caption: "Chuột không dây Công thái học Silent Type-C (299.000₫)",
    src: "../../images/products/chuot.jpg"
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

const UNIT_PRICE = 1290000;
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
