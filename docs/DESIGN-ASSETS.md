# Design assets — bám mockup chibi 3D đã duyệt

Các ảnh trong `assets/design/` được **cắt và tối ưu từ các mockup gốc tạo/duyệt trong cuộc hội thoại của dự án Cờ Cá Ngựa**, nhằm dùng đúng chất liệu mỹ thuật chứ không chỉ mô phỏng bằng CSS phẳng.

- `board-classic.webp`: ảnh bàn cờ **thường** đã duyệt, dùng cho sân chơi UI và map thumbnail.
- `board-fun.webp`: ảnh bàn cờ **vui nhộn** đã duyệt, biểu tượng bẫy/may mắn/ô đặc biệt.
- `home-scene.webp`: cảnh trang chủ rực rỡ với logo và ngựa con.
- `auth-scene.webp`: cảnh bé gái và ngựa hồng cho giao diện tài khoản.
- `horse-{blue,green,red,yellow}.webp`: 4 mẫu ngựa avatar cho giao diện hồ sơ.
- `hero-characters.webp`, `hero-girl.webp`, `brand-title.webp`, `map-select-scene.webp`: các ảnh cắt phụ, dùng được khi tinh chỉnh giao diện lần sau.

## Quy tắc thiết kế

- Tông xanh trời, hoa lá, bảng màu 4 đội, mô hình 3D chibi, nút nổi và panel kem với viền trắng.
- Không dùng giao diện cờ bạc: tối, neon gắt, nút đặt cược phô trương hoặc vật phẩm mang cảm giác casino.
- Không bê ảnh screenshot toàn màn hình vào thay cho form: đầu vào, nút, chọn chế độ, danh sách phòng là **DOM HTML thật**.
- Ảnh raster bàn cờ chỉ phục vụ **preview**, không phải source of truth của game state. Khi triển khai gameplay phải thay bằng ảnh nền + token/sprite 3D riêng + các ô có ID theo quy tắc đã duyệt.

Xem thêm [GAME_CONCEPT.md](../GAME_CONCEPT.md), [UI-PROTOTYPE.md](./UI-PROTOTYPE.md), [mockup gốc](../mockups/approved-chibi-3d-avatar.webp).