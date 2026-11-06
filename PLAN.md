# KẾ HOẠCH PHÁT TRIỂN — CỜ CÁ NGỰA WEB

> **Project:** `hanfun/parcheesi`  
> **Repository:** https://github.com/hanfun/parcheesi  
> **Ngày lập:** 05/11/2026  
> **Trạng thái:** ĐẶC TẢ / CHƯA TRIỂN KHAI THEO KẾ HOẠCH NÀY  
> **Ưu tiên hiện tại:** (1) Giao diện web → (2) Chốt luật chơi → (3) Bộ máy luật chơi → (4) Offline → (5) Online  
> **Nguyên tắc:** Chưa triển khai mã nguồn khi chưa duyệt bản thiết kế giao diện và bảng luật.

> **Theo dõi thực thi:** [CHECKLIST.md](./CHECKLIST.md) — danh sách task theo thứ tự, tiêu chí nghiệm thu và tiến độ. `PLAN.md` là tài liệu chiến lược/đặc tả; chỉ đánh dấu tiến độ thực tế trong `CHECKLIST.md`.

## 1. Mục tiêu và phạm vi

Xây dựng website **Cờ Cá Ngựa phiên bản Việt Nam** cho **2–4 người**:

- **Offline/local:** 2–4 người thay phiên trên **cùng một thiết bị**; không yêu cầu tài khoản, database hay Internet sau khi tải trang (nếu đã hỗ trợ cache/PWA thì có thể chạy khi mất mạng).
- **Online/multiplayer:** 2–4 người trên các thiết bị khác nhau, tham gia bằng mã phòng/link mời, đồng bộ trạng thái realtime.
- **Định hướng giao diện:** trực quan, đẹp, vui nhộn, hiện đại, dễ chơi trên điện thoại; không sao chép tài sản có bản quyền của game khác.
- **Nguyên tắc kỹ thuật:** cùng **một Game Rules Engine** cho offline và online; UI không chứa luật chơi; có thể thay thế nhà cung cấp realtime về sau.

### Ngoài phạm vi giai đoạn đầu

- Không phát triển AI/bot, bảng xếp hạng toàn hệ thống, vật phẩm, thanh toán, chat thoại, giải đấu.
- Không xây dựng backend Laravel/Node.js riêng trong giai đoạn thiết kế UI và offline.
- Không tích hợp Firebase khi chưa hoàn thành luật và kiểm thử offline.

## 2. Công nghệ dự kiến (chưa cần cài đặt ngay)

| Thành phần | Dự kiến | Vai trò |
|---|---|---|
| Web UI | React + TypeScript + Vite | SPA, responsive, component hóa |
| Styling | CSS variables + Tailwind CSS (tùy chọn) | Design system, theme, responsive |
| Bàn cờ | SVG / CSS Grid (chọn qua prototype) | Hiển thị ô, quân, điểm đi; dễ scale trên mobile |
| Hiệu ứng | CSS transitions; thư viện animation chỉ khi cần | Tung xúc xắc, di chuyển quân, ăn quân |
| State local | React state / reducer | Điều phối một ván offline |
| Logic | Pure TypeScript Game Rules Engine | Luật chung, không phụ thuộc React/Firebase |
| Online (sau) | Firebase Anonymous Auth + Cloud Firestore | Định danh ẩn danh, phòng chơi, realtime |
| Hosting | GitHub Pages khi repo public; Cloudflare Pages nếu repo private/GitHub Free | Deploy frontend tĩnh |
| Kiểm thử | Unit tests + component/E2E tests | Ngăn sai luật, bảo đảm luồng chơi |

> Chọn hosting sau; **repository private không đồng nghĩa game private**. Không đặt mật khẩu, service-account key hay khóa quản trị vào frontend. Cấu hình Firebase Web App công khai không phải khóa bí mật; an toàn phụ thuộc Auth + Security Rules.

## 3. Giai đoạn 0 — Chốt yêu cầu và bản luật (ưu tiên số 1, thực hiện song song với thiết kế UI)

### 3.1. Phiên bản luật được chọn

Phải xác định game mô phỏng **Cờ Cá Ngựa Việt Nam**, **không tự mặc định áp dụng luật Ludo/Parcheesi quốc tế**. Có nhiều biến thể theo bộ cờ/địa phương.

Đề xuất tạo một **Ruleset `vietnamese-classic-v1`** với tham số rõ ràng, có thể bổ sung luật khác mà không thay đổi cấu trúc game.

### 3.2. Các luật đã thống nhất về mặt mục tiêu

1. Có 2–4 người, mỗi người một màu, tối đa 4 quân/người.
2. Mỗi lượt tung xúc xắc, chỉ người đang đến lượt được hành động.
3. Di chuyển quân theo một tuyến đường cố định đã vẽ trên bàn cờ; hiển thị ô đi hợp lệ.
4. Có cơ chế xuất quân, đi quân, đá quân, bị cản, vào chuồng/đích và chiến thắng.
5. Người chơi chỉ được thực hiện các hành động hợp lệ; hết lựa chọn hợp lệ thì tự xử lý chuyển lượt theo luật đã chốt.
6. Chế độ offline và online phải dùng cùng một bộ quy tắc.

### 3.3. Luật mặc định **đề xuất, cần duyệt trước khi lập trình**

| Tình huống | Đề xuất cho bản Việt Nam | Trạng thái |
|---|---|---|
| Xúc xắc | 1 viên, số 1–6 | Cần chốt |
| Xuất quân | Tung **1 hoặc 6** được chọn xuất 1 quân; có thể có biến thể **chỉ 6** | Cần chốt |
| Đi thêm lượt | Tung **6** được thêm một lần tung, sau khi xử lý hành động; cần xác định khi không có nước hợp lệ | Cần chốt |
| Chọn quân | Nếu có nhiều nước hợp lệ, người chơi chọn đúng một quân hoặc xuất một quân | Cần chốt |
| Hướng đi | Một chiều thống nhất, lộ trình riêng theo màu | Cần chốt trên sơ đồ ô |
| Đá quân | Dừng đúng ô có quân đối thủ thì đối thủ quay về khu xuất phát, trừ ngoại lệ đã quy định | Cần chốt |
| Cản đường | Không đi xuyên quân cản nếu luật Việt Nam đã chọn quy định cản | Cần chốt |
| Ô an toàn | Chỉ bật nếu bộ bàn cờ có ký hiệu/luật ô an toàn; **không tự thêm mặc định** | Cần chốt |
| Hai quân cùng ô | Quy định cụ thể cho cùng màu/khác màu, điểm xuất phát, ô an toàn | Cần chốt |
| Về đích | Hoàn thành vòng và vào dãy số chuồng **1–6**, theo quy định đúng số | Cần chốt |
| Xếp chuồng | Xem xét luật truyền thống đạt lần lượt các vị trí **6, 5, 4, 3** | Cần chốt |
| Thắng cuộc | Người đầu tiên đưa 4 quân đến vị trí đích hợp lệ | Cần chốt |
| Thứ hạng | Có tiếp tục chơi lấy hạng 2–4 hay kết thúc ngay khi có người thắng? | Cần chốt |
| Bắt đầu ván | Chủ phòng chọn màu/số người; xác định người đi đầu bằng ngẫu nhiên hoặc gieo điểm cao | Cần chốt |
| Hết thời gian (online) | Không áp dụng ở bản offline; cấu hình timer ở bản online sau | Để sau |

**Quan trọng:** “chuồng” có thể dùng để gọi **khu 4 quân chưa xuất phát** hoặc **đường đích đánh số 1–6**. Trong giao diện/logic cần định danh tách biệt: `base` (khu chờ), `track` (đường chạy), `homeLane` (đường về), `finished` (hoàn tất).

### 3.4. Sơ đồ đường đi phải được nghiệm thu

- [ ] Chốt lưới bàn cờ, số ô trên đường chính và số ô dẫn vào đích dựa trên **mẫu Cờ Cá Ngựa Việt Nam** đã duyệt; không suy đoán theo bàn Ludo quốc tế.
- [ ] Đánh mã ID duy nhất cho từng ô, không phụ thuộc tọa độ hiển thị.
- [ ] Xác định 4 ô xuất phát, 4 điểm rẽ vào đường đích, vị trí ô đặc biệt/an toàn.
- [ ] Minh họa lộ trình đầy đủ của **1 quân cho mỗi màu** trên bàn mẫu.
- [ ] Chốt luật khi quân sắp vào chuồng nhưng gieo quá số, đường đi bị chắn, ô đích đã có quân.
- [ ] Viết bảng ví dụ nước đi hợp lệ và không hợp lệ được người phụ trách duyệt.

### 3.5. Ma trận tình huống bắt buộc để chốt luật

- [ ] Không có quân trên bàn, tung 1 / 2 / 6.
- [ ] Có quân đang chạy, tung 1 hoặc 6: xuất quân mới hay đi quân cũ.
- [ ] Tung 6 liên tiếp và không còn nước hợp lệ.
- [ ] Đi đúng vào ô đối thủ → đá; đi vượt ô có đối thủ → được phép hay bị cản.
- [ ] Ô xuất phát đang có quân mình/đối thủ.
- [ ] Hai quân cùng màu gặp nhau; trường hợp bị chặn đường.
- [ ] Quân đi hết một vòng và rẽ vào chuồng, đi đúng số, đi quá số.
- [ ] Quân đang ở dãy chuồng 1–6; cách tiến đến vị trí đích; ô đích có quân khác.
- [ ] Một người đã hoàn thành 4 quân: thứ tự người thắng và xử lý lượt còn lại.
- [ ] Trường hợp toàn bộ quân không thể đi: thông báo và chuyển lượt.

**Đầu ra giai đoạn 0:** tài liệu luật đã duyệt + bản đồ các ô + bảng ví dụ tình huống, đủ làm tiêu chuẩn để lập trình và kiểm thử.

## 4. Giai đoạn 1 — Xây dựng bộ giao diện web (ưu tiên triển khai đầu tiên)

**Mục tiêu:** giao diện tĩnh/interactive prototype hoàn chỉnh để duyệt UX, **chưa cần kết nối Firebase và chưa cần luật hoạt động**.

### 4.1. Bộ thiết kế (Design System)

- [ ] Phong cách vui tươi, hiện đại, dễ nhận biết cho trẻ em và người lớn; tránh quá nhiều hiệu ứng gây rối.
- [ ] 4 màu người chơi **Đỏ / Xanh dương / Vàng / Xanh lá**, phân biệt thêm bằng biểu tượng/họa tiết, không chỉ dựa vào màu.
- [ ] Thiết kế font, cỡ chữ, spacing, bo góc, shadow, icon, sound và trạng thái button.
- [ ] Tạo light theme làm mặc định; chuẩn bị khả năng thêm dark theme.
- [ ] Quân ngựa dạng SVG/vector có 4 màu và trạng thái: ở nhà, có thể chọn, đang đi, bị đá, đã về đích.
- [ ] Xúc xắc có đủ 6 mặt và trạng thái: chờ, đang tung, kết quả.
- [ ] Animation di chuyển ô-tới-ô, highlight nước đi, rung nhẹ/âm thanh khi đá quân; tắt âm thanh được.
- [ ] Bàn cờ không méo khi thay đổi kích thước màn hình; vùng tương tác đủ lớn cho chạm tay.
- [ ] Hiển thị cách chơi ngắn ngay trong trang game; hỗ trợ bàn phím ở những tương tác phù hợp.

### 4.2. Danh sách màn hình cần thiết

| Màn hình | Thành phần UI | Ưu tiên |
|---|---|---|
| **Trang chủ** | Logo/tên game, **Chơi cùng máy**, **Chơi online**, **Luật chơi**, cài đặt âm thanh | P0 |
| **Thiết lập offline** | Chọn 2/3/4 người, tên, màu, luật chơi (nếu có nhiều biến thể) | P0 |
| **Bàn cờ** | Bàn 4 màu; 4 khu chờ; đường chạy; đường về; 16 quân; xúc xắc; danh sách người; lượt hiện tại; nút menu | P0 |
| **Hướng dẫn** | Hình bàn cờ, cách xuất quân, đi, đá, về chuồng, ví dụ minh họa | P0 |
| **Kết thúc ván** | Người thắng, thứ hạng (nếu áp dụng), chơi lại, về trang chủ | P0 |
| **Tạo phòng online** | Tên, chọn chế độ chơi/số người, tạo phòng, share link/mã phòng | P1 |
| **Tham gia phòng** | Nhập mã phòng, tên hiển thị, trạng thái tải/kết nối/lỗi | P1 |
| **Phòng chờ** | Thành viên, màu, trạng thái sẵn sàng, chủ phòng bắt đầu | P1 |
| **Kết nối lại / người rời phòng** | Trạng thái mất mạng, đang đồng bộ, khôi phục, rời ván | P1 |

`P0` = phải làm trước khi sang phát triển logic; `P1` = làm khi bắt đầu online.

### 4.3. Bố cục theo thiết bị

**Desktop (>= 1024 px)**
- Bàn cờ giữ tỉ lệ 1:1 ở trung tâm/trái; bên cạnh là khung lượt chơi, xúc xắc, người chơi và hướng dẫn hành động.
- Không cần cuộn trang để nhìn toàn bộ bàn cờ ở viewport phổ biến.

**Tablet (768–1023 px)**
- Ưu tiên bàn cờ; điều khiển đặt bên dưới hoặc bên cạnh tùy hướng màn hình.

**Mobile (< 768 px)**
- Bàn cờ full-width, tỷ lệ 1:1, không tràn màn hình ngang.
- Tên/lượt chơi + xúc xắc + nút hành động nằm gần bàn cờ, dễ chạm một tay.
- Dùng bottom sheet/dialog cho menu, luật và xác nhận thoát.
- Kiểm tra iOS Safari, Chrome Android; hỗ trợ portrait và landscape.

### 4.4. Trạng thái UI cần mô phỏng trong prototype

- [ ] Chờ người chơi tung xúc xắc.
- [ ] Xúc xắc đang quay / hiện kết quả.
- [ ] Có 1 hoặc nhiều quân được phép chọn (highlight rõ ràng).
- [ ] Đang chạy animation bước đi.
- [ ] Có hành động đá quân, không có nước đi hợp lệ.
- [ ] Chuyển lượt, người thắng cuộc.
- [ ] Trên online: đang chờ đối thủ, mất kết nối, phòng không tồn tại.

**Tiêu chí nghiệm thu UI:** mở được trên desktop/mobile; đủ màn hình P0; bàn cờ chính xác về mặt hình học theo luật; người dùng nhìn biết ai đang đi và phải bấm gì; mock interaction không cần backend.

## 5. Giai đoạn 2 — Đặc tả và xây Game Rules Engine

> Chỉ bắt đầu sau khi **mẫu bàn cờ và bảng luật được duyệt**.

- [ ] Tách dữ liệu ô cờ (graph/lộ trình) khỏi tọa độ SVG/CSS.
- [ ] Thiết kế `GameState`: players, pieces, activePlayer, phase, dice, turn, status, winner/rank.
- [ ] Định nghĩa `Action`: roll dice, deploy piece, move piece, skip/advance turn, restart (tùy luật).
- [ ] Game Engine thuần TypeScript: validate action → tính hợp lệ → áp dụng action → trả state mới + game events.
- [ ] Tách random dice khỏi engine để test bằng số cố định và về sau sử dụng kết quả do server kiểm soát.
- [ ] UI render từ state, không tự quyết định quân nào được đi/đá/về đích.
- [ ] Viết unit tests cho **mọi tình huống ở §3.5**, bao gồm tình huống cạnh tranh và kết thúc ván.
- [ ] Trạng thái game có thể serialize/deserialize để lưu và đồng bộ.

**Tiêu chí nghiệm thu:** engine đúng luật đã duyệt, deterministic (cùng state + action + số xúc xắc → cùng kết quả), kiểm thử tự động vượt qua, không phụ thuộc React/Firebase.

## 6. Giai đoạn 3 — Hoàn thiện chơi offline trên cùng thiết bị

- [ ] Liên kết UI thật với Game Engine.
- [ ] Chơi 2/3/4 người, luân phiên đúng lượt.
- [ ] Chỉ hiện/hỗ trợ thao tác hợp lệ; khóa thao tác khi đang animation.
- [ ] Xử lý tung, xuất, đi, đá, cản, về đích, kết thúc.
- [ ] Tạm dừng/tiếp tục/chơi lại; xác nhận nếu bỏ ván.
- [ ] Có thể lưu trận tạm vào localStorage (tùy chọn).
- [ ] Kiểm thử E2E các luồng hoàn chỉnh ở desktop/mobile.

**Mốc phát hành đầu tiên:** người dùng **chơi trọn một ván offline 2–4 người** từ trang chủ đến màn hình thắng cuộc.

## 7. Giai đoạn 4 — Multiplayer online với Firebase (chỉ sau offline)

- [ ] Tạo Firebase Project, bật Firestore và Anonymous Auth.
- [ ] Tạo phòng (2–4 người), mã phòng không dễ đoán, link mời, phòng chờ.
- [ ] Chủ phòng cấu hình và bắt đầu ván; mỗi người giữ một màu.
- [ ] Đảm bảo chỉ người đúng lượt mới gửi lệnh; trạng thái version/revision chống ghi đè đồng thời.
- [ ] Firestore listener để đồng bộ trạng thái và xử lý reconnect.
- [ ] Firestore Security Rules giới hạn thành viên phòng và những thay đổi được phép.
- [ ] Quy định chủ phòng thoát, người chơi thoát, hết hạn phòng, xóa dữ liệu phòng cũ.
- [ ] Không tin giá trị xúc xắc/nước đi do trình duyệt tự khai báo: **MVP có thể chấp nhận tin cậy có giới hạn**, nhưng online chống gian lận thực sự cần thành phần backend đáng tin cậy xác thực xúc xắc/nước đi (ví dụ Cloud Functions/Cloud Run, cân nhắc phí/gói).
- [ ] Thử nghiệm 2–4 trình duyệt/thiết bị, thao tác đồng thời, offline-reconnect, refresh, đóng tab.
- [ ] Theo dõi số lượt đọc/ghi Firestore để tránh vượt gói Spark.

## 8. Giai đoạn 5 — Triển khai và hoàn thiện

- [ ] Chọn public GitHub Pages hoặc private repo + Cloudflare Pages tùy yêu cầu bảo mật/mức phí.
- [ ] Tạo CI build/test; chỉ deploy khi kiểm thử đạt.
- [ ] Cấu hình base path Vite đúng môi trường; SPA routing phải phù hợp hosting tĩnh.
- [ ] Tách cấu hình dev/prod; giới hạn domain Firebase Auth; không commit secrets.
- [ ] Kiểm tra bảo mật Firestore Rules và lượt đọc/ghi bất thường.
- [ ] Kiểm tra hiệu năng điện thoại phổ thông, bundle, accessibility, animation.
- [ ] Viết hướng dẫn sử dụng, hướng dẫn dev/deploy và checklist release.

## 9. Backlog có thứ tự ưu tiên

| Thứ tự | Nhóm việc | Đầu ra kỳ vọng | Trạng thái |
|---:|---|---|---|
| 1 | **Chốt luật Cờ Cá Ngựa Việt Nam** | Ruleset v1 + danh sách biến thể/tình huống | Chưa bắt đầu |
| 2 | **Wireframe UI desktop + mobile** | Trang chủ, bàn cờ, popup, thiết lập | Chưa bắt đầu |
| 3 | **Thiết kế hình học bàn cờ & quân** | SVG/grid chuẩn + đường đi từng màu | Chưa bắt đầu |
| 4 | **Prototype giao diện UI** | Demo thao tác giả, không backend | Chưa bắt đầu |
| 5 | **Review/duyệt luật + UI** | Checkpoint trước khi code logic | Chưa bắt đầu |
| 6 | Game Rules Engine + tests | Logic tái sử dụng, deterministic | Chưa bắt đầu |
| 7 | Offline 2–4 người | Có thể chơi hết một ván | Chưa bắt đầu |
| 8 | Firebase room + online sync | 2–4 thiết bị chơi chung | Chưa bắt đầu |
| 9 | Security/test/deploy | Website public ổn định | Chưa bắt đầu |

## 10. Cấu trúc thư mục dự kiến (chỉ là kế hoạch)

```text
parcheesi/
├── docs/
│   ├── RULES.md             # Luật chính thức sau khi duyệt
│   ├── UI-SPEC.md           # Design system, danh sách màn hình
│   ├── BOARD-MAP.md         # Bản đồ ID ô, đường đi của 4 màu
│   └── TEST-CASES.md        # Tình huống và tiêu chí nghiệm thu
├── src/
│   ├── app/                 # Routes, providers, global UI state
│   ├── components/          # Các UI component dùng lại
│   ├── features/
│   │   ├── home/
│   │   ├── game-board/
│   │   ├── offline/
│   │   └── online/
│   ├── game-engine/         # Pure TS rules, moves, board model
│   ├── services/            # Firebase transport ở giai đoạn 4
│   ├── assets/              # SVG, icon, sound
│   └── styles/              # Design tokens/theme
├── tests/
├── PLAN.md
├── CHECKLIST.md
└── README.md
```

## 11. Quyết định cần xác nhận trước khi phát triển engine

- [ ] Chọn luật **xuất quân 1 hoặc 6** hay **chỉ 6**.
- [ ] Luật **thêm lượt khi tung 6**; có giới hạn tung 6 liên tiếp không.
- [ ] Có áp dụng **cản đường** hay cho vượt quân khác.
- [ ] Có **ô an toàn** không; những ô nào.
- [ ] Cách xử lý **quân cùng màu cùng ô** / ô xuất phát có quân.
- [ ] Chuồng về đích dùng **dãy 1–6**, và có yêu cầu xếp **6/5/4/3** theo thứ tự hay không.
- [ ] Luật vào chuồng khi gieo **quá số**; quân đang ở chuồng có được di chuyển tiếp không.
- [ ] Thắng ngay khi hoàn tất 4 quân hay chơi tiếp để phân hạng.
- [ ] Bàn cờ tham chiếu cuối cùng (ảnh/sơ đồ) để vẽ đúng lộ trình.

## 12. Định nghĩa hoàn thành (Definition of Done) giai đoạn ưu tiên

**Giai đoạn giao diện và luật chỉ được đánh dấu hoàn thành khi:**

1. Có ảnh/wireframe duyệt của desktop và mobile cho các màn hình P0.
2. Có bản SVG/thiết kế bàn cờ đủ 4 màu, vị trí quân, lộ trình và ô đích rõ ràng.
3. Có một bộ quy tắc Việt Nam v1 không mâu thuẫn, bao gồm tất cả tình huống ở §3.5.
4. Có đặc tả UI các trạng thái tung xúc xắc/di chuyển/đá quân/về đích.
5. Danh sách điểm chưa rõ được chuyển thành quyết định chính thức, không để developer tự đoán.

---

### Tài liệu tham khảo về biến thể luật (để đối chiếu, không tự coi là nguồn luật duy nhất)

- https://zalopay.vn/co-ca-ngua-8164
- https://www.elanafreeland.com/cach-choi-co-ca-ngua/

> **Ghi chú:** Những nguồn tham khảo có thể mô tả khác nhau về luật xuất quân, cản quân và xếp chuồng. Quy tắc chính thức của game là **bộ luật đã được duyệt trong `docs/RULES.md`**, không phải bản tóm tắt trên website ngoài.