const discountForm = document.getElementById("discountForm");
const orderSubtotalEl = document.getElementById("orderSubtotal");
const memberTierEl = document.getElementById("memberTier");
const couponCodeEl = document.getElementById("couponCode");
const installmentMonthsEl = document.getElementById("installmentMonths");
const summaryBox = document.getElementById("summaryBox");
const tierProgressBox = document.getElementById("tierProgressBox");
const scheduleBody = document.getElementById("scheduleBody");

function formatVND(amount) {
  return `${Math.round(amount).toLocaleString("vi-VN")} đ`;
}

function getTierConfig(tier) {
  // Cấu trúc điều khiển switch
  switch (tier) {
    case "diamond":
      return { label: "Kim cương (Diamond)", rate: 0.15 };
    case "gold":
      return { label: "Vàng (Gold)", rate: 0.10 };
    case "silver":
      return { label: "Bạc (Silver)", rate: 0.05 };
    case "bronze":
    default:
      return { label: "Đồng (Bronze)", rate: 0.02 };
  }
}

function calculateOrder() {
  const subtotal = Math.max(0, Number(orderSubtotalEl.value) || 0);
  const tier = memberTierEl.value;
  const coupon = couponCodeEl.value;
  const months = Math.min(12, Math.max(1, parseInt(installmentMonthsEl.value, 10) || 1));

  const tierInfo = getTierConfig(tier);
  const memberDiscount = subtotal * tierInfo.rate;

  // Cấu trúc điều khiển if / else if / else tính phí ship & mã giảm giá
  let shippingFee = 30000;
  if (subtotal >= 1000000 || coupon === "FREESHIP") {
    shippingFee = 0;
  } else if (subtotal >= 500000) {
    shippingFee = 15000;
  }

  let couponDiscount = 0;
  let couponNote = "Không áp dụng";
  if (coupon === "UEH50K") {
    if (subtotal >= 500000) {
      couponDiscount = 50000;
      couponNote = "Giảm trực tiếp 50.000đ";
    } else {
      couponNote = "Chưa đạt tối thiểu 500.000đ";
    }
  } else if (coupon === "FREESHIP") {
    couponNote = "Miễn phí vận chuyển";
  }

  const finalTotal = Math.max(0, subtotal - memberDiscount - couponDiscount + shippingFee);
  const rewardPoints = Math.floor(finalTotal / 10000);

  // Vòng lặp while tính số đơn tương tự cần thiết để tích lũy 500 điểm thưởng
  let accumulatedPoints = rewardPoints;
  let extraOrdersNeeded = 0;
  while (accumulatedPoints < 500 && extraOrdersNeeded < 100) {
    accumulatedPoints += Math.max(1, rewardPoints);
    extraOrdersNeeded++;
  }

  summaryBox.innerHTML = `
    <div class="summary-row"><span>Tạm tính đơn hàng:</span><strong>${formatVND(subtotal)}</strong></div>
    <div class="summary-row"><span>Hạng ${tierInfo.label} (${tierInfo.rate * 100}%):</span><strong>-${formatVND(memberDiscount)}</strong></div>
    <div class="summary-row"><span>Mã giảm giá (${coupon}):</span><strong>-${formatVND(couponDiscount)} (${couponNote})</strong></div>
    <div class="summary-row"><span>Phí vận chuyển:</span><strong>${shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</strong></div>
    <div class="summary-row summary-total"><span>Thành tiền thanh toán:</span><span>${formatVND(finalTotal)}</span></div>
  `;

  tierProgressBox.innerHTML = `
    Đơn hàng này tích lũy được <strong>${rewardPoints} điểm thưởng</strong>.
    ${rewardPoints >= 500
      ? "Bạn đã đạt mốc 500 điểm ưu đãi đặc biệt ngay trong đơn này!"
      : `Dùng vòng lặp <code>while</code>: cần thêm khoảng <strong>${extraOrdersNeeded} đơn tương tự</strong> để chạm mốc 500 điểm.`}
  `;

  // Vòng lặp for tạo bảng phân kỳ thanh toán
  const perMonth = finalTotal / months;
  let remaining = finalTotal;
  let rowsHtml = "";

  for (let i = 1; i <= months; i++) {
    const payment = i === months ? remaining : perMonth;
    remaining = Math.max(0, remaining - payment);
    rowsHtml += `
      <tr>
        <td>Kỳ ${i}/${months}</td>
        <td>${formatVND(payment)}</td>
        <td>${formatVND(remaining)}</td>
      </tr>
    `;
  }
  scheduleBody.innerHTML = rowsHtml;

  console.log("[Lab08 Ex02] Kết quả tính chiết khấu:", {
    subtotal,
    tier: tierInfo.label,
    memberDiscount,
    couponDiscount,
    shippingFee,
    finalTotal,
    rewardPoints
  });
}

discountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  calculateOrder();
});

[orderSubtotalEl, memberTierEl, couponCodeEl, installmentMonthsEl].forEach((el) => {
  el.addEventListener("change", calculateOrder);
});

calculateOrder();
