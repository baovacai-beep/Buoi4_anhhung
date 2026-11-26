# Website Thương mại Điện tử ASP.NET Core MVC (.NET 10)

- **Sinh viên thực hiện:** Hồ Gia Bảo
- **MSSV:** 31241023360
- **Môn học:** Phát triển ứng dụng Web / Phát triển ứng dụng TMĐT (UEH)
- **Website triển khai (Somee):** http://mvcmoviegiabao2609.somee.com

## 1. Mục tiêu website
Xây dựng ứng dụng web bán hàng trực tuyến hoàn chỉnh bằng ASP.NET Core MVC (.NET 10) trên Visual Studio Code, kết nối SQL Server từ xa (Somee.com), hỗ trợ quản lý danh mục sản phẩm/thể loại, upload hình ảnh, giỏ hàng dùng Session, đặt hàng (Checkout) lưu vào CSDL và gửi email xác nhận qua Gmail SMTP.

## 2. Công nghệ sử dụng
- **Framework:** ASP.NET Core MVC (.NET 10.0 LTS)
- **ORM & CSDL:** Entity Framework Core 10, Microsoft SQL Server (Somee.com), SSMS 22
- **Authentication:** ASP.NET Core Identity
- **Frontend:** Razor Views, Bootstrap 5
- **Khác:** Session (`Microsoft.AspNetCore.Mvc.NewtonsoftJson`), Gmail SMTP (`System.Net.Mail` + App Password)

## 3. Chức năng chính
- Đăng ký / Đăng nhập / Quản lý tài khoản (Identity).
- Quản lý thể loại (`GenresController`): Thêm, Xem, Sửa, Xóa.
- Quản lý sản phẩm (`MoviesController`): Thêm, Xem, Sửa, Xóa; Custom Validation (`CheckDateGreaterThanTodayAttribute`, `GenreAttribute`).
- Upload và cập nhật hình ảnh sản phẩm vào `wwwroot/images` (có ảnh mặc định `no-image.jpg`, giữ nguyên ảnh cũ khi Edit không tải ảnh mới).
- Giao diện lưới sản phẩm responsive kèm giỏ hàng (Session) cộng dồn số lượng, xóa sản phẩm, tính tổng tiền và hiển thị tóm tắt trên thanh menu.
- Thanh toán (`Checkout`): kiểm tra giỏ hàng, lưu `HoaDon`, `ChiTietHoaDon`, `ShippingDetail` vào SQL Server và gửi email xác nhận đơn hàng.

## 4. Cấu trúc thư mục
```text
ASP-CORE/
├── README.md
├── SourceCode/                     # Mã nguồn ASP.NET Core MVC (31241023360_HoGiaBao)
│   ├── Controllers/                # MoviesController, GenresController, HomeController
│   ├── Data/                       # ApplicationDbContext, Migrations
│   ├── Extension/                  # SessionExtensions, EmailServiceNew
│   ├── Models/                     # Movie, Genre, HoaDon, ChiTietHoaDon, ShippingDetail
│   ├── Validation/                 # CheckDateGreaterThanTodayAttribute, GenreAttribute
│   ├── Views/                      # Giao diện Razor Views
│   ├── wwwroot/images/             # Ảnh sản phẩm & no-image.jpg
│   ├── appsettings.example.json    # File cấu hình mẫu (đã ẩn thông tin nhạy cảm)
│   └── Program.cs
├── Report/
│   └── BaiTap_CaNhan_ASP_CORE_LMS.docx
└── images/                         # Ảnh minh chứng
```

## 5. Cấu hình cơ sở dữ liệu & Email
1. Sao chép `appsettings.example.json` thành `appsettings.json` trong thư mục dự án.
2. Điền chuỗi kết nối SQL Server của bạn vào `ConnectionStrings:DefaultConnection` (giữ `;TrustServerCertificate=True` ở cuối).
3. Điền địa chỉ Gmail và App Password 16 ký tự (tạo tại Google Account → App Passwords) vào mục `Email`.
4. **Lưu ý bảo mật:** Không commit `appsettings.json` chứa mật khẩu thật lên GitHub.

## 6. Khôi phục package & chạy ứng dụng
```bash
cd SourceCode
dotnet restore
dotnet ef database update
dotnet run --launch-profile https
```
Mở trình duyệt tại địa chỉ `https://localhost:<port>` hiển thị ở dòng `Now listening on:`.
