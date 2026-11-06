# Ý TƯỞNG GAME CỜ CÁ NGỰA — PRODUCT CONCEPT

> **Dự án:** [hanfun/parcheesi](https://github.com/hanfun/parcheesi)  
> **Tài liệu:** `GAME_CONCEPT.md`  
> **Phiên bản:** Concept v0.1 — 06/11/2026  
> **Trạng thái:** Thu thập và định hình yêu cầu; **chưa bắt đầu lập trình**.  
> **Liên quan:** [`PLAN.md`](./PLAN.md) · [`CHECKLIST.md`](./CHECKLIST.md)  
> **Quy ước:** **[ĐÃ CHỐT]** là yêu cầu người dùng đã xác nhận; **[ĐỀ XUẤT]** cần duyệt chi tiết; **[CẦN CHỐT]** là câu hỏi nghiệp vụ mở. Không coi một đề xuất là luật chơi chính thức.

## 1. Tầm nhìn

Xây dựng website **Cờ Cá Ngựa Việt Nam** mang phong cách **vui nhộn, có tính cá nhân hóa**, dễ chơi trên máy tính và điện thoại. Một Game Rules Engine dùng chung cho chơi offline và online; giao diện, hiệu ứng, câu thoại và giao diện quân ngựa có thể cấu hình mà không phá vỡ luật chơi. Phát triển theo từng giai đoạn, thiết kế giao diện và chốt luật trước khi viết code.

### Nguyên tắc

- [ĐÃ CHỐT] Hỗ trợ **2–4 người**: offline cùng thiết bị và online nhiều thiết bị.
- [ĐÃ CHỐT] Online **bắt buộc đăng nhập**, offline có thể chơi mà không đăng nhập.
- [ĐÃ CHỐT] Có hai chế độ ban đầu: **Cơ bản** và **Vui nhộn**.
- [ĐÃ CHỐT] Người chơi có điểm ảo trong game, thưởng đăng nhập hằng ngày, có thể chọn mức điểm tham gia ván đấu và quy tắc thưởng theo thứ hạng.
- [ĐỀ XUẤT] Điểm chỉ mang tính giải trí: **không mua, bán, chuyển thành tiền thật hay phần thưởng có giá trị thực**. Nếu thay đổi mô hình này phải đánh giá lại về pháp lý và an toàn sản phẩm.

## 2. Tài khoản và hồ sơ người chơi

### 2.1 Đăng ký/đăng nhập

- [ĐÃ CHỐT] Tạo tài khoản và đăng nhập **đơn giản**, bắt buộc với online.
- [ĐỀ XUẤT] Email/mật khẩu và đăng nhập Google; có quên mật khẩu, đăng xuất, xác minh email nếu cần.
- [ĐỀ XUẤT] Tên hiển thị (`displayName`) có thể trùng; mã người chơi công khai (`playerCode`) phải duy nhất; UID nội bộ là định danh thật cho backend.
- [ĐỀ XUẤT] Người dùng chưa đăng nhập khi mở link phòng sẽ được chuyển sang đăng nhập và trở lại phòng sau khi xác thực.

### 2.2 Hồ sơ cá nhân (Profile)

- [ĐÃ CHỐT] Xem hồ sơ cá nhân.
- [ĐÃ CHỐT] Cập nhật **avatar, tên, mật khẩu**.
- [ĐÃ CHỐT] Xem **số điểm hiện tại, tổng trận, số trận thắng và số trận thua**.
- [ĐỀ XUẤT] Hiển thị thêm tỷ lệ thắng, lịch sử trận đấu, lịch sử giao dịch điểm và điểm đang được giữ ở ván hiện tại.
- [ĐỀ XUẤT] Có hồ sơ công khai chỉ gồm nickname/avatar/thống kê cơ bản; email, số dư riêng tư, giao dịch và cài đặt bảo mật chỉ chủ tài khoản xem được.
- [ĐỀ XUẤT] Cập nhật mật khẩu yêu cầu xác thực lại khi cần; **không lưu mật khẩu** trong Firestore.
- [ĐỀ XUẤT] Chỉ backend tin cậy cập nhật số điểm, thắng/thua từ kết quả đã được xác minh; client không tự điều chỉnh các con số này.

## 3. Quân ngựa và avatar trên đầu ngựa

- [ĐÃ CHỐT] Người chơi chọn **ngựa mặc định (Classic)** hoặc **ngựa vui nhộn (Funny)**.
- [ĐÃ CHỐT] Ảnh avatar của chính người chơi **hiển thị trên con ngựa**, ưu tiên khu vực mặt/đầu, kể cả dùng kiểu ngựa mặc định.
- [ĐÃ CHỐT] Cho phép upload avatar từ Profile. 4 quân của cùng người chơi dùng avatar của họ.
- [ĐỀ XUẤT] Cho phép crop/zoom/căn chỉnh khuôn mặt và xem trước; có avatar hoạt hình mặc định nếu không tải ảnh.
- [ĐỀ XUẤT] Skin (ngoại hình) **độc lập** với game mode (Cơ bản/Vui nhộn) và màu phe; ngoại hình không tăng sức mạnh.
- [ĐỀ XUẤT] Admin quản lý danh mục skin, asset, vùng đặt avatar (tọa độ/tỷ lệ), animation, trạng thái bật/tắt và skin mặc định.
- [ĐỀ XUẤT] Animation cảm xúc: cười, khóc, tức giận, chạy, bị đá, về đích; có tùy chọn tắt/bớt hiệu ứng trên mobile.
- [CẦN CHỐT] Ngoại hình do **mỗi người tự chọn**, hay **chủ phòng áp dụng một kiểu chung**? Gợi ý: mỗi người tự chọn, chủ phòng chỉ thiết lập chế độ chơi.

## 4. Chế độ chơi

| Thuộc tính | Cơ bản | Vui nhộn |
| --- | --- | --- |
| Luật nền | Cờ Cá Ngựa Việt Nam đã chốt | Dùng luật nền + biến thể có cấu hình |
| Kỹ năng theo màu | Không | Có, thời gian hồi theo lượt |
| Bẫy và ô may mắn | Không | Có (theo bản đồ) |
| Avatar/skin | Có | Có |
| Thoại/biểu cảm | Có thể bật/tắt | Bật theo cấu hình |
| Điểm tham gia và thưởng | Có thể cấu hình cho ván online | Có thể cấu hình cho ván online |

- [CẦN CHỐT] Luật Cờ Cá Ngựa Việt Nam cụ thể (điều kiện xuất quân, đá quân, đường về chuồng, ô an toàn, xếp hạng và trường hợp bị chặn) sẽ được đặc tả riêng trước khi lập trình Engine.
- [ĐỀ XUẤT] Khóa phiên bản luật/map/skill/phân thưởng khi bắt đầu ván, không cập nhật giữa trận.

## 5. Kỹ năng theo màu — bản đề xuất để cân bằng

| Màu | Skill nháp | Tác dụng nháp | Hồi skill nháp |
| --- | --- | --- | --- |
| Đỏ | Tăng tốc | Cộng tối đa 2 bước hợp lệ | 3 lượt của người chơi |
| Xanh dương | Khiên | Chặn một lần bị đá trong lượt đối thủ kế tiếp | 4 lượt |
| Xanh lá | Dịch chuyển | Tiến tới một ô hợp lệ phía trước, tối đa 3 ô | 4 lượt |
| Vàng | May mắn | Tung lại xúc xắc một lần và dùng kết quả mới | 4 lượt |

- [ĐÃ CHỐT] Chế độ Vui nhộn có **skill riêng theo màu** và **lượt hồi skill**.
- [ĐỀ XUẤT] Mỗi lượt tối đa một lần sử dụng skill; Engine kiểm tra hợp lệ, skill không phá luật về đích hoặc đi xuyên vùng bị cấm.
- [ĐỀ XUẤT] Để công bằng, cho phép xoay màu/đổi màu giữa các ván hoặc cân bằng sức mạnh định kỳ.
- [CẦN CHỐT] Cách tính lượt hồi khi mất lượt, vừa xuất quân, ra 6 được lượt thêm; skill kích hoạt trước hay sau khi tung xúc xắc.

## 6. Bản đồ chế độ Vui nhộn — Custom Map & Event Tiles

### 6.1 Mục tiêu [ĐÃ CHỐT]

**Bản đồ chế độ Vui nhộn phải cấu hình được** và có các loại ô/sự kiện đặc biệt như **bẫy mìn, lựu đạn, ô may mắn tiến thêm, hoặc bị đưa về chuồng**. Bẫy/lựu đạn là hiệu ứng hoạt hình, không dùng hình ảnh bạo lực thực tế.

### 6.2 Loại ô và sự kiện (đề xuất để duyệt)

| Mã sự kiện | Tên hiển thị | Ví dụ hiệu ứng lên quân đáp xuống ô | Chính sách dự kiến |
| --- | --- | --- | --- |
| `NORMAL` | Ô thường | Không có hiệu ứng đặc biệt | Luật nền |
| `LUCKY_FORWARD` | Ô may mắn | Tiến thêm N ô hợp lệ | N cấu hình được, vd. 2–4 |
| `LUCKY_ROLL` | Ô xúc xắc may mắn | Được tung thêm một lượt/đổi kết quả | Cần cân bằng |
| `MINE_TRAP` | Bẫy mìn | Nổ hoạt hình, quân bị đưa về chuồng **hoặc** lùi N ô theo cấu hình | Hai biến thể không nên đồng thời |
| `GRENADE_TRAP` | Lựu đạn hoạt hình | Hiệu ứng vùng; tác động đến các quân trong bán kính R ô nếu hợp lệ | Cần chốt bán kính và mục tiêu |
| `BACKWARD` | Ô trượt chân | Lùi N ô | N cấu hình được |
| `RETURN_STABLE` | Về chuồng | Đưa quân bị ảnh hưởng về chuồng xuất phát | Chỉ trong Fun Mode |
| `SHIELD` | Ô khiên | Nhận khiên bảo vệ tạm thời | Chỉ 1 hiệu ứng/ô |
| `SAFE` | Ô an toàn | Miễn tác động bẫy/đá nếu luật cho phép | Không cho đặt bẫy |

> Tất cả hiệu ứng trên là **đề xuất** trừ yêu cầu có bẫy, lựu đạn, may mắn tiến thêm và về chuồng. Cần mô phỏng kỹ trước khi chốt cơ chế chính xác.

### 6.3 Cấu hình bản đồ

- [ĐÃ CHỐT] Có khả năng custom bản đồ ở chế độ Vui nhộn.
- [ĐỀ XUẤT] Admin tạo/sửa/nhân bản/ẩn map; đặt tên, mô tả, hình nền, vị trí ô, định nghĩa loại ô và tập hiệu ứng.
- [ĐỀ XUẤT] Chủ phòng chọn **một map đã được Admin xuất bản**; không cho tự sửa quy tắc từ client trong trận.
- [ĐỀ XUẤT] Mỗi map có `mapId`, `version`, `status`, `supportedPlayerCounts`, `tiles`, `eventPools`, `balanceRules`.
- [ĐỀ XUẤT] Cấu hình trọng số xuất hiện và giới hạn: số ô may mắn, số bẫy mỗi tuyến, không đặt bẫy ở ô xuất phát/đích/chuồng/ô an toàn.
- [ĐỀ XUẤT] Dùng bản đồ cố định có thể xem trước; nếu sinh ngẫu nhiên, seed do backend tin cậy quyết định, ghi lại để kiểm thử và replay.
- [ĐỀ XUẤT] Hiển thị rõ ô thường/ô nguy hiểm/ô may mắn bằng biểu tượng, có bảng chú giải; không tạo lợi thế khó đoán từ UI nhỏ.

### 6.4 Thứ tự xử lý sự kiện trong Engine (đề xuất)

1. Server kiểm tra lượt chơi, quyền điều khiển quân, kết quả xúc xắc và nước đi hợp lệ.
2. Thực hiện di chuyển theo luật nền.
3. Kiểm tra ô đích và giải quyết va chạm/đá quân theo thứ tự đã chốt.
4. Kích hoạt **tối đa một hiệu ứng ô** cho cùng một lần đáp xuống, trừ khi map ghi rõ chuỗi hiệu ứng và có giới hạn.
5. Ghi sự kiện (`TRAP_TRIGGERED`, `LUCKY_TILE`, `HORSE_RETURNED`, ...) và trạng thái mới **một cách nguyên tử**.
6. Gửi dữ liệu cho client; client phát animation/âm thanh/câu thoại.

**Chống vòng lặp:** không cho chuỗi ô may mắn → ô may mắn → ô may mắn kích hoạt vô hạn. Cần giới hạn số lần kích hoạt ô trong một action và xử lý rõ khi quân được tiến/lùi đến ô khác. 

### 6.5 Quy tắc công bằng và các trường hợp biên

- [ĐỀ XUẤT] Không đặt bẫy trong các ô an toàn, chuồng, ô về đích, ô khởi hành.
- [ĐỀ XUẤT] Bẫy ảnh hưởng quân nào, có ảnh hưởng đồng đội/đồng màu không, bẫy có dùng một lần không: phải chỉ rõ trong cấu hình đã xuất bản.
- [ĐỀ XUẤT] Xử lý khi trúng bẫy có khiên, trúng lựu đạn trong nhóm nhiều quân, và khi gần đích mà được cộng bước.
- [ĐỀ XUẤT] Map cho 2/3/4 người phải đối xứng hoặc được kiểm thử để không ưu tiên một màu.
- [ĐỀ XUẤT] Các map chơi có điểm tham gia nên có mức độ biến động hợp lý; khi không thể cân bằng phải cho phép loại map khỏi ván có đặt điểm.
- [CẦN CHỐT] Bẫy hiển thị công khai hay ẩn đến khi giẫm trúng; lựu đạn do ô tự nổ hay người chơi kích hoạt; tác dụng chính xác của mìn/lựu đạn; xác suất ô may mắn; quyền chọn map.

### 6.6 Gợi ý concept bản đồ đầu tiên

- **Classic Map:** đường đua và ô truyền thống, không có bẫy.
- **Funny Map — Công viên ngựa:** ô cỏ may mắn, mìn hoạt hình, lựu đạn confetti, ô trượt về chuồng.
- **Funny Map — Đường đua hỗn loạn:** nhiều ô dịch chuyển và hiệu ứng bất ngờ nhưng phải giữ tính đối xứng, có giới hạn kích hoạt.

## 7. Câu thoại hài hước và quản lý từ Admin

- [ĐÃ CHỐT] Khi quân ngựa **bị đá**, hiện một câu thoại vui nhộn.
- [ĐÃ CHỐT] Admin được **thêm/sửa/xóa/bật/tắt các câu thoại** mà không cần sửa code.
- [ĐỀ XUẤT] Câu thoại cũng được kích hoạt khi đá đối thủ, tung 6, không xuất quân được, dùng skill, trúng bẫy, vào ô may mắn, về đích, thắng/thua hoặc mất kết nối.
- [ĐỀ XUẤT] Cấu hình theo `eventType`, `mode`, `horseColor`, `locale`, `weight`, `enabled`, `content`, `animationKey`, `soundKey`.
- [ĐỀ XUẤT] `weight` là **trọng số tương đối**, không phải % tuyệt đối; random có kiểm soát tránh câu thoại lặp liên tục.
- [ĐỀ XUẤT] Chỉ hiển thị câu thoại đã được duyệt; chặn văn bản xúc phạm/kích động; hỗ trợ bật/tắt âm thanh và thoại trong cài đặt người chơi.

**Ví dụ:**

- `HORSE_KICKED`: “Ủa alo? Tui đang đi bình thường mà!”
- `HORSE_KICK`: “Xin lỗi, đường này hơi hẹp!”
- `MINE_TRAP`: “Ai đào ổ gà giữa đường vậy trời!”
- `GRENADE_TRAP`: “Ủa ai thả pháo giấy giữa đường vậy?”
- `LUCKY_FORWARD`: “Trời thương, được đi ké vài bước!”
- `RETURN_STABLE`: “Mới ra đường mà về chuồng rồi!”

## 8. Phòng chơi (Lobby / Room)

### 8.1 Tạo và tham gia phòng

- [ĐÃ CHỐT] Người đăng nhập được tạo phòng, đặt **tên phòng** và **mật khẩu phòng** (tùy chọn).
- [ĐÃ CHỐT] Chủ phòng cấu hình: **Cơ bản / Vui nhộn**, số người 2–4, **điểm mỗi người bỏ ra**, cách chia điểm hạng nhất/hạng nhì/... khi kết thúc.
- [ĐỀ XUẤT] Trong Fun Mode có thể chọn map đã xuất bản; mỗi người chọn màu nếu còn trống và skin Classic/Funny.
- [ĐỀ XUẤT] Phòng có mã mời riêng, danh sách người, trạng thái chờ/sẵn sàng/đang chơi/kết thúc, kiểm tra đủ điểm trước khi sẵn sàng.
- [ĐỀ XUẤT] Đổi cấu hình khi đang chờ phải **xóa trạng thái sẵn sàng** của mọi người; khóa cấu hình khi bắt đầu trận.
- [ĐỀ XUẤT] Mật khẩu phòng không lưu dạng rõ trong cơ sở dữ liệu có thể đọc từ client; dùng backend tin cậy để kiểm tra và chỉ lưu giá trị băm được bảo vệ.

### 8.2 Thoát phòng và mất kết nối

- [ĐÃ CHỐT] **Khi tất cả mọi người rời phòng thì phòng đó biến mất và dữ liệu phòng hoạt động bị xóa**. Lịch sử kết quả/giao dịch điểm phải lưu riêng trước khi xóa.
- [ĐÃ CHỐT] **Mất kết nối hoặc rời giữa trận: cho 60 giây kết nối lại; quá 60 giây xử thua và mất toàn bộ điểm đặt**.
- [ĐỀ XUẤT] Trong thời gian 60 giây, tạm dừng trận để công bằng; nếu quay lại thì đồng bộ lại trạng thái, vẫn giữ lượt.
- [ĐỀ XUẤT] Chủ phòng thoát trước trận thì chuyển vai trò chủ phòng cho người còn lại.
- [ĐỀ XUẤT] Xóa phòng dựa trên **presence/heartbeat và cơ chế dọn dẹp đáng tin cậy**, không chỉ tin vào sự kiện đóng tab; có khoảng chờ để tránh xóa nhầm khi tải lại trang.
- [CẦN CHỐT] Khi quá 60 giây, **loại ngựa của người bỏ cuộc và tiếp tục**, cho bot thay, hay dừng trận: chưa được người dùng chốt.
- [CẦN CHỐT] Thế nào là “rời phòng” khi tất cả đồng loạt mất mạng và xử lý điểm thế nào nếu trận không thể tiếp tục.

## 9. Ví điểm (Game Wallet), điểm thưởng và thứ hạng

- [ĐÃ CHỐT] Mỗi người chơi có số điểm; **mỗi ngày đăng nhập được cộng điểm**.
- [ĐÃ CHỐT] Phòng có mức điểm tham gia mỗi người và tỷ lệ/mức thưởng theo thứ hạng.
- [ĐỀ XUẤT] Gọi điểm tiêu dùng là `Horse Coins`; có thể thêm `Rank Points` chỉ để xếp hạng về sau (không dùng đặt điểm).
- [ĐỀ XUẤT] Thưởng ngày được phát **một lần/tài khoản/ngày theo múi giờ Việt Nam**, do server ghi nhận, mức thưởng Admin cấu hình (ví dụ 50 điểm chỉ là minh họa).
- [ĐỀ XUẤT] Điểm phải được **giữ (escrow)** khi bắt đầu ván; không trừ tiền tùy ý từ client. Mọi thao tác có `transactionId`, idempotency key để không cộng/trừ hai lần.
- [ĐỀ XUẤT] Tổng quỹ = số người tham gia × điểm mỗi người. Tổng tiền thưởng = tổng quỹ; **không tự sinh hoặc mất điểm ngoài thưởng đăng nhập**.

Ví dụ **4 người × 100 điểm = quỹ 400 điểm**:

| Hạng | Tỷ lệ minh họa | Nhận | Lãi/lỗ so với điểm đóng |
| --- | ---: | ---: | ---: |
| Nhất | 50% | 200 | +100 |
| Nhì | 30% | 120 | +20 |
| Ba | 20% | 80 | −20 |
| Tư | 0% | 0 | −100 |

- [CẦN CHỐT] Tỷ lệ thưởng theo **2, 3 và 4 người**, làm tròn điểm, xử lý đồng hạng và cách phân phối điểm của người bị loại giữa trận.
- [ĐỀ XUẤT] Người bỏ cuộc quá 60 giây nhận **0 phần thưởng**, mất điểm đã giữ. Phần quỹ của họ sẽ được phân bổ theo chính sách đã khóa trước trận.
- [ĐỀ XUẤT] Nếu trận bị hủy do lỗi hệ thống, hoàn điểm theo chính sách cố định, có ghi ledger (sổ giao dịch).
- [ĐỀ XUẤT] Tính thống kê: thắng = hạng nhất; thua = các trận không về nhất (kể cả bỏ cuộc); trận hủy kỹ thuật không tính thắng/thua; lưu cả hạng về nhì/ba/tư.

## 10. Hệ thống Admin

| Module | Chức năng |
| --- | --- |
| Users | Xem người chơi, trạng thái, khóa/mở khóa theo quyền |
| Avatar & Horse Skins | Quản lý bộ skin, vùng đặt avatar, asset/animation |
| Game Modes | Bật/tắt chế độ, gắn cấu hình luật và map được duyệt |
| Skills | Danh mục skill và phiên bản cân bằng; duyệt trước xuất bản |
| **Maps & Tiles** | **Tạo/sửa bản đồ Funny; đặt vị trí ô mìn/lựu đạn/may mắn/về chuồng; xem trước; publish phiên bản** |
| Tile Events | Loại sự kiện, thông số N/R, giới hạn kích hoạt, trọng số |
| Game Dialogues | CRUD câu thoại theo sự kiện/màu/mode, preview, bật/tắt |
| Rooms | Xem phòng đang chờ/đang đấu, tình trạng kết nối, dọn phòng lỗi |
| Wallets & Transactions | Số dư, lịch sử cộng/trừ, điều chỉnh có audit, chống ghi trùng |
| Daily Rewards | Mức thưởng ngày, thời gian áp dụng |
| Stake & Payout | Danh sách mức đặt hợp lệ, mẫu chia quỹ theo số người |
| Match History | Kết quả trận, thứ hạng, sự kiện, tình trạng xử thua |
| Audit Logs | Ai thay đổi luật/map/điểm/câu thoại, lúc nào, phiên bản nào |

- [ĐỀ XUẤT] Admin phân quyền rõ ràng: người chơi **không được tự ghi** số dư, kết quả, luật map/skill hoặc sửa nội dung Admin.
- [ĐỀ XUẤT] Với map/skill ảnh hưởng kết quả, thao tác Admin là **draft → preview → test → publish**; chỉ áp dụng vào ván mới.

## 11. Hướng kiến trúc kỹ thuật (chưa triển khai)

- [ĐÃ CHỐT trong định hướng] Frontend: **React + TypeScript + Vite**; deploy website tĩnh (GitHub Pages nếu khả dụng hoặc Cloudflare Pages với repo private).
- [ĐÃ CHỐT trong định hướng] Firebase để phục vụ online: Authentication, Firestore realtime; offline dùng Game Engine local, không yêu cầu Firebase.
- [ĐỀ XUẤT] Chia code: `Game Rules Engine` (pure TypeScript), `Room Service`, `Wallet Service`, `Event/Dialogue Manager`, `Map & Tile Engine`, `Skill Engine`, `UI Rendering`, `Admin`.
- [ĐỀ XUẤT] **Logic tin cậy phía server** xử lý xúc xắc, luật, hiệu ứng ngẫu nhiên, giữ/chia điểm, thưởng đăng nhập, kiểm tra mật khẩu phòng; Firestore transaction/rules **không đủ để tin** vào một client tự tung xúc xắc hoặc tự báo thắng.
- [ĐỀ XUẤT] Có thể dùng Cloud Functions hoặc backend tương đương; cần đánh giá giới hạn/free tier và chi phí trước khi thực hiện (một số cách triển khai yêu cầu gói thanh toán).
- [ĐỀ XUẤT] Event log có `matchId`, `turnIndex`, `actorId`, `ruleVersion`, `mapVersion`, `actionType`, `payload`, `serverTimestamp` để truy vết lỗi và replay.
- [ĐỀ XUẤT] Không công khai avatar riêng tư nếu người chơi không đồng ý; giới hạn kích thước/định dạng ảnh, xác thực upload, giảm ảnh/thumbnails, thiết lập chính sách xóa dữ liệu.

## 12. Danh sách màn hình cần thiết kế trước

1. Trang chủ / chọn Online hoặc Offline.
2. Đăng ký, đăng nhập, quên mật khẩu.
3. Hồ sơ cá nhân: avatar, nickname, đổi mật khẩu, điểm, thành tích.
4. Tùy chỉnh ngựa: Classic/Funny, preview avatar trên đầu ngựa.
5. Sảnh online: danh sách phòng, tìm kiếm, lọc phòng.
6. Tạo phòng: tên, mật khẩu, số người, mode, map, mức điểm, tỷ lệ thưởng.
7. Phòng chờ: danh sách người, màu, skin, trạng thái sẵn sàng, cấu hình đã khóa.
8. Bàn cờ Cơ bản: responsive, xúc xắc, quân ngựa, thoại, kết quả.
9. Bàn cờ Vui nhộn: skill, cooldown, bẫy mìn/lựu đạn, ô may mắn/về chuồng, hiệu ứng.
10. Dialog mất kết nối 60 giây; kết quả thắng/thua; lịch sử điểm.
11. Admin: quản lý câu thoại, bản đồ/ô, skill, điểm và phòng chơi.

## 13. Kế hoạch theo checklist (mới là ý tưởng, chưa đánh dấu hoàn thành)

### P0 — Chuẩn hóa yêu cầu

- [ ] Đối chiếu tài liệu này với `PLAN.md`/`CHECKLIST.md`, hợp nhất sau khi duyệt.
- [ ] Chốt toàn bộ biến thể luật chơi Cờ Cá Ngựa Việt Nam.
- [ ] Chốt công thức điểm và cách xử lý rời trận / xếp hạng.
- [ ] Chốt cơ chế chính xác của mìn, lựu đạn, ô may mắn/về chuồng và tương tác skill.

### P1 — Thiết kế UI/UX (ưu tiên đầu tiên)

- [ ] Thiết kế desktop + mobile cho Trang chủ / Login / Profile.
- [ ] Thiết kế skin Classic/Funny và avatar gắn trên đầu ngựa.
- [ ] Thiết kế sảnh, tạo phòng, phòng chờ, cấu hình mức điểm.
- [ ] Thiết kế bàn cờ Cơ bản và bàn cờ Vui nhộn, icon ô sự kiện, chú giải.
- [ ] Thiết kế modal đếm ngược 60 giây, màn hình kết quả và lịch sử điểm.
- [ ] Thiết kế wireframe Admin quản lý Dialogues + Maps & Tile Events.
- [ ] Duyệt prototype/flow trước khi viết code.

### P2 — Game Rules & Map Spec

- [ ] Đặc tả chuyển trạng thái Game Engine cho luật thường.
- [ ] Đặc tả danh sách skill, cooldown và giới hạn.
- [ ] Đặc tả map schema, danh sách tile và thứ tự xử lý sự kiện.
- [ ] Lập test case cho bẫy, ô may mắn, khiên, gần đích và chống hiệu ứng lặp.

### P3 — Triển khai sau khi duyệt (chưa thực hiện)

- [ ] Xây dựng UI React và Game Engine.
- [ ] Chạy hoàn chỉnh offline 2–4 người.
- [ ] Triển khai đăng nhập / Profile và backend tin cậy.
- [ ] Triển khai online, sảnh/phòng/điểm/dọn phòng.
- [ ] Xây dựng Admin động cho Dialogues, Skin, Maps, Skills.
- [ ] Kiểm thử, chống gian lận, tối ưu mobile, deploy.

## 14. Những quyết định đang chờ chốt

1. Luật xuất quân, đá quân, di chuyển, về chuồng/về đích phiên bản Việt Nam nào?
2. Ai quyết định skin Classic/Funny: mỗi người hay chủ phòng; có tùy chọn tắt avatar không?
3. Bẫy và lựu đạn: tác dụng, số ô ảnh hưởng, có hiển thị hay ẩn, có bảo vệ bằng khiên được không?
4. Ô may mắn: tiến N ô cố định, random hay Admin đặt theo từng map? Có kích hoạt dây chuyền không?
5. Map được chủ phòng chọn hay cả phòng bình chọn? Có cho chơi map tùy chỉnh khi có đặt điểm không?
6. Khi bỏ cuộc sau 60 giây: loại quân và tiếp tục, bot thay, hay kết thúc trận? Cách xử lý còn người chơi và quỹ thưởng?
7. Với 2/3 người: tỷ lệ thưởng theo thứ hạng nào? Điểm nguyên làm tròn ra sao?
8. Khi người chơi cùng lúc rớt mạng: thời gian chờ/xóa phòng và hoàn điểm theo nguyên tắc nào?

---

**Quy tắc làm việc:** Đây là tài liệu lưu ý tưởng. Chỉ đánh dấu `[x]` trên `CHECKLIST.md` sau khi công việc đã thực hiện và được duyệt. Những thay đổi luật/map/điểm phải được chốt bằng văn bản trước khi triển khai.