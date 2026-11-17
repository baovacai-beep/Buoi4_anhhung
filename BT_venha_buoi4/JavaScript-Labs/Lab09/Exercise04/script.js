const registerForm = document.getElementById("registerForm");
const fullNameEl = document.getElementById("fullName");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const passwordEl = document.getElementById("password");
const confirmPasswordEl = document.getElementById("confirmPassword");
const togglePwBtn = document.getElementById("togglePwBtn");
const strengthFill = document.getElementById("strengthFill");
const formSummary = document.getElementById("formSummary");
const resetFormBtn = document.getElementById("resetFormBtn");

const validators = {
  name(value) {
    const cleaned = value.trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!cleaned) return { ok: false, msg: "Vui lòng nhập họ và tên." };
    if (!nameRegex.test(cleaned) || words.length < 2) {
      return { ok: false, msg: "Họ tên cần ít nhất 2 từ và không chứa số/ký tự đặc biệt." };
    }
    return { ok: true, msg: "Họ tên hợp lệ." };
  },

  email(value) {
    const cleaned = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!cleaned) return { ok: false, msg: "Vui lòng nhập địa chỉ email." };
    if (!emailRegex.test(cleaned)) {
      return { ok: false, msg: "Email chưa đúng định dạng (VD: user@domain.com)." };
    }
    return { ok: true, msg: "Email hợp lệ." };
  },

  phone(value) {
    const cleaned = value.trim();
    const vnPhoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    if (!cleaned) return { ok: false, msg: "Vui lòng nhập số điện thoại." };
    if (!vnPhoneRegex.test(cleaned)) {
      return { ok: false, msg: "SĐT Việt Nam phải gồm 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09." };
    }
    return { ok: true, msg: "Số điện thoại hợp lệ." };
  },

  password(value) {
    if (!value) return { ok: false, msg: "Vui lòng nhập mật khẩu." };
    if (value.length < 8) {
      return { ok: false, msg: `Mật khẩu phải có ít nhất 8 ký tự (hiện tại ${value.length}/8).` };
    }
    return { ok: true, msg: "Độ dài mật khẩu đạt yêu cầu." };
  },

  confirm(value) {
    if (!value) return { ok: false, msg: "Vui lòng xác nhận mật khẩu." };
    if (value !== passwordEl.value) {
      return { ok: false, msg: "Mật khẩu xác nhận không khớp." };
    }
    return { ok: true, msg: "Mật khẩu xác nhận khớp." };
  }
};

function setFieldState(inputEl, msgEl, ruleKey, result) {
  const group = inputEl.closest(".field-group");
  group.classList.toggle("is-valid", result.ok);
  group.classList.toggle("is-invalid", !result.ok);
  msgEl.textContent = result.msg;

  const ruleLi = document.querySelector(`#rulesChecklist li[data-rule="${ruleKey}"]`);
  if (ruleLi) {
    ruleLi.classList.toggle("is-pass", result.ok);
  }
  return result.ok;
}

function updatePasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const widths = ["0%", "25%", "50%", "75%", "100%"];
  const colors = ["#dc2626", "#dc2626", "#f59e0b", "#0284c7", "#16a34a"];
  strengthFill.style.width = widths[score];
  strengthFill.style.backgroundColor = colors[score];
}

function validateField(key) {
  if (key === "name") {
    return setFieldState(fullNameEl, document.getElementById("fullNameMsg"), "name", validators.name(fullNameEl.value));
  }
  if (key === "email") {
    return setFieldState(emailEl, document.getElementById("emailMsg"), "email", validators.email(emailEl.value));
  }
  if (key === "phone") {
    return setFieldState(phoneEl, document.getElementById("phoneMsg"), "phone", validators.phone(phoneEl.value));
  }
  if (key === "password") {
    updatePasswordStrength(passwordEl.value);
    const ok = setFieldState(passwordEl, document.getElementById("passwordMsg"), "password", validators.password(passwordEl.value));
    if (confirmPasswordEl.value) {
      validateField("confirm");
    }
    return ok;
  }
  if (key === "confirm") {
    return setFieldState(confirmPasswordEl, document.getElementById("confirmPasswordMsg"), "confirm", validators.confirm(confirmPasswordEl.value));
  }
  return false;
}

fullNameEl.addEventListener("input", () => validateField("name"));
emailEl.addEventListener("input", () => validateField("email"));
phoneEl.addEventListener("input", () => {
  phoneEl.value = phoneEl.value.replace(/\D/g, "");
  validateField("phone");
});
passwordEl.addEventListener("input", () => validateField("password"));
confirmPasswordEl.addEventListener("input", () => validateField("confirm"));

togglePwBtn.addEventListener("click", () => {
  const isHidden = passwordEl.type === "password";
  passwordEl.type = isHidden ? "text" : "password";
  confirmPasswordEl.type = isHidden ? "text" : "password";
  togglePwBtn.textContent = isHidden ? "Ẩn" : "Hiện";
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const checks = [
    validateField("name"),
    validateField("email"),
    validateField("phone"),
    validateField("password"),
    validateField("confirm")
  ];

  const allValid = checks.every(Boolean);
  formSummary.className = `summary-card ${allValid ? "is-success" : "is-error"}`;

  if (!allValid) {
    formSummary.innerHTML = `
      <strong>Đăng ký chưa hợp lệ!</strong>
      <p>Vui lòng kiểm tra lại các trường đang báo đỏ ở bên trái trước khi gửi biểu mẫu.</p>
    `;
    return;
  }

  formSummary.innerHTML = `
    <strong>✓ Đăng ký thành công!</strong>
    <p>Họ tên: <strong>${fullNameEl.value.trim()}</strong></p>
    <p>Email: <strong>${emailEl.value.trim()}</strong></p>
    <p>SĐT: <strong>${phoneEl.value.trim()}</strong></p>
  `;
});

resetFormBtn.addEventListener("click", () => {
  document.querySelectorAll(".field-group").forEach((g) => g.classList.remove("is-valid", "is-invalid"));
  document.querySelectorAll(".msg").forEach((m) => (m.textContent = ""));
  document.querySelectorAll("#rulesChecklist li").forEach((li) => li.classList.remove("is-pass"));
  strengthFill.style.width = "0";
  formSummary.className = "summary-card";
  formSummary.innerHTML = `<p class="muted">Hãy điền các trường bên trái để xem kết quả kiểm tra từng quy tắc theo thời gian thực.</p>`;
});
