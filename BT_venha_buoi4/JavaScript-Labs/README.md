# Thực hành Chương 4: JavaScript & jQuery (Lab 08 – Lab 09 – Lab 10)

## 1. Thông tin sinh viên
- **Họ và tên:** Hồ Gia Bảo
- **Mã số sinh viên:** 31241023360
- **Trường / Khóa / Ngành:** Đại học Kinh tế TP. Hồ Chí Minh (UEH) — Khóa 50 · Kỹ thuật Phần mềm (`BIT-UEH`)
- **Lớp học phần:** Phát triển ứng dụng Thương mại Điện tử (`26C1INF50902702`)
- **Giảng viên hướng dẫn:** TS. Nguyễn Mạnh Tuấn (`tuannm@ueh.edu.vn`)
- **Email sinh viên:** `bao.hogia@ueh.edu.vn`
- **GitHub cá nhân:** [https://github.com/baovacai-beep](https://github.com/baovacai-beep)

## 2. Mục tiêu thực hiện & Liên kết tiến trình học phần
Hoàn thiện trọn vẹn 03 bài thực hành JavaScript nhằm nắm vững cú pháp ngôn ngữ JavaScript nền tảng, kỹ thuật truy xuất và thao tác cây DOM, xử lý sự kiện người dùng, kiểm tra dữ liệu Form và ứng dụng thư viện jQuery (Selectors, Events, DOM, Animation và GET Request với `jqXHR`) để nâng cấp mô hình sàn thương mại điện tử sinh viên **UEHMart** (từ Buổi 1) thành giao diện tương tác động.

### Tiến trình các buổi thực hành liên quan
| Buổi | Repository | Nội dung trọng tâm |
| :--- | :--- | :--- |
| Buổi 1 | [ecommerce-ui-improvement](https://github.com/baovacai-beep/ecommerce-ui-improvement) | Cải tiến giao diện Product Card **UEHMart** (HTML5/CSS3 thuần, khảo sát Tiki.vn) |
| Buổi 2 | [TMDT_Buoi2](https://github.com/baovacai-beep/TMDT_Buoi2) | Tài liệu phân tích & mô tả quy trình phát triển ứng dụng TMĐT |
| Buổi 3 | [css-basic-tuan3](https://github.com/baovacai-beep/css-basic-tuan3) | 7 bài tập CSS cơ bản Tuần 3 (Portfolio 3 cột, CSS Float, Accordion) |
| **Buổi 4** | [**Buoi4_anhhung**](https://github.com/baovacai-beep/Buoi4_anhhung) | **Bài tập Chương 4: JavaScript-Labs (Lab 08, Lab 09, Lab 10)** |

## 3. Cấu trúc thư mục
```text
JavaScript-Labs/
├── index.html                  # Trang chủ Portfolio giới thiệu & điều hướng 3 bài Lab
├── README.md                   # Tài liệu mô tả dự án thực hành
├── css/
│   ├── style.css               # Định dạng giao diện Responsive Sakura Pink (Desktop & Mobile)
│   └── sakura-theme.css        # Hiệu ứng hoa Sakura rơi, Ninja Làng Lá chạy & trình phát BGM
├── js/
│   ├── main.js                 # Tương tác trang chủ (Theme toggle, lọc Lab, đếm từ, Back-to-top)
│   └── sakura-theme.js         # Canvas Sakura, SVG Ninja Làng Lá & nhạc nền Web Audio API
├── images/
│   ├── avatar.jpg              # Ảnh đại diện cá nhân sinh viên
│   ├── avatar.svg              # Ảnh vector dự phòng
│   └── products/               # Ảnh sản phẩm UEHMart đồng bộ từ Buổi 1
│       ├── product-demo.jpg
│       ├── Phimgo.jpg
│       ├── docsach.jpg
│       └── chuot.jpg
├── Lab08/                      # JavaScript 1: Language Foundations
│   ├── index.html
│   ├── Exercise01/
│   ├── Exercise02/
│   ├── Exercise03/
│   └── Exercise04/
├── Lab09/                      # JavaScript 2: DOM and Events
│   ├── index.html
│   ├── Exercise01/
│   ├── Exercise02/
│   ├── Exercise03/
│   └── Exercise04/
└── Lab10/                      # JavaScript 3: jQuery
    ├── index.html
    ├── Exercise01/
    ├── Exercise02/
    ├── Exercise03/
    ├── Exercise04/
    └── Exercise05/
```

## 4. Nội dung từng bài Lab
- **Lab 08 – JavaScript 1: Language Foundations:**
  - `Exercise01`: Nhúng JavaScript (Internal & External), xuất dữ liệu sản phẩm UEHMart ra giao diện và kiểm tra biến/bảng dữ liệu qua Browser Console (`console.log`, `console.table`).
  - `Exercise02`: Khai báo biến, toán tử và cấu trúc điều khiển (`if/else`, `switch`, `for`/`while`) qua bài toán tính chiết khấu đơn hàng & xếp hạng thành viên UEHMart.
  - `Exercise03`: Làm việc với `String` (chuẩn hóa họ tên, tạo slug URL `uehmart.vn`, tìm kiếm không dấu) và `Date` (đồng hồ thời gian thực & bộ đếm ngược Flash Sale).
  - `Exercise04`: Thao tác `Array` (`filter`, `map`, `reduce`, `sort`), `Object` và `Function` qua ứng dụng quản lý sản phẩm UEHMart mini.
- **Lab 09 – JavaScript 2: DOM and Events:**
  - `Exercise01`: Truy xuất DOM (`querySelector`, `querySelectorAll`), đổi nội dung/ảnh sản phẩm UEHMart thực tế và chuyển đổi giao diện Sáng/Tối (Theme Switcher).
  - `Exercise02`: Tạo, thêm và xóa phần tử HTML động (`createElement`, `appendChild`, `remove`) qua ứng dụng Danh sách mua sắm thiết bị học tập sinh viên UEH.
  - `Exercise03`: Xử lý sự kiện người dùng (`click`, `mouseover`, `mouseout`, `keyup`) qua thư viện xem trước ảnh sản phẩm UEHMart và bộ đếm số lượng.
  - `Exercise04`: Làm việc với Form và kiểm tra dữ liệu đầu vào thời gian thực (Họ tên, Email, SĐT Việt Nam 10 số, Mật khẩu $\ge 8$ ký tự).
- **Lab 10 – JavaScript 3: jQuery (CDN HTTPS `jquery-3.7.1.min.js`):**
  - `Exercise01`: Cài đặt jQuery và thực hành Selectors (`:even`, `:odd`, `[data-*]`, làm nổi bật dòng bảng kho hàng UEHMart).
  - `Exercise02`: Xử lý sự kiện bằng jQuery (`.on()`, `.click()`, `.hover()`, `.keyup()`) qua thanh tìm kiếm lọc nhanh sản phẩm UEHMart.
  - `Exercise03`: Thao tác DOM bằng jQuery (`.append()`, `.prepend()`, `.addClass()`, `.toggleClass()`, `.remove()`) qua mini giỏ hàng UEHMart tương tác.
  - `Exercise04`: Hiệu ứng & hoạt ảnh bằng jQuery (`.fadeIn()`, `.fadeOut()`, `.slideToggle()`, `.animate()`) qua khối FAQ Accordion UEHMart và thẻ sản phẩm động.
  - `Exercise05`: Thực hiện yêu cầu `$.get()` và xử lý phản hồi qua `jqXHR` (`.done()`, `.fail()`, `.always()`) tải dữ liệu từ API JSON công khai.

## 5. Đường dẫn Repository & GitHub Pages
- **GitHub Repository:** [https://github.com/baovacai-beep/Buoi4_anhhung](https://github.com/baovacai-beep/Buoi4_anhhung)
- **Trang chủ JavaScript Labs:** [https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/](https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/)
- **Lab 08:** [https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab08/](https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab08/)
- **Lab 09:** [https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab09/](https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab09/)
- **Lab 10:** [https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab10/](https://baovacai-beep.github.io/Buoi4_anhhung/BT_venha_buoi4/JavaScript-Labs/Lab10/)

### Hướng dẫn kiểm tra nhanh
1. Mở trang chủ `JavaScript-Labs/index.html` trên trình duyệt hoặc qua liên kết GitHub Pages ở trên.
2. Chọn từng thẻ **Lab 08**, **Lab 09**, **Lab 10** để vào trang danh mục Exercise của từng Lab.
3. Nhấn vào từng Exercise để chạy trực tiếp các chức năng JavaScript, DOM, Events và jQuery; có thể mở **F12 → Console** để quan sát thêm nhật ký kiểm tra ở các bài Lab 08 và Lab 10.
