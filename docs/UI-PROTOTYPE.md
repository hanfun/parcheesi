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

## Cập nhật giao diện bàn cờ — v0.3 (06/11/2026)

- Thêm hai nút chọn **Bàn cờ cơ bản** / **Bàn cờ vui nhộn** ngay tại màn hình in-game; đây là **chuyển chế độ xem prototype**, không thay đổi luật của trận thật.
- Thay các biểu tượng 🐴 trong 4 ô chuồng bằng 16 quân ngựa chibi SVG có khuôn mặt/avatar người chơi, chia bốn màu xanh dương, xanh lá, đỏ, vàng.
- Dựng lại bàn cờ theo phong cách mô hình đồ chơi 3D bằng CSS: khung gỗ, ô nổi, chuồng nổi, cờ góc, cúp đích, hoa/cỏ trang trí.
- Chế độ cơ bản: bảng lượt, xúc xắc, tiến độ các người chơi, mục tiêu hoàn thành 4 ngựa.
- Chế độ vui nhộn: ô đặc biệt 💣 ⭐ 🍀 🚀 ❓ 🎁, bảng skill có hồi chiêu và câu thoại hài; **đây mới là minh họa UI**.
- Có nút **Xem bàn cờ** ở trang chủ để xem cả hai chế độ mà không cần đăng nhập demo.
- Mobile portrait-first; ẩn bottom navigation khi trong game; màn ngang thấp hiển thị hướng dẫn xoay dọc.
- Tham chiếu hình ảnh được duyệt: [`../mockups/approved-chibi-3d-avatar.webp`](../mockups/approved-chibi-3d-avatar.webp).

**Chưa triển khai:** luật thật, di chuyển/quay xúc xắc hợp lệ, đặt bẫy server, tính điểm, multiplayer và Firebase. Không coi mockup minh họa là định nghĩa đường đi thật của Cờ Cá Ngựa Việt Nam.

## Bám mockup đã duyệt — v0.4 (06/11/2026)

**Trạng thái:** ĐÃ CODE GIAO DIỆN MẪU, CHỜ NGƯỜI DÙNG DUYỆT TRÊN GITHUB PAGES.

### Đã thay đổi

- **Không dùng SVG ngựa đơn giản / bàn cờ 225 ô phẳng làm hình ảnh chính của màn chơi nữa.** Dùng hình minh họa 3D chibi thật được cắt và tối ưu WebP từ mockup đã duyệt; màu gỗ, 4 khu chuồng, ngựa đội avatar và ô đặc biệt gần với thiết kế gốc.
- Hai hình ảnh bàn cờ chính: `assets/design/board-classic.webp`, `assets/design/board-fun.webp`.
- Trang chủ dùng `assets/design/home-scene.webp`; giao diện tài khoản dùng `assets/design/auth-scene.webp`; hồ sơ dùng 4 hình mẫu ngựa; danh sách phòng, chọn map, tạo phòng và phòng chờ hiển thị ảnh bản đồ thực.
- Chỉnh hệ thống CSS chung: header xanh tươi nổi, nút vàng/cam/xanh/tím bóng, panel kem, viền trắng dày, shadow nổi và nền hoa cỏ — đúng hướng *toy/3D chibi*, **không theo phong cách casino**.
- Màn hình in-game có nút xem **Cơ bản/Vui nhộn**, vùng bàn cờ minh họa, avatar người chơi (nếu đã tải ảnh) làm lớp phủ trên đầu hai quân ở khu xanh, nút chọn ngựa thử, xúc xắc thử, danh sách skill và các ô đặc biệt của mode vui nhộn.
- Mobile giữ bố cục **portrait-first**, ảnh bàn cờ không bị méo, điều khiển phía dưới. Trình duyệt mobile landscape thấp hiện yêu cầu xoay dọc.

### Giới hạn kỹ thuật phải giữ minh bạch

- Các hình cờ này **là artwork tham chiếu**. Không thể suy ra tọa độ di chuyển, số ô và trạng thái 4 quân thật từ raster; cần tách asset/layer board, token và hiệu ứng khi lập trình Game Engine.
- Hình minh họa gốc hiển thị một số ngựa chibi và avatar mẫu *đã vẽ sẵn*; avatar upload của người chơi được phủ thử lên khu xanh, chưa phải giải pháp production cho cả 4 quân mỗi người. Cần thiết kế lớp sprite 3D độc lập để hỗ trợ avatar thật cho từng ngựa trong gameplay.
- Trong chế độ cơ bản tuyệt đối không có skill/bẫy về logic; trong mode vui nhộn vị trí ô bẫy và hiệu ứng **chưa phải luật đã duyệt**.
- Tất cả login, phòng, ví điểm, ranking, xúc xắc, vị trí ngựa hiện là demo để duyệt hình ảnh và luồng UX. Không có dữ liệu online hay backend tin cậy.

### Tiêu chí nghiệm thu bổ sung

- [ ] Người dùng duyệt độ tương đồng với `mockups/approved-chibi-3d-avatar.webp` và storyboard 9 màn hình.
- [ ] Người dùng duyệt phiên bản màn chơi mobile dọc ở cả 2 chế độ.
- [ ] Khi triển khai game thật, thay raster bàn cờ bằng layered assets tương đồng phong cách mà vẫn bảo đảm đúng luật.