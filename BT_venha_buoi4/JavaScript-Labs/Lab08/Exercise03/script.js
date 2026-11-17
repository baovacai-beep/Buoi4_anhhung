const liveTimeEl = document.getElementById("liveTime");
const liveDateEl = document.getElementById("liveDate");
const cdDaysEl = document.getElementById("cdDays");
const cdHoursEl = document.getElementById("cdHours");
const cdMinutesEl = document.getElementById("cdMinutes");
const cdSecondsEl = document.getElementById("cdSeconds");
const flashTargetInfoEl = document.getElementById("flashTargetInfo");
const presetButtons = document.querySelectorAll(".preset-btn");

const rawNameInput = document.getElementById("rawNameInput");
const normalizedNameEl = document.getElementById("normalizedName");
const generatedSlugEl = document.getElementById("generatedSlug");
const stringStatsEl = document.getElementById("stringStats");

const keywordInput = document.getElementById("keywordInput");
const searchMetaEl = document.getElementById("searchMeta");
const searchResultListEl = document.getElementById("searchResultList");

const catalogItems = [
  { name: "Tai Nghe Bluetooth Chống Ồn Chủ Động ANC", price: 1290000 },
  { name: "Bàn Phím Cơ Không Dây 3 Mode LED RGB", price: 845000 },
  { name: "Sách Nền Tảng Phát Triển Ứng Dụng Web & TMĐT", price: 196000 },
  { name: "Chuột Không Dây Công Thái Học Silent Type-C", price: 299000 },
  { name: "Giá Đỡ Laptop Hợp Kim Nhôm Gập Gọn", price: 245000 },
  { name: "Đèn Bàn Học Chống Cận LED Cảm Ứng", price: 320000 }
];

// --- 1. ĐỒNG HỒ & ĐẾM NGƯỢC DATE ---
let flashEndTime = Date.now() + 120 * 60 * 1000;

function pad2(num) {
  return String(num).padStart(2, "0");
}

function updateClockAndCountdown() {
  const now = new Date();
  liveTimeEl.textContent = now.toLocaleTimeString("vi-VN", { hour12: false });
  liveDateEl.textContent = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const diffMs = Math.max(0, flashEndTime - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  cdDaysEl.textContent = pad2(days);
  cdHoursEl.textContent = pad2(hours);
  cdMinutesEl.textContent = pad2(minutes);
  cdSecondsEl.textContent = pad2(seconds);
}

function setFlashSaleDuration(minutes) {
  flashEndTime = Date.now() + minutes * 60 * 1000;
  flashTargetInfoEl.textContent = `Mốc kết thúc: ${new Date(flashEndTime).toLocaleString("vi-VN")}`;
  updateClockAndCountdown();
}

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    presetButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    setFlashSaleDuration(Number(btn.dataset.minutes));
  });
});

setFlashSaleDuration(120);
setInterval(updateClockAndCountdown, 1000);

// --- 2. XỬ LÝ CHUỖI (STRING) ---
function removeVietnameseAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function toTitleCase(str) {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toSeoSlug(str) {
  return removeVietnameseAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function updateStringDemo() {
  const raw = rawNameInput.value;
  const cleaned = toTitleCase(raw);
  const slug = toSeoSlug(raw);
  const wordCount = cleaned ? cleaned.split(" ").length : 0;

  normalizedNameEl.textContent = cleaned || "(Trống)";
  generatedSlugEl.textContent = slug ? `https://uehmart.vn/san-pham/${slug}` : "(Chưa có slug)";
  stringStatsEl.textContent = `${cleaned.length} ký tự sau khi rút gọn khoảng trắng · ${wordCount} từ`;
}

rawNameInput.addEventListener("input", updateStringDemo);
updateStringDemo();

// --- 3. TÌM KIẾM TỪ KHÓA KHÔNG DẤU ---
function renderSearchResults() {
  const normalizedQuery = removeVietnameseAccents(keywordInput.value).toLowerCase().trim();
  const matched = catalogItems.filter((item) => {
    const normalizedName = removeVietnameseAccents(item.name).toLowerCase();
    return normalizedName.includes(normalizedQuery);
  });

  searchMetaEl.textContent = `Tìm thấy ${matched.length}/${catalogItems.length} sản phẩm (chuỗi đối chiếu không dấu: "${normalizedQuery || "tất cả"}")`;

  if (matched.length === 0) {
    searchResultListEl.innerHTML = `<li>Không tìm thấy sản phẩm phù hợp với từ khóa "${keywordInput.value}".</li>`;
    return;
  }

  searchResultListEl.innerHTML = matched
    .map(
      (item) => `
      <li>
        <span>${item.name}</span>
        <span class="price-tag">${item.price.toLocaleString("vi-VN")} đ</span>
      </li>
    `
    )
    .join("");
}

keywordInput.addEventListener("input", renderSearchResults);
renderSearchResults();
