# 🍓 Dâu Cute TODO — Ứng dụng Quản Lý Công Việc Full-Stack (Node.js + SQLite)

Bài tập thực tiễn BackEnd — Môn Phát triển ứng dụng TMĐT (UEH - BIT).

## 1. Cách chạy ứng dụng
Yêu cầu: **Node.js** (đã tích hợp sẵn `node:sqlite`, không cần `npm install`).

```bash
cd Bai4_StrawberryTodo
node server.js
```

Sau đó mở trình duyệt truy cập: **http://localhost:3000**

## 2. Đáp ứng đầy đủ tiêu chí chấm điểm
1. **Phát triển ứng dụng thực tiễn (4đ)**:
   - **Quản lý thông tin (Thêm, Sửa, Xóa)**: Thêm nhanh (Quick Add), Thêm chi tiết & Chỉnh sửa qua Modal (Tên, Mô tả, Sticker, Danh mục, Mức ưu tiên, Hạn hoàn thành), Xóa từng việc hoặc Dọn sạch việc đã hoàn thành, Tìm kiếm & Lọc theo Trạng thái / Danh mục / Ưu tiên / Sắp xếp.
   - **Cập nhật trạng thái**: 3 trạng thái `Chưa làm` (`todo`), `Đang làm` (`in_progress`), `Hoàn thành` (`done`), hỗ trợ đổi nhanh trực tiếp trên từng thẻ công việc hoặc checkbox.
   - **Thống kê**: Thống kê tổng quan (Tổng, Chưa làm, Đang làm, Hoàn thành, Quá hạn, Đến hạn hôm nay), thanh tiến độ `%`, biểu đồ tròn (Donut Chart) theo trạng thái, phân bố theo danh mục & ưu tiên, và nhật ký hoạt động lưu từ database.
2. **Giao diện & Thiết kế (2đ)**:
   - Giao diện chủ đề **Hồng Dâu Pastel Cute**, kính mờ Glassmorphism, nhân vật Mascot Bé Dâu tương tác.
   - Hiệu ứng hoa anh đào & dâu rơi, sparkle khi click, confetti dâu khi hoàn thành công việc.
   - Hệ thống âm thanh tổng hợp bằng **Web Audio API**: hiệu ứng âm thanh cute (SFX) + nhạc nền **Lo-fi Strawberry Chill** có thể bật/tắt và chỉnh âm lượng.
3. **Database (1đ)**:
   - Cơ sở dữ liệu **SQLite** (`strawberry_todo.db`) với file cấu trúc `schema.sql` gồm 2 bảng: `todos` và `activity_logs`, tự động khởi tạo và seed dữ liệu mẫu tiếng Việt khi chạy lần đầu.
4. **Hệ thống hoàn chỉnh (1đ)**:
   - Node.js HTTP server (`server.js`) phục vụ đồng thời REST API (`/api/...`) và giao diện Frontend (`public/`).

## 3. Danh sách REST API Endpoints
- `GET /api/health` — Kiểm tra trạng thái server & database
- `GET /api/todos` — Lấy danh sách công việc (hỗ trợ `?status=`, `?category=`, `?priority=`, `?search=`, `?sort=`)
- `GET /api/todos/:id` — Lấy chi tiết 1 công việc
- `POST /api/todos` — Thêm công việc mới
- `PUT /api/todos/:id` — Cập nhật thông tin công việc
- `PATCH /api/todos/:id/status` — Cập nhật trạng thái công việc
- `DELETE /api/todos/:id` — Xóa 1 công việc
- `DELETE /api/todos/completed` — Xóa tất cả công việc đã hoàn thành
- `GET /api/stats` — Lấy dữ liệu thống kê tổng hợp và nhật ký hoạt động

## 4. Gợi ý chụp ảnh đưa vào file Word (`HoGiaBao.docx`)
1. Ảnh chạy lệnh `node server.js` trong Terminal.
2. Ảnh giao diện chính `http://localhost:3000` (bao gồm danh sách công việc, biểu đồ thống kê, bé Dâu mascot).
3. Ảnh thao tác Thêm / Sửa công việc (Modal Hồng Dâu) và Cập nhật trạng thái hoàn thành.
4. Ảnh code `schema.sql`, `db.js` (SQLite) và `server.js` (REST API).
