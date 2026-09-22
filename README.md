# ⚔️ OTTv2 - Oẳn Tù Tì Chiến Thuật (Bàn Cờ 9x9)

> **Đồ án môn học**: Lập trình mạng  
> **Nền tảng**: Web HTML5/CSS3/JavaScript thuần (Zero-dependency)  
> **Chơi trực tuyến (GitHub Pages)**: [https://yukinatsumi.github.io/Project_Game/](https://yukinatsumi.github.io/Project_Game/)

---

## 🌟 1. Giới thiệu trò chơi

Trò chơi **Cờ Oẳn Tù Tì 9x9 (Rock-Paper-Scissors Chess)** kết hợp giữa tính chiến thuật di chuyển trên bàn cờ vuông 9x9 với quy tắc khắc chế kinh điển Búa - Bao - Kéo.

### 📋 Đặc tả luật chơi:
1. **Bàn cờ 9x9**:
   - Gồm 81 ô cờ với hệ tọa độ chuẩn: Cột `a` -> `i` (ngang), Hàng `1` -> `9` (dọc).
   - Ô cứ điểm Phe Đỏ: **`a1`** (góc dưới - trái).
   - Ô cứ điểm Phe Xanh: **`i9`** (góc trên - phải).
2. **Lực lượng mỗi đội (Đúng 10 quân / 20 quân toàn bàn)**:
   - ✊ **3 Búa (Đá / Đấm)**
   - 🖐️ **4 Bao (Lá)**
   - ✌️ **3 Kéo**
3. **Quy tắc di chuyển**:
   - Mọi quân cờ đều di chuyển **1 bước theo 8 hướng** xung quanh (ngang, dọc, chéo - tương tự quân Vua trong cờ vua).
   - Hỗ trợ cả **Kéo Thả (Drag & Drop)** và **Nhấp Chuột (Click to Move)**.
4. **Quy tắc ăn quân (Khắc chế Oẳn Tù Tì)**:
   - ✊ **Búa** ăn ✌️ **Kéo**.
   - ✌️ **Kéo** ăn 🖐️ **Bao**.
   - 🖐️ **Bao** ăn ✊ **Búa**.
   - **Hai quân cùng loại KHÔNG THỂ ăn nhau** (Búa x Búa, Bao x Bao, Kéo x Kéo cản đường nhau).
   - Không thể ăn quân cùng đội và không thể đi vào quân khắc chế mình.
5. **Điều kiện chiến thắng**:
   - 🎯 **Chiếm cứ điểm địch**: Đưa bất kỳ 1 quân nào của mình vào ô thành đối phương (Phe Đỏ vào `i9`, Phe Xanh vào `a1`).
   - 💀 **Quét sạch quân**: Ăn hết toàn bộ 10 quân của đối thủ.
   - 🛑 **Bế tắc (Stalemate)**: Đến lượt nhưng đối thủ không còn nước đi hợp lệ nào.

---

## 🎮 2. Chế độ chơi

1. 👥 **2 Người Cùng Máy (Pass & Play)**: Chơi luân phiên đổi lượt trực tiếp trên cùng một màn hình.
2. 🤖 **Đấu Với Máy (AI Bot)**: Luyện tập với trí tuệ nhân tạo Heuristic tự động tính toán nước đi thông minh.
3. 🌐 **Phòng Đấu Trực Tuyến**: Giao diện tạo phòng, mã PIN và kênh chat trong trận đấu.

---