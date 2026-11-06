# AUDIO-SPEC — Hệ thống âm thanh & lộ trình triển khai Cờ Cá Ngựa

> **Dự án:** [hanfun/parcheesi](https://github.com/hanfun/parcheesi)  
> **Ngày lập:** 06/11/2026  
> **Phiên bản:** `audio-spec-v0.1` — **đặc tả/chờ duyệt**, chưa có file âm thanh thật  
> **Tham chiếu:** [`PLAN.md`](../PLAN.md) · [`CHECKLIST.md`](../CHECKLIST.md) · [`GAME_CONCEPT.md`](../GAME_CONCEPT.md) · [`docs/UI-PROTOTYPE.md`](./UI-PROTOTYPE.md) · [`mockups/approved-chibi-3d-avatar.webp`](../mockups/approved-chibi-3d-avatar.webp)

## 0. Mục tiêu và trạng thái

Thiết kế âm thanh **dễ thương, trong trẻo, dí dỏm, phù hợp chibi 3D / game gia đình**, **không mang phong cách máy đánh bạc/casino**. Sound design nhất quán giữa web desktop và mobile, ưu tiên **màn chơi dọc (portrait)**, có thể chơi im lặng. Không phụ thuộc âm thanh để hiểu luật hoặc trạng thái.

Quy ước:
- **[ĐÃ CHỐT]**: hai chế độ **Cơ bản** và **Vui nhộn**; map vui có bẫy/may mắn/về chuồng; ngựa gắn avatar; chat và âm thanh là **yêu cầu cần thiết cho game hoàn chỉnh** theo thảo luận gần nhất. Chế độ Cơ bản **không có** trap/skill.
- **[ĐỀ XUẤT]**: bản nhạc, cụ thể hóa hiệu ứng, tên và số lượng asset, độ dài/cường độ, voice/TTS, công nghệ audio. Mọi giá trị dưới đây là **giá trị mặc định để triển khai thử**, chỉnh sau khi người dùng duyệt.
- **[CẦN CHỐT]**: bộ luật cụ thể; loại bẫy và tác động, điều kiện/khoảng thời gian cooldown, thứ tự hiệu ứng; các nội dung này nằm trong `GAME_CONCEPT.md` và đặc tả luật sau này.

**Hiện trạng 06/11/2026:** đã có HTML prototype, mockup, dice UI; **chưa** có audio engine, file nhạc/SFX, đồng bộ âm thanh online, logic game hoặc chat thật. Không tích `[x]` như thể tính năng đã hoàn thành.

## 1. Bản đồ màn hình → loại âm thanh

| Màn hình / ngữ cảnh | Âm thanh gắn với chức năng | Ưu tiên |
|---|---|---|
| Splash / vào web | Nhạc nền menu **chỉ khi đã được người dùng cho phép**; `ui.open` nhẹ | P1 |
| Đăng ký / đăng nhập | `ui.tap`, `ui.success`, `ui.error` khi có kết quả **thật**; không giả lập âm thanh xác thực thành công | P1 |
| Trang chủ | Nhạc `music.menu`; nút Chơi ngay/Tạo phòng; mở panel | P1 |
| Danh sách phòng | `ui.tab`, `ui.select`, `room.join`, `room.error` | P1 |
| Tạo phòng / cấu hình | `ui.toggle`, `ui.select`, `room.create`; không có tiếng xu/đồng tiền gợi casino | P1 |
| Chọn map | `map.preview`, `map.confirm`, biến thể ambience theo theme (đề xuất) | P1/P2 |
| Phòng chờ | `room.player_join`, `room.player_leave`, `room.ready`, `room.countdown`, `room.start` | P1 |
| Trong trận Cơ bản | `game.turn_start`, `dice.roll`, `dice.land`, `horse.step`, `horse.kick`, `horse.home`, `game.win/lose`; `music.game_basic` | **P0** |
| Trong trận Vui nhộn | Toàn bộ âm cơ bản + `trap.*`, `lucky.*`, `skill.*`, `emote.*`, `music.game_fun` | **P1** |
| Chat chữ / emoji | `chat.message_in`, `chat.mention`, `chat.emoji`; thông báo mute riêng | P1 |
| Mất kết nối / reconnect | `network.disconnected`, `network.reconnected`, `network.timeout`; phần mất mạng **60 giây** đã thống nhất | P1 |
| Kết quả / xếp hạng | `result.win`, `result.rank`, `result.lose`, `ui.reward` (chỉ khi điểm được xác nhận) | P1 |
| Profile / tùy chọn | `ui.select`, `ui.save`, `ui.error`, `ui.avatar_update` | P2 |
| Admin quản lý câu thoại/map | Âm giao diện rất nhẹ; **không** tự phát âm thanh của người chơi ở trang admin | P3 |

## 2. Quy ước tên asset, ID và nguồn phát

- ID sự kiện **ổn định, dạng `namespace.action`**, không chứa tên file, dùng xuyên UI, animation và analytics. Ví dụ: `dice.land`.
- Asset đề xuất lưu dưới `public/audio/` khi chuyển sang React/Vite; trong prototype HTML thuần có thể đặt `assets/audio/`. **Không tạo file âm thanh giả/không tồn tại chỉ để hoàn thành checklist.**
- Nhạc: `music/*.mp3`; hiệu ứng: `sfx/{group}/*.mp3`; có thể bổ sung bản `*.ogg`/`*.opus` nếu kiểm thử trình duyệt cho phép. MP3 là định dạng dự phòng rộng rãi (đặc biệt Safari/iOS). Trình phát chọn nguồn thực sự được hỗ trợ.
- Ghi vào manifest mã/JSON: `eventId`, `source`, `category`, `volume`, `loop`, `cooldownMs`, `maxInstances`, `priority`, `subtitle`, `enabledInModes`.
- **Một event có nhiều biến thể** đặt hậu tố `-01`, `-02`, ... để chống lặp nhàm chán: `horse-step-01.mp3`, `horse-step-02.mp3`. Ngẫu nhiên **chỉ** chọn biến thể âm thanh, không ảnh hưởng game engine.
- Độ dài và âm lượng phía dưới là **target đề xuất**, không phải yêu cầu cứng. Tránh clipping, cân bằng âm lượng cảm nhận giữa thiết bị.

### 2.1. Danh mục âm thanh UI / điều hướng

| ID sự kiện | Tên file đề xuất | Khi phát (sau action thành công nếu có điều kiện) | Mô tả âm | Mức |
|---|---|---|---|---|
| `ui.tap` | `sfx/ui/tap-soft.mp3` | Chạm nút thường, không phát lặp với `ui.select` cùng thao tác | Cạch gỗ nhỏ, rất nhẹ | P1 |
| `ui.select` | `sfx/ui/select-pop.mp3` | Chọn radio/chế độ/map/card | Pop sáng, ngắn | P1 |
| `ui.toggle` | `sfx/ui/toggle.mp3` | Bật/tắt âm, spectator... (tôn trọng mute ngay tức thì) | Tích nhẹ | P2 |
| `ui.open` | `sfx/ui/panel-open.mp3` | Mở popup/chi tiết | Chuông 2 nốt ngắn | P2 |
| `ui.close` | `sfx/ui/panel-close.mp3` | Đóng popup | Swish nhỏ | P2 |
| `ui.success` | `sfx/ui/success.mp3` | Lưu profile, xác thực thành công **thật** | Giai điệu 2–3 nốt | P1 |
| `ui.error` | `sfx/ui/error-soft.mp3` | Validation/error | Bụp mềm, không chói | P1 |
| `ui.avatar_update` | `sfx/ui/avatar-sparkle.mp3` | Avatar cập nhật thành công | Lấp lánh ngắn | P2 |
| `ui.reward` | `sfx/ui/reward-star.mp3` | Backend xác nhận thưởng điểm/ngày | Sao leng keng; **không gợi coin slot** | P2 |

### 2.2. Danh mục âm thanh phòng chơi / realtime

| ID sự kiện | Tên file đề xuất | Trigger thực tế | Mô tả | Mức |
|---|---|---|---|---|
| `room.create` | `sfx/room/create.mp3` | Server/host xác nhận tạo phòng | Pop chào mừng | P1 |
| `room.join` | `sfx/room/join.mp3` | Bản thân vào phòng thành công | Đóng cửa gỗ nhẹ | P1 |
| `room.player_join` | `sfx/room/player-join.mp3` | Có người khác vào phòng | “Ding” chào | P1 |
| `room.player_leave` | `sfx/room/player-leave.mp3` | Người khác rời | “Bop” nhẹ | P1 |
| `room.ready` | `sfx/room/ready.mp3` | Ready từ false → true | Chuông xanh tích cực | P1 |
| `room.unready` | `sfx/room/unready.mp3` | Ready từ true → false | Tick trầm | P2 |
| `room.countdown` | `sfx/room/countdown-tick.mp3` | Countdown chuẩn bị bắt đầu, tối đa 1 lần/giây | Tick gỗ rất nhẹ | P1 |
| `room.start` | `sfx/room/start-fanfare.mp3` | Server báo trận bắt đầu | Fanfare 1–2 giây | P1 |
| `room.error` | `sfx/room/room-error.mp3` | Sai mật khẩu / đủ người / không thể vào | Bụp mềm | P1 |

### 2.3. Danh mục âm thanh gameplay chung (Cơ bản và Vui nhộn)

| ID sự kiện | Tên file đề xuất | Gắn vào hành động/animation | Thời lượng target | Mức |
|---|---|---|---|---|
| `game.turn_start` | `sfx/game/turn-start.mp3` | Đến lượt bản thân (không phát nếu đang replay lịch sử) | 0.25–0.5s | P0 |
| `game.turn_ending` | `sfx/game/turn-warning.mp3` | Ví dụ còn 5s, **một lần/lượt**, chỉ khi timer đã chốt | 0.2–0.4s | P2 |
| `dice.roll` | `sfx/game/dice-roll.mp3` | Bắt đầu animation tung xúc xắc | 0.6–1.2s | P0 |
| `dice.bounce` | `sfx/game/dice-bounce.mp3` | Xúc xắc chạm mặt bàn (nếu animation có bounce) | 0.1–0.3s | P1 |
| `dice.land` | `sfx/game/dice-land.mp3` | Animation lắc kết thúc và hiển thị **kết quả server/engine** | 0.2–0.5s | P0 |
| `dice.special_roll` | `sfx/game/dice-special.mp3` | Chỉ khi luật xác nhận một lần tung đặc biệt (ví dụ được đi tiếp) | 0.5–1.0s | P2 |
| `horse.deploy` | `sfx/horse/deploy.mp3` | Quân được xuất chuồng theo engine | 0.2–0.5s | P0 |
| `horse.step` | `sfx/horse/hoof-01..03.mp3` | **Mỗi bước/nhịp nhảy hoàn tất** trên ô, throttle theo animation | 0.1–0.25s | P0 |
| `horse.move_finish` | `sfx/horse/stop.mp3` | Kết thúc di chuyển n bước | 0.15–0.4s | P1 |
| `horse.kick` | `sfx/horse/bonk.mp3` | **Engine** xác nhận đá quân đối thủ | 0.35–0.8s | P0 |
| `horse.return_home` | `sfx/horse/return-home.mp3` | Quân quay về chuồng do bị đá/trap (nếu có) | 0.4–0.9s | P1 |
| `horse.goal_progress` | `sfx/horse/goal-step.mp3` | Quân tiến vào hành lang đích | 0.2–0.5s | P1 |
| `horse.finish` | `sfx/horse/finish-cheer.mp3` | Một quân hoàn tất về đích | 0.7–1.4s | P0 |
| `game.no_valid_move` | `sfx/game/no-move.mp3` | Server/engine xác nhận không có nước đi | 0.2–0.5s | P1 |
| `game.win` | `sfx/result/win-fanfare.mp3` | Kết quả thắng **đã chốt** | 2–4s | P0 |
| `game.lose` | `sfx/result/lose-soft.mp3` | Thua đã xác nhận | 1–2s | P1 |
| `game.rank` | `sfx/result/rank-reveal.mp3` | Hiện bảng xếp hạng sau ván | 0.6–1.5s | P1 |

**Quy tắc sequencing bắt buộc:** `dice.roll` → (animation xoay/bounce) → `dice.land` → (người dùng chọn quân hoặc engine xử lý) → `horse.deploy`/`horse.step` → (va chạm) `horse.kick`/`horse.return_home` → `game.turn_start` ở lượt tiếp. Không phát SFX trước khi có kết quả hợp lệ từ engine/server. Khi tua nhanh / reconnect / khôi phục trạng thái chỉ phát **âm trạng thái mới phù hợp**, không replay hàng chục tiếng bước ngựa.

### 2.4. Danh mục âm thanh chỉ có ở mode Vui nhộn

| ID sự kiện | Tên file đề xuất | Trigger / liên kết animation | Ghi chú luật | Mức |
|---|---|---|---|---|
| `trap.mine_trigger` | `sfx/trap/mine-alert.mp3` | Bước vào ô mìn | Chờ chốt vị trí ô | P1 |
| `trap.mine_explode` | `sfx/trap/mine-pop.mp3` | Mìn hoạt hình nổ **sau xác nhận trigger** | Tiếng “bụp” hoạt hình, không bạo lực | P1 |
| `trap.grenade_throw` | `sfx/trap/grenade-whoosh.mp3` | Animation lựu đạn bay | Chỉ có nếu thiết kế chốt hành động ném | P2 |
| `trap.grenade_explode` | `sfx/trap/grenade-pop.mp3` | Lựu đạn hoạt hình phát nổ | Nhẹ, không tiếng súng/thật | P1 |
| `tile.lucky` | `sfx/tile/lucky-chimes.mp3` | Ô may mắn kích hoạt | Không quy định số ô tiến | P1 |
| `tile.boost` | `sfx/tile/boost-swoosh.mp3` | Hiệu ứng tăng tốc | Không quy định số bước | P1 |
| `tile.backwards` | `sfx/tile/backwards.mp3` | Ngựa bị lùi ô (nếu có) | **Đề xuất** | P2 |
| `tile.return_home` | `sfx/tile/home-portal.mp3` | Ô đưa quân về chuồng | Luật tác động cần chốt | P1 |
| `tile.teleport` | `sfx/tile/teleport-warp.mp3` | Dịch chuyển (nếu chốt) | **Đề xuất** | P2 |
| `tile.mystery` | `sfx/tile/mystery-spin.mp3` | Ô bí ẩn quay / dừng | **Đề xuất** | P2 |
| `tile.clover_shield` | `sfx/tile/clover-bell.mp3` | Nhận miễn bẫy / lá chắn (nếu có) | **Đề xuất** | P2 |
| `skill.activate` | `sfx/skill/activate.mp3` | Kỹ năng hợp lệ được kích hoạt | Không phát nếu bị từ chối | P1 |
| `skill.shield` | `sfx/skill/shield.mp3` | Kích hoạt lá chắn màu xanh (đề xuất) | Cooldown cần chốt | P1 |
| `skill.shield_block` | `sfx/skill/shield-block.mp3` | Lá chắn đỡ đòn | Pha va chạm tách riêng | P2 |
| `skill.speed` | `sfx/skill/speed.mp3` | Tăng tốc màu đỏ (đề xuất) | Số bước chưa chốt | P1 |
| `skill.hop` | `sfx/skill/hop.mp3` | Nhảy xa màu xanh lá (đề xuất) | Số bước chưa chốt | P1 |
| `skill.reroll` | `sfx/skill/reroll.mp3` | Tung lại màu vàng (đề xuất) | Điều kiện chưa chốt | P1 |
| `skill.cooldown_ready` | `sfx/skill/cooldown-ready.mp3` | Hết hồi skill của **bản thân** | Phát 1 lần, không spam | P2 |
| `emote.kicked` | `sfx/emote/horse-squeak-01..03.mp3` | Horse bị đá + bubble text từ Admin | Không đọc nội dung chat bằng TTS mặc định | P1 |
| `emote.cheer` | `sfx/emote/cheer-01..02.mp3` | Emote cười / cổ vũ | Phân biệt event với chat | P2 |

**Thứ tự ví dụ:** `horse.step` → `trap.mine_trigger` → (cảnh báo 0.2s) → `trap.mine_explode` → `horse.return_home` **hoặc** `tile.return_home`, tùy engine; **không** nổ nhiều lần nếu hiệu ứng lan/chaining chưa được duyệt. `skill.shield` + `skill.shield_block` không được phát chung lúc nhận skill và lúc đỡ đòn.

### 2.5. Chat, kết nối, phần thưởng và kết quả

| ID sự kiện | File đề xuất | Trigger | Điều kiện chống phiền | Mức |
|---|---|---|---|---|
| `chat.message_in` | `sfx/chat/new-message.mp3` | Tin nhắn **khác người gửi** | Không phát với tin của mình; throttle ≥ 1.5s | P1 |
| `chat.mention` | `sfx/chat/mention.mp3` | Tin nhắn nhắc tên người dùng (nếu làm) | Có thể ưu tiên hơn message_in | P2 |
| `chat.emoji` | `sfx/chat/emoji.mp3` | Emoji/emote trên bàn cờ | Throttle 2s/người gửi | P2 |
| `chat.send` | `sfx/chat/send.mp3` | Tin chat của bản thân được gửi thành công | Có thể tắt để tránh ồn | P2 |
| `network.disconnected` | `sfx/network/disconnect.mp3` | Mất kết nối được phát hiện | 1 lần mỗi đợt mất mạng | P1 |
| `network.reconnected` | `sfx/network/reconnect.mp3` | Khôi phục thành công | 1 lần mỗi đợt reconnect | P1 |
| `network.timeout` | `sfx/network/timeout.mp3` | **Quá 60 giây** chưa khôi phục, server xác nhận bỏ cuộc | Không phát mỗi giây | P1 |
| `result.daily_reward` | `sfx/result/daily-reward.mp3` | Claim điểm mỗi ngày **thành công, được server xác nhận** | Chỉ 1 lần claim | P2 |
| `result.stake_settled` | `sfx/result/settled-soft.mp3` | Ví điểm đã quyết toán | Nhẹ, tránh cảm giác cờ bạc | P2 |

**Chat là chat chữ + emoji trước**, không phải voice chat. Audio thông báo phải phụ thuộc cài đặt người dùng, không tự phát quá nhiều khi nhận message hàng loạt. **TTS lời thoại Admin** có thể khảo sát về sau, **không phải yêu cầu MVP**; tránh phát âm nói từ văn bản do người chơi nhập để hạn chế spam/nội dung không phù hợp.

### 2.6. Nhạc nền / ambience

| ID | File đề xuất | Khi nào chơi | Nhắc đến chế độ |
|---|---|---|---|
| `music.menu` | `music/menu-garden.mp3` | Trang chủ/đăng nhập/map chọn; nhạc loop vui, mềm | Cả 2 |
| `music.lobby` | `music/lobby-friends.mp3` | Trong phòng chờ | Cả 2 |
| `music.game_basic` | `music/game-classic.mp3` | Trận mode Cơ bản; vui tươi nhưng nhẹ để nghe bước ngựa | Cơ bản |
| `music.game_fun` | `music/game-funny.mp3` | Trận mode Vui nhộn; nhịp nhanh hơn, nhí nhảnh | Vui nhộn |
| `music.result_win` | `music/result-win.mp3` | Màn thắng; **không phát chồng** `game.win` fanfare | Cả 2 |
| `ambient.garden` | `ambient/garden-birds.mp3` | Rừng/đồng cỏ tùy map, tùy bật tắt | P3, không mặc định |
| `ambient.candy` | `ambient/candy-bells.mp3` | Lễ hội kẹo/map đặc biệt, tùy bật tắt | P3 |

**Mood:** original composition, giai điệu có thể dùng glockenspiel, marimba, ukulele nhẹ, chuông nhỏ, tiếng gỗ và tiếng vó ngựa cartoon. **Không sử dụng nhạc thương mại/sao chép nhạc từ game khác**, không tiếng máy quay thưởng/xèng. Đề xuất bản loop sạch 30–90 giây; âm lượng nền thấp hơn SFX để không che thông báo lượt. Dùng crossfade 300–800ms khi đổi màn.

## 3. Luồng chức năng → thứ tự gọi âm thanh (dành cho Codex)

### 3.1. Từ trang chủ đến bắt đầu ván

1. Người dùng mở trang → chỉ render HTML, **chưa tự phát audio**.
2. Người dùng bấm nút cho phép âm/hoặc tương tác đầu tiên → `AudioManager.unlock()`; nạp các âm P0, **không ép bật nhạc khi đã tắt**.
3. Bấm `Chơi ngay` → `ui.select` → danh sách phòng.
4. Vào phòng thành công → `room.join`; người khác vào → `room.player_join`; sẵn sàng → `room.ready`.
5. Host bấm bắt đầu, khi backend/game state xác nhận → `room.start`, chuyển scene → chuyển nhạc nền phù hợp mode.
6. Khi lượt người chơi bắt đầu → `game.turn_start` một lần.

### 3.2. Tung xúc xắc và di chuyển

1. Client bấm tung → gửi **lệnh** đến engine/server; UI animation bắt đầu theo phương án đã duyệt, `dice.roll` được phát khi animation khởi động.
2. Engine/server trả kết quả và action id → animation tung khớp kết quả → `dice.land` đúng lúc xúc xắc dừng.
3. Được chọn quân: sáng viền quân hợp lệ (âm `ui.select` khi chọn), **không tự suy ra quân được đi chỉ từ số xúc xắc**.
4. Đi n ô: animation chuyển từng ô; phát `horse.step` tối đa 1 tiếng mỗi nhịp đã hiển thị, ưu tiên nhịp êm; cuối chuyển động `horse.move_finish`.
5. Kết quả va chạm/về đích từ engine → phát `horse.kick` / `horse.return_home` / `horse.finish` theo kết quả **đã xác thực**; riêng va chạm cho bubble hài trong mode Vui nhộn theo cấu hình.
6. Khi hết lượt → chuyển player active, `game.turn_start` cho người được quyền; không phát các tiếng bước ngựa sau khi scene/game bị đóng.

### 3.3. Mode Vui nhộn / trap / skill

1. Engine xác nhận ngựa vào loại ô event nào theo **map version** cố định.
2. UI nhận event `{eventId, actionId, tileId, actorId, effectType}` → animation bắt đầu.
3. `trap.mine_trigger` → animation cảnh báo → `trap.mine_explode`; nếu hiệu ứng return-home được engine trả về thì chạy `horse.return_home` sau đó.
4. `tile.lucky` / `tile.boost` / `tile.teleport` phát **chỉ theo type đã được engine xác nhận**, không hardcode số bước.
5. Skill đã hợp lệ → `skill.activate` rồi asset riêng của skill, nếu bất hợp lệ hiện `ui.error`.
6. Khi nhiều hiệu ứng đồng thời: ưu tiên va chạm/biến cố của quân đang xem; âm nền và chat duck xuống; giới hạn số instance.

### 3.4. Chat và mất kết nối online

1. Người dùng gửi chat → gửi server; khi server xác nhận mới phát `chat.send` (optional).
2. Nhận tin người khác → phát `chat.message_in` nếu chat sound được bật, không mute, giới hạn rate, không đang foreground bị ồn do burst.
3. Phát hiện mất mạng → `network.disconnected` **một lần**, hiện overlay 60s; việc đếm timer không cần tiếng tick liên tục.
4. Reconnect trong thời hạn → `network.reconnected`; **không chạy lại tất cả audio events** từ snapshot.
5. Hết 60s → chỉ sau kết luận từ server mới phát `network.timeout` và cập nhật trạng thái thua/mất điểm đúng nghiệp vụ đã chốt.
6. Nếu chuyển sang chat voice về sau cần thiết kế consent, mute/moderation và quyền truy cập microphone riêng; **không nằm trong tài liệu triển khai v0.1**.

## 4. Cấu trúc kỹ thuật và API audio (đề xuất)

```text
src/
  audio/
    audio-manager.ts        # init / unlock / play / stop / fade / mute / volume
    audio-manifest.ts       # eventId → asset + channel + settings
    audio-events.ts         # chuẩn event schema / typed event names
    audio-settings.ts       # localStorage của volume/mute, không lưu thông tin nhạy cảm
    sound-event-bridge.ts   # bridge engine/game state → animation/audio
    audio.test.ts           # mock Web Audio, test trigger/dedupe
public/
  audio/
    music/                  # MP3 loop (nhạc gốc có quyền sử dụng)
    sfx/ui/ sfx/room/ sfx/game/ sfx/horse/
    sfx/trap/ sfx/tile/ sfx/skill/ sfx/chat/
    sfx/network/ sfx/result/ sfx/emote/
    ambient/
```

**AudioManager interface gợi ý** (không phụ thuộc React, PixiJS hay Phaser):

```ts
type AudioChannel = 'music' | 'sfx' | 'ui' | 'chat' | 'ambient';
type AudioMode = 'basic' | 'fun';
type AudioEvent = {
  eventId: string;             // 'dice.land', 'horse.kick', ...
  actionId?: string;           // game action id do engine/server cấp, dùng dedupe
  mode?: AudioMode;
  actorId?: string;
  tileId?: string;
};

interface AudioManager {
  unlock(): Promise<void>;      // chỉ gọi sau user gesture hợp lệ
  play(event: AudioEvent): void;
  playMusic(id: string): void;
  stopMusic(): void;
  setMuted(category: AudioChannel | 'all', value: boolean): void;
  setVolume(category: AudioChannel, value: number): void;  // 0..1
  stopAll(): void;
  dispose(): void;
}
```

**Luồng chuẩn:** `GameEngine (pure state)` → `ActionResult/EventLog` → `AnimationController` → **các mốc animation** → `AudioManager`. Với online, **server là nguồn đáng tin về kết quả**, không đồng bộ luồng MP3 qua mạng: các client cùng render event từ state/action authoritative. Với offline, cùng contract, không cần network. Audio phải **side-effect**, không được làm thay đổi luật hoặc trì hoãn engine.

### 4.1. Quy định mix/chống chồng âm

- Volume khởi điểm đề xuất (chờ duyệt): Master 70%; BGM 25–35%; SFX 65%; UI 45%; Chat 35%; Ambience 15%.
- `music` chỉ một track tại một thời điểm; crossfade khi đổi scene; giảm nhạc nền tạm thời (**ducking**, ví dụ 40%) trong kết quả thắng/hiệu ứng nổi bật.
- SFX có giới hạn đồng thời (ví dụ tổng 6 tiếng, `horse.step` tối đa 2), quy tắc **priority**: kết quả lượt > trap/skill > chat > UI click.
- `ui.tap`, `chat.message_in`, `horse.step`: giới hạn số lần/s; khi 4 người cùng di chuyển hoặc chat dồn, không phát âm thanh liên tục.
- Tab chuyển nền / thiết bị khóa / audio context suspended: pause music, resume theo cài đặt và gesture; không replay hàng đợi âm cũ.
- Khi chuyển route / kết thúc trận / huỷ scene, cleanup timer/AudioNodes; không để âm thanh tiếp tục từ game đã thoát.
- **Mobile Safari/Chrome:** tuân thủ autoplay policy, chỉ unlock sau user gesture; mọi UI phải hoạt động khi sound chưa unlock hoặc asset không tải được.

### 4.2. Cài đặt người dùng & accessibility

- **Nút âm thanh dễ thấy** trên trang chủ/lobby/game: `Nhạc nền`, `Hiệu ứng`, `Âm chat`, `Tắt tất cả`; có slider riêng cho từng loại và nút bật/tắt nhanh.
- Ghi lựa chọn vào `localStorage` phía client; chế độ tắt tiếng phải được giữ sau reload và giữa 2 mode.
- **Không auto-play có tiếng trước tương tác người dùng**, ưu tiên cho phép người dùng tự bật nhạc; tránh mở web mà bị phát lớn đột ngột.
- Mọi event có feedback hình ảnh: popup, highlight quân, toast, subtitle (nếu có lời thoại), rung tùy chọn khi user cho phép; người khiếm thính vẫn chơi đầy đủ.
- Hỗ trợ `prefers-reduced-motion`; có thể giảm/ẩn animation phụ nhưng audio gameplay chính vẫn theo cài đặt riêng.
- Không gửi audio input/microphone lên server; không thu âm người dùng ở giai đoạn này.

## 5. Lộ trình phát triển step by step (cho Codex)

> Các bước **tuần tự theo dependency**, không phải thời gian thực hiện cố định. Mỗi bước tạo PR riêng, test và đánh dấu `[x]` **chỉ khi nghiệm thu**. Không xem âm thanh là hoàn thành chỉ vì đã lập tài liệu.

### AUDIO-00 — Duyệt sound direction / asset plan (P0)

- [ ] Chốt 1–2 mẫu âm cho `dice.roll`, `horse.step`, `horse.kick`, `game.win`, `trap.mine_explode` và nhạc mode cơ bản/vui nhộn.
- [ ] Đặt nguyên tắc SFX chibi dễ thương, không tiếng súng/nổ chân thực, không nhạc giống casino, không dùng asset không có bản quyền sử dụng.
- [ ] Chốt bật nhạc mặc định, mức volume, 2–3 biến thể ngựa, và liệu chat cần âm thông báo hay không.
- **Đầu ra:** sound moodboard + danh sách SFX/BGM được duyệt, ghi nguồn/license.
- **Gate:** Người dùng duyệt trước khi sản xuất hàng loạt asset.

### AUDIO-01 — Chuẩn hóa event contract (P0, cùng Game Engine)

- [ ] Định nghĩa event IDs trong bảng §2, schema event, `actionId` và map `mode`.
- [ ] Quy định rõ trong action/result của engine khi nào `dice.land`, `horse.step`, `horse.kick`, `horse.finish` được phát.
- [ ] Trường hợp reconnect/refresh và nhiều clients không phát trùng event.
- **Đầu ra:** event types + test cho actionId/dedupe. **Chưa cần có âm thật**.
- **Phụ thuộc:** Chốt tối thiểu game state, lượt và engine event theo `PLAN.md`.

### AUDIO-02 — Xây AudioManager độc lập (P0)

- [ ] Tạo manifest & loader, cache, unlock user gesture, âm lượng, mute, stop/dispose, fallback không có file.
- [ ] Có 2 bus `music` / `sfx` trước; tách `ui`, `chat`, `ambient` khi cần.
- [ ] Unit test: mute toàn bộ, volume 0–1, không phát nếu asset lỗi, chống trùng và chống leak khi đổi scene.
- **Đầu ra:** API AudioManager hoạt động với test/dummy asset được cấp phép.
- **Gate:** Chạy không lỗi trên Chrome desktop + Android/iOS browser; UI không bị block nếu audio fail.

### AUDIO-03 — Âm thanh UI / phòng chờ (P1)

- [ ] Map `ui.*` vào các nút và validation đúng kết quả (không phát success khi chưa thành công).
- [ ] Map `room.*` vào trạng thái room confirmed, ready, start countdown.
- [ ] Nút bật/tắt nhạc, SFX, chat; lưu cài đặt, không bật nhạc trước user gesture.
- **Đầu ra:** điều hướng UI/lobby có âm, không spam khi bấm nhanh.
- **Phụ thuộc:** AUDIO-02 + luồng UI thật.

### AUDIO-04 — Âm thanh gameplay Cơ bản (P0)

- [ ] Lắp `dice.roll` + `dice.land` vào animation xúc xắc.
- [ ] Lắp `horse.deploy`, `horse.step`, `horse.move_finish`, `horse.kick`, `horse.finish` vào animation bước/quân (không gắn âm chỉ theo giá trị dice giả lập).
- [ ] `game.turn_start`, `game.no_valid_move`, `game.win/lose` theo engine.
- [ ] `music.game_basic` loop nhẹ và crossfade từ lobby.
- **Đầu ra:** offline mode Cơ bản nghe đúng tình huống trong một ván thật.
- **Gate:** Không có âm bẫy/skill trong mode Cơ bản; không phát sai khi engine từ chối nước đi.
- **Phụ thuộc:** Game Engine + bàn cờ động / sprite animation hoàn chỉnh.

### AUDIO-05 — Âm thanh gameplay Vui nhộn (P1)

- [ ] Khi luật custom map đã chốt: map trap/lucky/boost/return-home/teleport/mystery vào animation+SFX theo bảng §2.4.
- [ ] Lắp skill theo màu vào animation; cooldown ready và shield block không trùng âm.
- [ ] Bubble thoại hài + 2–3 âm ngựa kêu/cười; nội dung chữ lấy từ Admin, không tự phát TTS.
- [ ] `music.game_fun` và sound effect đồng bộ theo mode.
- **Đầu ra:** demo ít nhất mỗi loại tile/skill đã được người dùng duyệt.
- **Gate:** Không thay đổi vị trí/luật map chỉ để phát âm; không nổ chồng nhiều lần.
- **Phụ thuộc:** AUDIO-04 + game mode Vui nhộn + luật chốt.

### AUDIO-06 — Chat / notification / reconnect (P1)

- [ ] Khi chat chữ chạy thật: âm nhận/gửi/mention theo quyền và mute của người chơi.
- [ ] Khi backend báo mất mạng, reconnect và mất quyền chơi sau **60s**: map âm đúng trạng thái, chỉ phát một lần.
- [ ] Rate limit chat/emote, tắt sound khi tab nền nếu phù hợp, kiểm thử đồng thời 4 người.
- **Đầu ra:** kiểm thử online 2–4 client; không tiếng thông báo trùng/spam.
- **Phụ thuộc:** Online multiplayer/chat presence và backend authoritative.

### AUDIO-07 — Kết quả/nhạc nền/đánh bóng (P2)

- [ ] Kết quả thắng/thua/nhận thưởng điểm chỉ phát khi backend/game engine xác nhận (không chơi lại khi reload).
- [ ] Mastering / cân bằng âm lượng, giới hạn đồng thời, chuyển track mượt, hiệu năng thiết bị yếu.
- [ ] Kiểm tra quyền sử dụng/credits/LICENSES, bảng danh mục và build size.
- [ ] Accessibility: chơi hoàn toàn mute, subtitle, giảm hiệu ứng.
- **Đầu ra:** QA checklist qua desktop, mobile portrait, tab ẩn, reconnect, mute.
- **Gate:** Pass ma trận kiểm thử §6.

## 6. Ma trận kiểm thử nghiệm thu (tối thiểu)

| Case | Thao tác | Kết quả mong đợi |
|---|---|---|
| A-01 | Tải lần đầu chưa chạm | **Không có tiếng tự phát**, website vẫn sử dụng được |
| A-02 | Bật nhạc rồi tắt master | Dừng tức thì; reload vẫn mute |
| A-03 | Tung xúc xắc | `roll` rồi `land`, không `land` trước khi có kết quả |
| A-04 | Ngựa di chuyển 6 ô | Bước ngựa khớp animation, không âm dồn như tiếng máy |
| A-05 | Đá ngựa ở mode Cơ bản | `horse.kick`, `return_home`, **không** trap/skill |
| A-06 | Đi vào ô mìn mode Vui nhộn | `trigger` → `pop` → kết quả engine, không tự đổi luật |
| A-07 | Hai event giống nhau với cùng `actionId` | Không phát 2 lần |
| A-08 | Reconnect sau 10s | Chỉ `network.reconnected`, không phát lại tiếng các lượt cũ |
| A-09 | Rớt mạng quá 60s | Chỉ `network.timeout` sau xác nhận server |
| A-10 | 4 người gửi chat/emoji liên tục | Tối đa rate limit, UI vẫn mượt |
| A-11 | Chuyển mode Cơ bản ↔ Vui nhộn | Nhạc phù hợp; không mang âm skill sang Cơ bản |
| A-12 | Điện thoại portrait, Safari iOS/Chrome Android | Không autoplay bị chặn/crash, không tràn UI, âm sau user gesture |
| A-13 | Ẩn tab/khóa màn hình/thoát trận | Music/SFX pause hoặc dừng đúng, không leak và không phát bù |
| A-14 | Không tải được asset audio | Có visual feedback, không lỗi game/hành động |
| A-15 | User tắt tất cả âm thanh | Vẫn chơi, chat, xem trận và nhận trạng thái bình thường |

## 7. Checklist dành cho người làm nội dung âm thanh

Mỗi file âm thanh mới phải có:

```yaml
id: horse.step
file: /audio/sfx/horse/hoof-01.mp3
kind: sfx
category: game
mode: [basic, fun]
loop: false
volume: 0.55
cooldownMs: 100
maxInstances: 2
status: proposed  # proposed | licensed | reviewed | approved | implemented
source: original-or-licensed
license: TODO
credit: TODO
notes: 'Bước ngựa cartoon, mềm, 0.1-0.25s; 3 biến thể'
```

Tránh đưa dữ liệu license/bản quyền chưa kiểm chứng thành `approved`. Sau khi duyệt, tập trung lưu nguồn audio ở repository/thư mục tài nguyên riêng hoặc asset CDN tùy dung lượng; **không** commit file âm thanh thương mại không được cấp phép. Ưu tiên tổ chức thư mục và event IDs trước khi sản xuất nhiều file.

## 8. Hướng dẫn cho Codex (prompt triển khai sau khi duyệt)

> Đọc `PLAN.md`, `CHECKLIST.md`, `GAME_CONCEPT.md`, `docs/UI-PROTOTYPE.md` và `docs/AUDIO-SPEC.md`. Chỉ làm step AUDIO-XX được yêu cầu. Dùng event IDs thống nhất trong tài liệu; AudioManager độc lập với React/game engine; âm thanh là side-effect, không thay thế logic. Không phát audio trước user gesture, không phát trùng khi reconnect, không tạo placeholder gây lỗi, không dùng nhạc/asset có bản quyền không được cấp phép. Giữ mobile game portrait và chế độ Cơ bản tuyệt đối không có skill/trap. Viết test và ghi trạng thái thực tế vào checklist khi có nghiệm thu. Nếu cần luật/tài nguyên chưa được chốt, đưa câu hỏi và chờ xác nhận thay vì đoán.

## 9. Các quyết định người dùng cần chốt trước sản xuất âm thanh

1. Có muốn **nhạc nền tự bắt đầu sau lần chạm đầu tiên** hay chỉ bật khi ấn biểu tượng loa?
2. Thích âm ngựa theo hướng **ngựa hí cartoon**, tiếng vó gõ gỗ, hay hiệu ứng pop/boing là chính?
3. Có muốn ngựa **phát tiếng kêu / biểu cảm** khi bị đá, thắng, dính mìn? (Mặc định đề xuất: tiếng hiệu ứng + bubble chữ; chưa dùng TTS.)
4. Mỗi map có nhạc riêng hay chỉ **2 track** tương ứng hai chế độ ở v1?
5. Chat có âm thông báo mặc định không? Có muốn tắt riêng âm chat/emoji?
6. Thời gian 30s/lượt là cấu hình mẫu, chưa chốt; có cần **âm cảnh báo còn 5s** không?
7. Có định dùng âm thanh lồng tiếng tiếng Việt cho câu thoại Admin ở giai đoạn sau không?

**Quy tắc cập nhật:** tài liệu này **chưa phải danh sách file đã sản xuất**. Giữ nguyên ID khi đổi file; nếu đổi trigger cần sửa bảng map và test. `CHECKLIST.md` chỉ đánh dấu công việc thực sự đã triển khai/được duyệt.