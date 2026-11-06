# CHECKLIST TRIỂN KHAI — CỜ CÁ NGỰA WEB

> Repository: [hanfun/parcheesi](https://github.com/hanfun/parcheesi)  
> Tài liệu tổng thể: [PLAN.md](./PLAN.md)  
> Đặc tả âm thanh theo event, roadmap cho Codex: [docs/AUDIO-SPEC.md](./docs/AUDIO-SPEC.md)  
> Cập nhật: 05/11/2026  
> Trạng thái hiện tại: **Chưa bắt đầu triển khai theo kế hoạch**  
> **Quy tắc:** Giai đoạn hiện tại chỉ làm **thiết kế giao diện + đặc tả luật**, chưa viết logic game, chưa cấu hình Firebase, chưa deploy.

## Cách sử dụng checklist

- `[ ]` Chưa hoàn thành, `[x]` Đã hoàn thành. Chỉ tích dấu khi **đạt tiêu chí nghiệm thu**, không tích chỉ vì đã bắt đầu.
- Làm theo **mã công việc** từ trên xuống. Công việc có dấu `GATE` phải được duyệt mới chuyển giai đoạn.
- Mỗi nhóm công việc nên có một commit/PR riêng, ví dụ `docs(rules): finalize v1 movement rules`.
- Sau mỗi buổi làm, cập nhật: ngày, việc đã xong, quyết định mới, vướng mắc ở phần **Nhật ký tiến độ** bên dưới.
- Nếu luật thay đổi, cập nhật `docs/RULES.md`, `docs/BOARD-MAP.md`, `docs/TEST-CASES.md` trước khi sửa code.
- Các luật đang **chờ duyệt** không được âm thầm biến thành luật chính thức.

## Mốc hoàn thành (milestones)

| Mốc | Nội dung | Điều kiện hoàn thành | Trạng thái |
|---|---|---|---|
| M0 | Phạm vi và quy ước | Kế hoạch + danh sách vấn đề cần chốt | ⬜ Chưa xong |
| M1 | Giao diện (UX/UI) | Bộ màn hình desktop/mobile, prototype được duyệt | ⬜ Chưa xong |
| M2 | Luật + bản đồ bàn cờ | `RULES.md` + `BOARD-MAP.md` + tình huống test được duyệt | ⬜ Chưa xong |
| M3 | Game Engine | Chạy unit test đúng tất cả luật | ⬜ Chưa xong |
| M4 | Chơi offline | Chơi trọn ván với 2/3/4 người cùng thiết bị | ⬜ Chưa xong |
| M5 | Chơi online | 2–4 thiết bị đồng bộ đúng và khôi phục kết nối | ⬜ Chưa xong |
| M6 | Phát hành | CI, bảo mật, deploy và QA đạt yêu cầu | ⬜ Chưa xong |

---

## GIAI ĐOẠN A — Yêu cầu, UI và luật chơi (LÀM TRƯỚC)

### A0 — Chốt phạm vi và cách theo dõi

- [ ] **A0.1** Xác nhận phạm vi MVP: 2–4 người; offline cùng máy trước, online sau; không làm bot/chat/payments lúc đầu.
- [ ] **A0.2** Chốt ngôn ngữ giao diện mặc định tiếng Việt; tên thuật ngữ: *khu chờ*, *đường chạy*, *đường về*, *hoàn thành*.
- [ ] **A0.3** Xác nhận thứ tự ưu tiên: **UI + luật** → Game Engine → offline → online → deploy.
- [ ] **A0.4** Quy ước mỗi task có ID, người duyệt, tiêu chí nghiệm thu; ghi quyết định vào tài liệu, không để chỉ trong chat.

**Đầu ra:** `PLAN.md` + `CHECKLIST.md` phản ánh phạm vi đã thống nhất.

### A1 — UX / Bộ màn hình web

- [ ] **A1.1** Thống nhất phong cách: vui tươi, hiện đại, dễ sử dụng trên desktop/mobile, không sao chép hình ảnh game khác.
- [ ] **A1.2** Phác họa luồng: Trang chủ → chọn chế độ → cấu hình người chơi → bàn cờ → kết quả → chơi lại.
- [ ] **A1.3** Wireframe **trang chủ**: Chơi offline / Online (khóa hoặc ghi “sắp có” ở bản đầu), Hướng dẫn, Cài đặt.
- [ ] **A1.4** Wireframe **thiết lập offline**: 2/3/4 người, tên, màu, lựa chọn luật nếu đã có biến thể.
- [ ] **A1.5** Wireframe **màn hình bàn cờ desktop**: bàn cờ 1:1, xúc xắc, lượt hiện tại, danh sách người chơi, menu.
- [ ] **A1.6** Wireframe **màn hình bàn cờ mobile**: vùng chạm đủ lớn, không tràn ngang, ưu tiên bàn cờ.
- [ ] **A1.7** Wireframe **trợ giúp/luật chơi**: hướng dẫn ngắn + hình minh họa đường đi.
- [ ] **A1.8** Wireframe **màn hình thắng cuộc**: người thắng, hạng (nếu có), chơi lại, về trang chủ.
- [ ] **A1.9** Đặc tả các dialog: xác nhận thoát, bắt đầu lại, không có nước đi, âm thanh.
- [ ] **A1.10** Chọn design tokens: bảng màu 4 đội, chữ, spacing, shadow, kích thước chạm, focus/disabled.
- [ ] **A1.11** Thiết kế quân ngựa/icon SVG và 6 mặt xúc xắc; hiển thị màu kèm ký hiệu để dễ phân biệt.
- [ ] **A1.12** Mô tả trạng thái tương tác: chờ gieo, đang gieo, chọn quân, di chuyển, đá quân, đổi lượt, kết thúc.
- [ ] **A1.13** Kiểm tra bố cục ở mobile portrait/landscape, tablet, desktop; tránh bàn cờ bị méo.
- [ ] **A1.14** Viết `docs/UI-SPEC.md`: màn hình, component, responsive, trạng thái, tiêu chí UX.
- [ ] **A1.15** Duyệt âm thanh/nhạc game theo [AUDIO-SPEC.md](./docs/AUDIO-SPEC.md): sound moodboard, ID sự kiện, volume/mute, ưu tiên Cơ bản → Vui nhộn; **chưa làm SFX thật**.
- [ ] **A1.GATE** **DUYỆT UX/UI**: người dùng duyệt mockup desktop/mobile và danh mục màn hình P0 **trước khi làm UI thật**.

**Đầu ra:** `docs/UI-SPEC.md` + wireframe/mẫu giao diện có thể xem và duyệt.  
**Phụ thuộc:** A0. Không cần Firebase hay Game Engine.

### A2 — Xác định bàn cờ Cờ Cá Ngựa Việt Nam

- [ ] **A2.1** Chọn ảnh/mẫu bàn cờ Cờ Cá Ngựa Việt Nam làm chuẩn tham chiếu; ghi rõ phiên bản.
- [ ] **A2.2** Xác định số ô đường chạy, 4 điểm xuất phát, 4 khu chờ và các dãy về đích 1–6.
- [ ] **A2.3** Gán ID ổn định cho từng ô, tách khỏi tọa độ giao diện; quy định ID theo màu/hành lang.
- [ ] **A2.4** Vẽ đường đi hợp lệ đầy đủ cho quân **đỏ**.
- [ ] **A2.5** Vẽ đường đi hợp lệ đầy đủ cho quân **xanh dương**.
- [ ] **A2.6** Vẽ đường đi hợp lệ đầy đủ cho quân **vàng**.
- [ ] **A2.7** Vẽ đường đi hợp lệ đầy đủ cho quân **xanh lá**.
- [ ] **A2.8** Đánh dấu các ô đặc biệt (nếu tồn tại), ranh giới rẽ vào chuồng và vị trí hoàn thành.
- [ ] **A2.9** Xem xét hiển thị 4 quân trên các ô chồng nhau, đường đi/đường về và mức thu phóng trên mobile.
- [ ] **A2.10** Viết `docs/BOARD-MAP.md`: hình bàn cờ + quy ước ID + lộ trình 4 màu.
- [ ] **A2.GATE** **DUYỆT BÀN CỜ:** layout + ID + đường đi của từng màu khớp mẫu Việt Nam đã chọn.

**Đầu ra:** `docs/BOARD-MAP.md` với sơ đồ rõ ràng.  
**Phụ thuộc:** A1 có wireframe, có mẫu bàn cờ đã chọn.

### A3 — Chốt chính xác luật chơi (không suy đoán luật Ludo/Parcheesi)

- [ ] **A3.1** Chốt dùng 1 viên xúc xắc hay 2 viên; cách xác định người đi đầu.
- [ ] **A3.2** Chốt điều kiện xuất quân: **1 hoặc 6** hay **chỉ 6**, và ô xuất phát bị chiếm thì sao.
- [ ] **A3.3** Chốt trường hợp ra **6** có thêm lượt không, số lần liên tiếp và cách xử lý khi không đi được.
- [ ] **A3.4** Chốt quyền chọn giữa xuất quân mới và đi quân đang ở ngoài khi cùng hợp lệ.
- [ ] **A3.5** Chốt hướng đi, xử lý khi bước qua quân khác, quân chặn đường hoặc hai quân đồng màu.
- [ ] **A3.6** Chốt luật đá quân khi dừng đúng ô có đối thủ; điều kiện miễn đá/ô an toàn (nếu có).
- [ ] **A3.7** Chốt khi không có nước hợp lệ: tự chuyển lượt, thông báo, có được tung lại không.
- [ ] **A3.8** Chốt cách rẽ vào chuồng/dãy 1–6, khi xúc xắc lớn hơn số bước còn lại, và thứ tự xếp đích.
- [ ] **A3.9** Chốt cách thắng: đủ 4 quân, có chơi tiếp xếp hạng 2–4 không.
- [ ] **A3.10** Chốt các giới hạn thời gian/AFK: chưa áp dụng ở offline, để ở backlog online.
- [ ] **A3.11** Ghi ví dụ minh họa **hợp lệ / không hợp lệ** cho từng luật; phiên bản luật `vietnamese-classic-v1`.
- [ ] **A3.12** Tạo `docs/RULES.md` chính thức, chỉ sử dụng luật đã được duyệt.
- [ ] **A3.GATE** **DUYỆT LUẬT:** không còn quy tắc mơ hồ ảnh hưởng đến bước đi, đá quân, về đích hoặc đổi lượt.

**Đầu ra:** `docs/RULES.md`.  
**Phụ thuộc:** A2 — đường đi & bản đồ phải đúng.

### A4 — Chuyển luật thành bộ tình huống kiểm thử

- [ ] **A4.1** Liệt kê tình huống xuất quân cho từng giá trị 1–6.
- [ ] **A4.2** Liệt kê trường hợp thêm lượt: tung 6, liên tiếp 6, không có nước đi.
- [ ] **A4.3** Liệt kê va chạm: đá, chắn, ô xuất phát có quân, quân cùng màu/khác màu.
- [ ] **A4.4** Liệt kê di chuyển: đi đủ bước, đường rẽ vào chuồng, xúc xắc vượt số còn lại.
- [ ] **A4.5** Liệt kê hoàn thành 1 quân, hoàn thành 4 quân, thứ hạng và restart.
- [ ] **A4.6** Với mỗi case ghi rõ: trạng thái đầu → xúc xắc/thao tác → kết quả mong đợi.
- [ ] **A4.7** Tạo `docs/TEST-CASES.md` để sau này chuyển trực tiếp thành unit test.
- [ ] **A4.GATE** **DUYỆT ĐẶC TẢ:** UI + bàn cờ + luật + test case nhất quán, đủ để code engine.

**Đầu ra:** `docs/TEST-CASES.md`.  
**Phụ thuộc:** A1 + A2 + A3 đã duyệt.

---

## GIAI ĐOẠN B — Lập trình chỉ sau khi A4.GATE được duyệt

### B1 — Game Engine độc lập giao diện

- [ ] **B1.1** Định nghĩa `GameState`, `Player`, `Piece`, `BoardCell`, `GameAction`, `GameEvent`.
- [ ] **B1.2** Xây graph lộ trình theo `BOARD-MAP.md`; không gắn luật với tọa độ SVG.
- [ ] **B1.3** Viết hàm trả về tất cả nước đi hợp lệ theo state và dice.
- [ ] **B1.4** Viết reducer chuyển trạng thái: xuất quân, đi, đá, về đích, đổi lượt.
- [ ] **B1.5** Tách việc tạo số ngẫu nhiên khỏi game engine để có thể test và kiểm chứng online.
- [ ] **B1.6** Chạy unit test đầy đủ từ `TEST-CASES.md`; lưu/trả state có version để phục vụ online.
- [ ] **B1.GATE** Game Engine không phụ thuộc React/Firebase và vượt toàn bộ test luật đã duyệt.

### B2 — Giao diện vận hành + offline

- [ ] **B2.1** Dựng UI React + TypeScript + Vite theo `UI-SPEC.md`.
- [ ] **B2.2** Render bàn cờ từ dữ liệu map; scale đúng trên desktop/mobile.
- [ ] **B2.3** Liên kết roll, highlight quân hợp lệ, chọn quân, animation theo event từ Game Engine.
- [ ] **B2.4** Hoàn thiện chơi offline 2 người cùng thiết bị.
- [ ] **B2.5** Hoàn thiện chơi offline 3 và 4 người cùng thiết bị.
- [ ] **B2.6** Thêm menu, chơi lại, âm thanh/tắt âm, hướng dẫn, xác nhận thoát.
- [ ] **B2.7** Kiểm thử thực tế trên mobile/desktop; không cho click đúp khi đang animate.
- [ ] **B2.GATE** Một ván offline hoàn chỉnh từ đầu đến thắng cuộc, đúng luật và không lỗi UI.

### B3 — Multiplayer với Firebase

- [ ] **B3.1** Tạo Firebase Project Spark, Firestore và Anonymous Auth; cấu hình môi trường.
- [ ] **B3.2** Thiết kế dữ liệu `rooms`, `players`, `gameState`, phiên bản trạng thái và cách hết hạn phòng.
- [ ] **B3.3** Tạo phòng, mã/link mời; cho phép 2–4 người vào lobby và chọn màu không trùng.
- [ ] **B3.4** Đồng bộ trạng thái realtime bằng listener, hạn chế lần đọc/ghi không cần thiết.
- [ ] **B3.5** Dùng transaction và version để xử lý thao tác đồng thời/trùng lặp; chỉ đúng lượt được chơi.
- [ ] **B3.6** Viết Firestore Security Rules ngăn người ngoài phòng ghi và giới hạn thao tác.
- [ ] **B3.7** Đặc tả rõ giới hạn tin cậy: Firestore không tự xác thực đúng xúc xắc hoặc toàn bộ luật; chống gian lận nghiêm túc cần backend tin cậy.
- [ ] **B3.8** Xử lý refresh, mất mạng, người chơi rời phòng, chủ phòng rời, phòng hết hạn.
- [ ] **B3.9** Kiểm thử 2–4 trình duyệt/thiết bị đồng thời, đo số lần đọc/ghi.
- [ ] **B3.GATE** Online hoạt động ổn định, quyền truy cập dữ liệu được kiểm tra, chi phí phù hợp Spark.

### B4 — Triển khai, QA và phát hành

- [ ] **B4.1** Chốt hosting: GitHub Pages nếu repo public/gói phù hợp, hoặc Cloudflare Pages nếu repo private.
- [ ] **B4.2** Thiết lập CI build, test, deploy tự động; build thất bại thì không deploy.
- [ ] **B4.3** Cấu hình route/base path, Firebase authorized domains, biến môi trường công khai đúng nơi.
- [ ] **B4.4** Kiểm thử accessibility, responsive, hiệu suất trên máy tầm trung và kiểm soát tài nguyên Firebase.
- [ ] **B4.5** Viết `README.md` (cài đặt, chạy local, quy ước tài liệu, deploy), tài liệu vận hành.
- [ ] **B4.GATE** Hoàn thành QA, test, security review cơ bản và xác minh website chạy thực tế.

---

## Nguyên tắc nghiệm thu chung (Definition of Done)

Một task chỉ được đánh dấu `[x]` khi:

1. Có sản phẩm đầu ra xem/đọc/chạy được, đúng mô tả trong task.
2. Nội dung không mâu thuẫn `PLAN.md` và các tài liệu đã được duyệt.
3. Nếu là code: có kiểm thử liên quan, build không lỗi, không làm hỏng chức năng cũ.
4. Nếu là UI: kiểm tra desktop/mobile, trạng thái tương tác và kích thước vùng chạm.
5. Đã ghi vào tài liệu quyết định mới hoặc lý do thay đổi; không để yêu cầu chỉ nằm trong chat.

## Những quyết định **chưa được chốt** — hỏi trước khi code luật

- [ ] **D1** Bản Cờ Cá Ngựa Việt Nam nào dùng làm chuẩn hình học bàn cờ?
- [ ] **D2** Xuất quân bằng 1 hoặc 6, hay chỉ 6?
- [ ] **D3** Tung 6 được thêm lượt như thế nào? Giới hạn tung 6 liên tiếp?
- [ ] **D4** Được vượt quân khác không; cản đường, cùng ô, đá quân xử lý thế nào?
- [ ] **D5** Các ô an toàn có tồn tại không?
- [ ] **D6** Cách đi vào dãy đích 1–6, thứ tự hoàn thành của 4 quân và đi quá số?
- [ ] **D7** Ván kết thúc khi có người đầu tiên về đủ 4 quân hay chơi tiếp xếp hạng?
- [ ] **D8** Thứ tự lượt và xác định người đi trước thế nào?

> Quyết định D1–D8 nên được chốt trong `docs/RULES.md`/`docs/BOARD-MAP.md`. Tránh lấy luật Ludo mặc định rồi gọi là luật Cờ Cá Ngựa Việt Nam.

## Công việc tiếp theo

**Ưu tiên ngay:** A0.1–A0.4 → A1.1–A1.6 (wireframe trang chủ + bàn cờ desktop/mobile) → A2.1 (chọn bàn cờ chuẩn).  
**Không bắt đầu Firebase hoặc multiplayer lúc này.**

## Nhật ký tiến độ

| Ngày | Task | Thay đổi / quyết định | Vướng mắc | Người duyệt |
|---|---|---|---|---|
| 05/11/2026 | Khởi tạo checklist | Tạo danh sách task và GATE; **chưa đánh dấu hoàn thành triển khai** | Các quy tắc D1–D8 cần duyệt | Chưa duyệt |
