# Cờ Cá Ngựa — giao diện HTML chibi 3D (Prototype)

Giao diện HTML/CSS/JavaScript thuần để duyệt UI, dựa trên mockup đã chốt tại `mockups/approved-chibi-3d-avatar.webp`. **Chưa kết nối Firebase, chưa có tài khoản thật, ví điểm, multiplayer hoặc game engine.**

## Chạy nhanh

```bash
python3 -m http.server 8080
# Mở http://localhost:8080
```

Hoặc mở `index.html` trực tiếp (một số trình duyệt có thể hạn chế module JS qua `file://`). Không cần `npm install`.

## Màn hình

- Đăng nhập / tạo tài khoản (chỉ xác thực biểu mẫu giả lập, không gửi và không lưu mật khẩu).
- Trang chủ / sảnh chibi 3D.
- Danh sách phòng: tìm kiếm, lọc theo chế độ, trạng thái mẫu.
- Tạo phòng: tên, mật khẩu tùy chọn, mode, số người, điểm, thời gian, tỉ lệ chia điểm.
- Chọn map: 2 cơ bản + 4 vui nhộn, xem bàn cờ nhỏ.
- Phòng chờ: thành viên mẫu, sẵn sàng, sao chép mã phòng.
- Màn chơi mẫu: **mobile portrait-first**, bàn cờ vuông responsive, xúc xắc demo và nút biểu cảm.
- Profile: đổi tên và ảnh avatar xem trước, bốn ngựa mang khuôn mặt của người chơi.
- Bảng xếp hạng mẫu: tổng điểm / tỷ lệ thắng / cấp độ.

## UX mobile

- Desktop: sidebar trái, màn hình nội dung rộng.
- Mobile: menu cố định dưới màn hình; thẻ co thành một cột.
- **Trong game trên điện thoại: ưu tiên dọc (portrait)**; bàn cờ vuông co theo chiều ngang, nút xúc xắc và skill bên dưới. Nếu thiết bị ở **landscape thấp**, hiện lời nhắc xoay dọc. Trình duyệt web không bảo đảm có thể khóa hướng màn hình bằng JS.
- Có hỗ trợ `prefers-reduced-motion` và tương tác bằng bàn phím.

## Lưu ý bảo mật và nghiệp vụ

- Sign-in chỉ là trạng thái demo trong bộ nhớ; tên, avatar và lựa chọn map được lưu `localStorage` để xem lại trên chính thiết bị. **Không lưu mật khẩu**.
- Dữ liệu phòng, điểm và bảng xếp hạng đều mô phỏng. Không tạo giao dịch điểm.
- Bàn cờ 15×15 chỉ là **layout tham khảo**, chưa xác thực đường đi hoặc cách thắng theo luật Cờ Cá Ngựa Việt Nam.
- Những tính năng online cần Auth, security rules, backend đáng tin cậy cho tung xúc xắc, di chuyển, ví điểm và thưởng hằng ngày.

## Công việc tiếp theo

1. Duyệt từng màn hình desktop/mobile, vị trí avatar ngựa và giao diện bàn cờ dọc.
2. Tách giao diện thành React components theo kiến trúc đã định.
3. Hoàn thiện đặc tả luật game, bản đồ và bộ kiểm thử.
4. Làm offline trước; tích hợp Auth và Firebase online sau.