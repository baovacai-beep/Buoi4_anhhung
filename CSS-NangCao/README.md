# Thực hành Chương 5 & 6: Advanced CSS – Layout (Lab 07)

## 1. Thông tin sinh viên
- **Họ và tên:** Hồ Gia Bảo
- **Mã số sinh viên:** 31241023360
- **Trường / Khóa / Ngành:** Đại học Kinh tế TP. Hồ Chí Minh (UEH) — Khóa 50 · Kỹ thuật Phần mềm (`BIT-UEH`)
- **Lớp học phần:** Phát triển ứng dụng Thương mại Điện tử (`26C1INF50902702`)
- **Giảng viên hướng dẫn:** TS. Nguyễn Mạnh Tuấn (`tuannm@ueh.edu.vn`)
- **Email sinh viên:** `bao.hogia@ueh.edu.vn`
- **GitHub cá nhân:** [https://github.com/baovacai-beep](https://github.com/baovacai-beep)

## 2. Mục tiêu thực hiện Lab 07
Hoàn thiện trọn vẹn bộ bài thực hành **Lab 07 – Advanced CSS: Layout** (Nhóm 1) nhằm làm chủ các kỹ thuật dàn trang và tương tác bằng CSS nâng cao: từ cơ chế Document Flow, định vị phần tử (`relative`, `absolute`, `z-index`), xử lý `float`/`clear` và lớp phủ `overlay`, thiết kế bố cục đa cột kết hợp Media Queries cho Desktop/Mobile, đến hiệu ứng chuyển động (`transform`, `transition`, `filter`, `@keyframes`) và hệ thống lưới Bootstrap 3. Các kỹ thuật này là nền tảng trực tiếp để nâng cấp giao diện cho website thương mại điện tử **UEHMart** và dự án **BakeMate**.

## 3. Cấu trúc thư mục
```text
CSS-NangCao/
├── index.html                  # Trang chủ Portfolio & điều hướng 5 nhóm Exercise Lab 07
├── README.md                   # Tài liệu mô tả dự án & hướng dẫn kiểm tra
├── css/
│   ├── style.css               # Định dạng giao diện Sakura Pink + Dark Mode (đồng bộ repo)
│   └── sakura-theme.css        # Hiệu ứng hoa Sakura rơi, Ninja Làng Lá & trình phát BGM
├── js/
│   ├── main.js                 # Theme toggle (localStorage: css_adv_theme), lọc nhóm, đếm từ
│   └── sakura-theme.js         # Canvas Sakura, SVG Ninja & nhạc nền Web Audio API
├── images/
│   ├── avatar.jpg              # Ảnh đại diện cá nhân sinh viên
│   └── avatar.svg              # Ảnh vector dự phòng
└── Lab07/                      # Bộ tệp thực hành Lab 07
    ├── index.html              # Trang danh mục nhanh các bài Exercise 7.1–7.19
    ├── lab07-exercise01.html ... lab07-exercise12.html
    ├── lab07-exercise14.html ... lab07-exercise19.html
    ├── lab07-exercise01.css ... lab07-exercise18.css
    ├── lab07-exercise12-desktop.css & lab07-exercise12-mobile.css
    ├── bootstrap/              # Thư viện Bootstrap 3 đi kèm Lab 07
    └── images/                 # Tài nguyên hình ảnh thực hành
```

## 4. Nội dung 5 nhóm Exercise trong Lab 07
1. **Nhóm 1 (7.1 – 7.4) — Document Flow, Display, Positioning & Z-Index:**
   - `lab07-exercise01.html` → `lab07-exercise04.html`: Thực hành luồng tài liệu mặc định, thay đổi kiểu hiển thị `display`, định vị `relative` / `absolute` và điều chỉnh thứ tự chồng lớp `z-index`.
2. **Nhóm 2 (7.5 – 7.9) — Float, Clear & Overlay Positioning:**
   - `lab07-exercise05.html` → `lab07-exercise09.html`: Căn chỉnh khối bằng `float`, khắc phục tràn khung với `clear` và định vị nhãn/chú thích chồng lớp (overlay) lên hình ảnh.
3. **Nhóm 3 (7.10 – 7.13) — Multi-column Layout, Media Queries & Viewport:**
   - `lab07-exercise10.html` → `lab07-exercise12.html`: Dựng bố cục 2–3 cột bằng CSS, tách `desktop.css` và `mobile.css` qua `@media`.
   - *Lưu ý Exercise 7.13:* Bộ tài liệu thực hành không tách riêng `lab07-exercise13.html`; nội dung Exercise 7.13 (bổ sung `<meta name="viewport">` và tối ưu thanh điều hướng Mobile) được thực hiện trực tiếp trên bộ file của **Exercise 7.12**.
4. **Nhóm 4 (7.14 – 7.18) — CSS Transforms, Transitions, Filters & Animations:**
   - `lab07-exercise14.html` → `lab07-exercise18.html`: Tạo biến đổi hình học 2D, hiệu ứng chuyển trạng thái mượt, bộ lọc hình ảnh và hoạt ảnh nhiều bước với `@keyframes`.
5. **Nhóm 5 (7.19) — Bootstrap Grid System & Components:**
   - `lab07-exercise19.html`: Ứng dụng lưới 12 cột và các thành phần giao diện chuẩn của Bootstrap 3 để dựng trang responsive nhanh gọn.

## 5. Đường dẫn Repository & GitHub Pages
- **GitHub Repository:** [https://github.com/baovacai-beep/Buoi4_anhhung](https://github.com/baovacai-beep/Buoi4_anhhung)
- **Trang chủ CSS Nâng Cao (Portfolio Lab 07):** [https://baovacai-beep.github.io/Buoi4_anhhung/CSS-NangCao/](https://baovacai-beep.github.io/Buoi4_anhhung/CSS-NangCao/)
- **Thư mục Lab 07:** [https://baovacai-beep.github.io/Buoi4_anhhung/CSS-NangCao/Lab07/](https://baovacai-beep.github.io/Buoi4_anhhung/CSS-NangCao/Lab07/)

## 6. Hướng dẫn kiểm tra nhanh
1. Mở trực tiếp `CSS-NangCao/index.html` trên trình duyệt hoặc truy cập liên kết GitHub Pages ở mục 5.
2. Kiểm tra đầy đủ 5 phần nội dung trên trang chủ: Thông tin sinh viên, Mục tiêu thực hiện, Danh sách liên kết 5 nhóm Exercise, Kiến thức & kỹ năng đã học, và Tự đánh giá (có bộ đếm từ tự động và nút chuyển giao diện Sáng/Tối).
3. Sử dụng bộ lọc nhóm hoặc nhấn vào từng liên kết `Exercise 7.1` – `7.19` để mở các bài thực hành trong `Lab07/`.
4. Với **Exercise 7.12 & 7.13** và **Exercise 7.19**, có thể bật **F12 → Toggle Device Toolbar** để kiểm tra khả năng co giãn responsive giữa giao diện Desktop và Mobile.
