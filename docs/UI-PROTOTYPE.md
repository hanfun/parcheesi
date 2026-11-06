# UI PROTOTYPE — giao diện HTML v0.1

**Ngày:** 06/11/2026  
**Mục tiêu:** Tạo giao diện tương tác để duyệt, chưa làm chức năng production.

## Màn hình được triển khai

| Màn hình | Trạng thái | Ghi chú |
|---|---|---|
| Login / Register | Demo | Kiểm tra biểu mẫu client; không gọi Firebase / không lưu mật khẩu |
| Home | Demo | Chibi 3D, CTA, điều hướng |
| Room list | Demo | Tìm kiếm, lọc, dữ liệu mẫu |
| Create Room / Config | Demo | Mode, password, số người, điểm, chia thưởng |
| Map picker | Demo | 2 bản cơ bản, 4 bản vui nhộn |
| Room Lobby | Demo | Sẵn sàng, copy mã, mở màn chơi demo |
| Game portrait UI | Demo | Bàn cờ vuông, xúc xắc (chỉ UI), thông báo xoay dọc |
| Profile | Demo | Tên, upload avatar, xem trên đầu ngựa, thống kê mẫu |
| Ranking | Demo | Top người chơi, bộ lọc mẫu |

## Checklist QA trước khi duyệt

- [ ] Test desktop ≥ 1280px
- [ ] Test tablet 768px
- [ ] Test mobile portrait 360px, 390px, 430px
- [ ] Test game mobile landscape: hiển thị nhắc xoay dọc
- [ ] Duyệt vị trí avatar trên mặt ngựa
- [ ] Duyệt giao diện phòng, cấu hình và map
- [ ] Duyệt màu sắc, font, biểu cảm, mascot theo mockup

## Điểm còn chờ làm (không ghi hoàn thành)

- Firebase Authentication, xác thực Google, email verification.
- Realtime phòng online, mật khẩu phòng, xử lý reconnect 60 giây.
- Ví điểm, daily login, khóa và chia thưởng, luật bỏ cuộc.
- Bộ Game Engine và kiểm thử đường đi đúng luật.
- Map/skill/bẫy do Admin tùy chỉnh.
- Tách sang React/Vite/TypeScript khi được duyệt.

**Không đánh dấu các milestone M1/M2/M3 là hoàn thành chỉ vì UI demo đã tạo.**