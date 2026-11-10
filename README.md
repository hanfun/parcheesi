# Cờ Cá Ngựa — Chibi 3D 🎲🐴

Website: **https://hanfun.github.io/parcheesi/**  
GitHub: https://github.com/hanfun/parcheesi

## Trạng thái

**Đã có bản chơi offline MVP** cho 2–4 người luân phiên trên cùng một máy. Giao diện sảnh, phòng, tài khoản, điểm và bảng xếp hạng vẫn là mẫu UI, **không phải multiplayer online thật**.

### Đã triển khai

- Bàn cờ 15×15 tương tác với 4 khu chuồng và 52 ô đường chạy.
- 4 quân/người, chuyển lượt, tung xúc xắc, chọn quân đi hợp lệ, xuất quân, đá quân, vào đường đích và nhận biết thắng cuộc.
- **Xúc xắc 3D**: lăn/xoay trong ~950 ms và hiển thị mặt 1–6 tương ứng kết quả.
- **Âm thanh tung xúc xắc** mô phỏng tiếng va chạm, âm di chuyển, đá quân và thắng cuộc bằng Web Audio API; công tắc tắt/bật âm thanh có lưu trên thiết bị. Không cần tải SFX bên ngoài.
- Quân ngựa chibi di chuyển từng ô, highlight quân có thể chọn, responsive và ưu tiên màn hình dọc.
- Giữ ảnh thiết kế chibi đã duyệt dưới dạng minh họa; bàn cờ tương tác dùng lưới có tọa độ riêng để bảo đảm chọn và đi đúng ô.
- Hai giao diện Cơ bản/Vui nhộn; **các ô bẫy, skill, quà tặng ở chế độ Vui nhộn chưa có tác dụng game logic**.

### Bản cập nhật 10/11/2026 — giao diện khớp thiết kế hơn

- **3D tương tác**: dựng bàn cờ mô hình với khung gỗ, chuồng nổi, hoa cỏ, ngựa chibi nhiều chi tiết, biểu tượng avatar trên đầu ngựa.
- **Chuyển sang Thiết kế gốc**: dùng đúng ảnh WebP đã duyệt làm mặt bàn; tương tác xúc xắc, chọn quân và di chuyển vẫn hoạt động.
- **Ngựa 3D nhảy từng ô** tương ứng với từng bước từ Rules Engine; khi đổi lượt bàn tự xoay về người tiếp theo.
- Hai chế độ **Cơ bản / Vui nhộn** hiện dùng chung luật offline; các ô hiệu ứng vui nhộn chỉ là đồ họa.
- Nếu WebGL/Three.js không tải được, game tiếp tục hiển thị giao diện artwork 2D có thể chơi.

**Giới hạn QA:** Chưa kiểm chứng hình ảnh trên tất cả thiết bị; ảnh artwork có các ngựa mẫu nằm sẵn trong hình, nên chế độ Thiết kế gốc có thể nhìn thấy ngựa mẫu bên dưới quân tương tác. Chưa có socket multiplayer, chat thật hay skill. Bản 3D và artwork vẫn cần được người dùng đối chiếu trực quan với mockup đã duyệt.

### Luật bản thử nghiệm `vietnamese-offline-mvp-v1`

1. Mỗi lượt tung **1 xúc xắc 1–6**; phải tung **6 mới xuất 1 quân**.
2. Tung **6** được tung tiếp sau khi di chuyển, kể cả không còn nước hợp lệ.
3. Nếu có nước hợp lệ, nhấn quân phát sáng để đi. Nếu không có, tự động chuyển lượt (hoặc giữ lượt khi ra 6).
4. Đến đúng ô đường chạy đang có quân đối thủ thì đá về chuồng. Không cho 2 quân cùng màu đứng chung một ô đường chạy.
5. Vào đường đích cần đúng số bước; đưa đủ 4 quân vào đích là thắng.
6. **Chưa có** ô an toàn, cản đường, luật chuồng 6–5–4–3 đặc thù, đồng bộ online hay kỹ năng. Đây là ruleset thử nghiệm, cần chốt với luật cờ cá ngựa Việt Nam trước khi dùng cho thi đấu/online.

## Chạy local

```bash
git clone https://github.com/hanfun/parcheesi.git
cd parcheesi
python3 -m http.server 8080
# Mở http://localhost:8080
```

Không cần `npm install` để chơi. Sử dụng trình duyệt hiện đại có ES Modules. Tương tác đầu tiên với nút "Tung xúc xắc" sẽ kích hoạt âm thanh; trên điện thoại cần đảm bảo máy không đang tắt tiếng.

## Kiểm thử logic

Yêu cầu Node.js mới:

```bash
node --test tests/game-engine.test.mjs
```

- `assets/game-engine.js`: logic offline tách biệt UI.
- `assets/game-audio.js`: âm thanh tổng hợp, bật/tắt.
- `app.js`: view và sự kiện UI.
- `styles.css`: giao diện, hiệu ứng 3D và ngựa di chuyển.

## GitHub Pages

GitHub Actions ở [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) tự triển khai mỗi lần cập nhật `main`. Nếu chưa bật Pages, mở [Settings → Pages](https://github.com/hanfun/parcheesi/settings/pages) và chọn **GitHub Actions**.

## Lộ trình tiếp theo

- Chốt luật Việt Nam và sơ đồ ô tương ứng với ảnh thiết kế đã duyệt.
- Hoàn thiện skill, bẫy, ô may mắn và hiệu ứng đặc biệt cho map vui nhộn.
- Thay hình minh họa bàn cờ bằng bộ thành phần đồ họa dùng chung với bàn tương tác.
- Tài khoản thật, phòng online nhiều thiết bị, chat, đồng bộ trạng thái server-authoritative; không dùng trạng thái client để quyết định kết quả xúc xắc online.

> Phòng, tài khoản, điểm số, mật khẩu và xếp hạng trên màn hình demo hiện tại chưa có server thực. Không có thanh toán hoặc giao dịch điểm.
