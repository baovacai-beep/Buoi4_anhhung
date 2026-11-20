document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const filterButtons = document.querySelectorAll(".filter-pill");
  const labCards = document.querySelectorAll(".lab-card");
  const backToTopBtn = document.getElementById("backToTop");
  const selfEvalText = document.getElementById("selfEvalText");
  const wordCountDisplay = document.getElementById("wordCountDisplay");

  // 1. Khởi tạo chế độ Sáng / Tối từ localStorage
  const savedTheme = localStorage.getItem("css_adv_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️ Giao diện Sáng";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("css_adv_theme", isDark ? "dark" : "light");
      themeToggle.textContent = isDark ? "☀️ Giao diện Sáng" : "🌙 Giao diện Tối";
    });
  }

  // 2. Bộ lọc nhanh thẻ nhóm Exercise
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      labCards.forEach((card) => {
        const cardKey = card.dataset.group || card.dataset.lab;
        if (target === "all" || cardKey === target) {
          card.classList.remove("is-dimmed");
        } else {
          card.classList.add("is-dimmed");
        }
      });
    });
  });

  // 3. Tự động đếm số từ của đoạn Tự đánh giá
  if (selfEvalText && wordCountDisplay) {
    const words = selfEvalText.textContent.trim().split(/\s+/).filter(Boolean);
    wordCountDisplay.textContent = `Độ dài đoạn tự đánh giá: ${words.length} từ (chuẩn 120–145 từ)`;
  }

  // 4. Nút cuộn về đầu trang
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 280) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
