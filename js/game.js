/**
 * ===================================================================
 * GAME.JS - Bộ điều khiển trung tâm trò chơi Cờ Oẳn Tù Tì 9x9 (OTTv2)
 * Kết nối:
 * - Engine luật chơi: Rules (js/rules.js)
 * - Module vẽ bàn cờ: Board (js/board.js)
 * - Giao diện người dùng: HUD, Banner, Lịch sử, Modals (game.html)
 * ===================================================================
 */

(function (global) {
    'use strict';

    // --- TRẠNG THÁI TRÒ CHƠI ---
    let boardState = null;
    let currentTurn = 'team1'; // 'team1' (Đỏ) hoặc 'team2' (Xanh)
    let isGameOver = false;
    let selectedPieceCoord = null;
    let currentValidMoves = [];
    let turnCount = 1;
    let moveHistory = [];
    let gameMode = 'pass_and_play'; // 'pass_and_play' | 'ai' | 'online'
    let soundEnabled = true;

    // --- HỆ THỐNG ÂM THANH WEB AUDIO API (Zero-dependency) ---
    let audioCtx = null;

    function getAudioContext() {
        if (!soundEnabled) return null;
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type, duration, gainValue = 0.1) {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(gainValue, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio error silently ignored
        }
    }

    function playSound(type) {
        if (!soundEnabled) return;
        switch (type) {
            case 'select':
                playTone(520, 'sine', 0.08, 0.05);
                break;
            case 'move':
                playTone(380, 'triangle', 0.12, 0.08);
                break;
            case 'capture':
                playTone(280, 'sawtooth', 0.15, 0.12);
                setTimeout(() => playTone(440, 'triangle', 0.12, 0.1), 80);
                break;
            case 'win':
                playTone(523.25, 'triangle', 0.2, 0.12); // C5
                setTimeout(() => playTone(659.25, 'triangle', 0.2, 0.12), 150); // E5
                setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.15), 300); // G5
                break;
            case 'error':
                playTone(180, 'sawtooth', 0.15, 0.08);
                break;
        }
    }

    // --- KHỞI TẠO TRÒ CHƠI ---
    function initGame() {
        if (typeof Rules === 'undefined') {
            console.error("Lỗi: Không tìm thấy Rules (js/rules.js)!");
            return;
        }

        boardState = Rules.createInitialBoard();
        currentTurn = Rules.TEAMS.TEAM_1; // Đỏ đi trước
        isGameOver = false;
        selectedPieceCoord = null;
        currentValidMoves = [];
        turnCount = 1;
        moveHistory = [];

        // Khởi tạo hiển thị bàn cờ thông qua BoardView
        if (typeof Board !== 'undefined') {
            Board.createBoard(boardState, handleCellClick, handlePieceDrop);
        }

        updateHUD();
        updateTurnBanner();
        updateHistoryLog();

        // Ẩn modal chiến thắng nếu đang mở
        const victoryModal = document.getElementById("victoryModal");
        if (victoryModal) victoryModal.classList.remove("active");
    }

    /**
     * Lấy trạng thái bàn cờ hiện tại
     */
    function getBoardState() {
        return boardState;
    }

    /**
     * Cập nhật thông tin HUD (Số lượng từng loại quân cờ Búa, Bao, Kéo)
     */
    function updateHUD() {
        if (!Rules || !Rules.countPiecesByType || !boardState) return;

        const pieceCounts = Rules.countPiecesByType(boardState);
        const t1 = pieceCounts[Rules.TEAMS.TEAM_1];
        const t2 = pieceCounts[Rules.TEAMS.TEAM_2];

        // Cập nhật Phe 1 (Đỏ)
        updateCountElement("p1RockCount", t1.bua);
        updateCountElement("p1PaperCount", t1.bao);
        updateCountElement("p1ScissorsCount", t1.keo);

        // Cập nhật Phe 2 (Xanh)
        updateCountElement("p2RockCount", t2.bua);
        updateCountElement("p2PaperCount", t2.bao);
        updateCountElement("p2ScissorsCount", t2.keo);
    }

    function updateCountElement(elementId, count) {
        const el = document.getElementById(elementId);
        if (!el) return;

        el.textContent = count;
        const parent = el.closest(".piece-count-item");
        if (parent) {
            parent.classList.toggle("danger", count === 1);
            parent.classList.toggle("extinct", count === 0);
        }
    }

    /**
     * Cập nhật biểu ngữ lượt đi và trạng thái thẻ người chơi
     */
    function updateTurnBanner() {
        const turnText = document.getElementById("turnText");
        const p1Card = document.getElementById("p1Card");
        const p2Card = document.getElementById("p2Card");

        const isRed = (currentTurn === Rules.TEAMS.TEAM_1);

        if (turnText) {
            turnText.textContent = isRed 
                ? "Lượt của Đỏ (Người chơi 1)" 
                : (gameMode === 'ai' ? "Lượt của Xanh (AI Bot đang nghĩ...)" : "Lượt của Xanh (Người chơi 2)");
        }

        if (p1Card) p1Card.classList.toggle("active-turn", isRed);
        if (p2Card) p2Card.classList.toggle("active-turn", !isRed);
    }

    /**
     * Xử lý khi người dùng click vào một ô cờ
     * @param {{x: number, y: number}} coord
     */
    function handleCellClick(coord) {
        if (isGameOver) return;

        // Nếu đang ở chế độ đấu AI và đang là lượt của AI, chặn click
        if (gameMode === 'ai' && currentTurn === Rules.TEAMS.TEAM_2) {
            return;
        }

        const clickedPiece = Rules.getPieceAt(boardState, coord.x, coord.y);

        // 1. Nếu đã có quân cờ đang chọn
        if (selectedPieceCoord) {
            // Click lại chính quân đó -> Hủy chọn
            if (selectedPieceCoord.x === coord.x && selectedPieceCoord.y === coord.y) {
                deselectPiece();
                return;
            }

            // Click vào ô nước đi hợp lệ -> Thực hiện di chuyển
            const isValidDestination = currentValidMoves.some(m => m.x === coord.x && m.y === coord.y);
            if (isValidDestination) {
                executeMove(selectedPieceCoord, coord);
                return;
            }

            // Click vào một quân khác cùng đội -> Đổi quân chọn
            if (clickedPiece && clickedPiece.team === currentTurn) {
                selectPiece(coord);
                return;
            }

            // Click ra ô không hợp lệ -> Hủy chọn
            deselectPiece();
            return;
        }

        // 2. Chưa chọn quân nào: Nếu click vào quân của phe mình -> Chọn quân
        if (clickedPiece && clickedPiece.team === currentTurn) {
            selectPiece(coord);
        }
    }

    /**
     * Xử lý khi kéo thả quân cờ thành công lên một ô
     * @param {{x: number, y: number}} from
     * @param {{x: number, y: number}} to
     */
    function handlePieceDrop(from, to) {
        if (isGameOver) return;

        if (gameMode === 'ai' && currentTurn === Rules.TEAMS.TEAM_2) {
            return;
        }

        // Kiểm tra tính hợp lệ của nước đi
        const check = Rules.isValidMove(boardState, from, to, currentTurn);
        if (check.valid) {
            executeMove(from, to);
        } else {
            playSound('error');
            Board.clearHighlights();
            selectedPieceCoord = null;
        }
    }

    /**
     * Chọn quân cờ tại tọa độ và vẽ gợi ý di chuyển
     * @param {{x: number, y: number}} coord
     */
    function selectPiece(coord) {
        selectedPieceCoord = coord;
        currentValidMoves = Rules.getValidMoves(boardState, coord, currentTurn);

        Board.highlightMoves(currentValidMoves, boardState, coord);
        playSound('select');
    }

    /**
     * Hủy chọn quân cờ
     */
    function deselectPiece() {
        selectedPieceCoord = null;
        currentValidMoves = [];
        Board.clearHighlights();
    }

    /**
     * Thực thi một nước đi từ 'from' tới 'to'
     * @param {{x: number, y: number}} from
     * @param {{x: number, y: number}} to
     */
    function executeMove(from, to) {
        const piece = Rules.getPieceAt(boardState, from.x, from.y);
        if (!piece) return;

        const targetPiece = Rules.getPieceAt(boardState, to.x, to.y);
        const isCapture = (targetPiece !== null);

        // Cập nhật vị trí trên bàn cờ
        boardState[from.y][from.x] = null;
        piece.x = to.x;
        piece.y = to.y;
        piece.notation = Rules.coordToAlgebraic(to.x, to.y);
        boardState[to.y][to.x] = piece;

        // Xóa highlight và làm nổi bật vệt nước đi
        deselectPiece();
        Board.highlightLastMove(from, to);
        Board.renderPieces(boardState);

        // Âm thanh
        playSound(isCapture ? 'capture' : 'move');

        // Ghi lại nhật ký nước đi
        recordMove(piece, from, to, isCapture, targetPiece);

        // Cập nhật lại số quân trên HUD
        updateHUD();

        // Kiểm tra điều kiện chiến thắng
        const winResult = Rules.checkWinCondition(boardState, { team: piece.team, to: to });
        if (winResult.gameOver) {
            handleGameOver(winResult);
            return;
        }

        // Chuyển lượt đi
        currentTurn = Rules.switchTurn(currentTurn);
        if (currentTurn === Rules.TEAMS.TEAM_1) {
            turnCount++;
        }
        updateTurnBanner();

        // Kích hoạt AI nếu đang chơi với máy
        if (gameMode === 'ai' && currentTurn === Rules.TEAMS.TEAM_2 && !isGameOver) {
            setTimeout(makeAIMove, 450);
        }
    }

    /**
     * Ghi nhận nước đi vào lịch sử trận đấu
     */
    function recordMove(piece, from, to, isCapture, capturedPiece) {
        const fromNot = Rules.coordToAlgebraic(from.x, from.y);
        const toNot = Rules.coordToAlgebraic(to.x, to.y);
        const pieceNames = { bua: "Búa", bao: "Bao", keo: "Kéo" };
        const pName = pieceNames[piece.type] || piece.type;

        let desc = `${pName} ${fromNot} ➔ ${toNot}`;
        if (isCapture && capturedPiece) {
            const capName = pieceNames[capturedPiece.type] || capturedPiece.type;
            desc += ` (Ăn ${capName})`;
        }

        const record = {
            turn: turnCount,
            team: piece.team,
            text: desc
        };

        moveHistory.unshift(record);
        updateHistoryLog();
    }

    /**
     * Cập nhật danh sách hiển thị nhật ký nước đi
     */
    function updateHistoryLog() {
        const historyList = document.getElementById("historyList");
        if (!historyList) return;

        if (moveHistory.length === 0) {
            historyList.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 10px;">Chưa có nước đi nào</div>`;
            return;
        }

        historyList.innerHTML = moveHistory.slice(0, 30).map(item => {
            const teamClass = (item.team === Rules.TEAMS.TEAM_1) ? 'red' : 'blue';
            const teamName = (item.team === Rules.TEAMS.TEAM_1) ? 'Đỏ' : 'Xanh';
            return `
                <div class="history-item ${teamClass}">
                    <span><strong>[${teamName}]</strong> ${item.text}</span>
                    <span style="color: var(--text-muted); font-size: 11px;">#${item.turn}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Xử lý kết thúc ván đấu
     */
    function handleGameOver(winResult) {
        isGameOver = true;
        playSound('win');

        const isRedWon = (winResult.winner === Rules.TEAMS.TEAM_1);
        const winnerName = isRedWon ? "Phe Đỏ" : "Phe Xanh";

        // Cập nhật Banner
        const turnText = document.getElementById("turnText");
        if (turnText) {
            turnText.textContent = `🏆 ${winnerName} CHIẾN THẮNG!`;
        }

        // Cập nhật Modal Chiến Thắng
        const victoryModal = document.getElementById("victoryModal");
        const victoryTitle = document.getElementById("victoryTitle");
        const victoryReason = document.getElementById("victoryReason");

        if (victoryTitle) {
            victoryTitle.textContent = `${winnerName} Thắng!`;
            victoryTitle.style.color = isRedWon ? "var(--red-color)" : "var(--blue-color)";
        }
        if (victoryReason) {
            victoryReason.textContent = winResult.reason || "Đã đạt điều kiện chiến thắng!";
        }
        if (victoryModal) {
            victoryModal.classList.add("active");
        }
    }

    /**
     * Trí tuệ nhân tạo (AI Bot cơ bản cho Phe Xanh - Team 2)
     */
    function makeAIMove() {
        if (isGameOver || currentTurn !== Rules.TEAMS.TEAM_2) return;

        // 1. Thu thập tất cả nước đi hợp lệ của Phe Xanh
        const allPossibleMoves = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                const piece = Rules.getPieceAt(boardState, x, y);
                if (piece && piece.team === Rules.TEAMS.TEAM_2) {
                    const validMoves = Rules.getValidMoves(boardState, { x, y }, Rules.TEAMS.TEAM_2);
                    validMoves.forEach(dest => {
                        allPossibleMoves.push({
                            from: { x, y },
                            to: dest,
                            piece: piece,
                            targetPiece: Rules.getPieceAt(boardState, dest.x, dest.y)
                        });
                    });
                }
            }
        }

        if (allPossibleMoves.length === 0) {
            return;
        }

        // 2. Chấm điểm chiến thuật (Heuristic scoring):
        // - Nước đi vào ô đích A1 (x=0, y=0): +1000 điểm (thắng ngay)
        // - Nước đi ăn quân đối phương: +100 điểm
        // - Nước đi tiến gần đến A1: + (khoảng cách cũ - khoảng cách mới) * 10 điểm
        let bestMove = null;
        let bestScore = -Infinity;

        allPossibleMoves.forEach(m => {
            let score = 0;

            // Đích đến là ô A1 (x=0, y=0)
            if (m.to.x === 0 && m.to.y === 0) {
                score += 1000;
            }

            // Ăn quân đối phương
            if (m.targetPiece) {
                score += 100;
            }

            // Tiến gần góc A1 (0, 0)
            const currentDist = Math.max(Math.abs(m.from.x - 0), Math.abs(m.from.y - 0));
            const newDist = Math.max(Math.abs(m.to.x - 0), Math.abs(m.to.y - 0));
            score += (currentDist - newDist) * 15;

            // Thêm một chút ngẫu nhiên để AI biến hóa
            score += Math.random() * 5;

            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        });

        if (bestMove) {
            executeMove(bestMove.from, bestMove.to);
        }
    }

    // --- CÀI ĐẶT SỰ KIỆN CÁC NÚT ĐIỀU KHIỂN ---
    function setupEventListeners() {
        // Nút Ván mới / Làm mới
        const btnResetGame = document.getElementById("btnResetGame");
        if (btnResetGame) {
            btnResetGame.addEventListener("click", () => initGame());
        }

        const btnModalPlayAgain = document.getElementById("btnModalPlayAgain");
        if (btnModalPlayAgain) {
            btnModalPlayAgain.addEventListener("click", () => initGame());
        }

        // Tương thích nút createBoardBtn của Person 1 nếu có
        const createBoardBtn = document.getElementById("createBoardBtn");
        if (createBoardBtn) {
            createBoardBtn.addEventListener("click", () => initGame());
        }

        // Nút xem Luật chơi
        const btnRules = document.getElementById("btnRules");
        const rulesModal = document.getElementById("rulesModal");
        const btnCloseRules = document.getElementById("btnCloseRules");

        if (btnRules && rulesModal) {
            btnRules.addEventListener("click", () => rulesModal.classList.add("active"));
        }
        if (btnCloseRules && rulesModal) {
            btnCloseRules.addEventListener("click", () => rulesModal.classList.remove("active"));
        }
        if (rulesModal) {
            rulesModal.addEventListener("click", (e) => {
                if (e.target === rulesModal) rulesModal.classList.remove("active");
            });
        }

        // Nút Bật/Tắt Âm thanh
        const btnSound = document.getElementById("btnSound");
        if (btnSound) {
            btnSound.addEventListener("click", () => {
                soundEnabled = !soundEnabled;
                btnSound.textContent = soundEnabled ? "🔊 Âm thanh: Bật" : "🔇 Âm thanh: Tắt";
            });
        }

        // Chọn chế độ chơi
        const btnPassAndPlay = document.getElementById("btnPassAndPlay");
        const btnVsAI = document.getElementById("btnVsAI");

        if (btnPassAndPlay) {
            btnPassAndPlay.addEventListener("click", () => {
                gameMode = 'pass_and_play';
                btnPassAndPlay.classList.add("btn-primary");
                btnPassAndPlay.classList.remove("btn-secondary");
                if (btnVsAI) {
                    btnVsAI.classList.remove("btn-primary");
                    btnVsAI.classList.add("btn-secondary");
                }
                initGame();
            });
        }

        if (btnVsAI) {
            btnVsAI.addEventListener("click", () => {
                gameMode = 'ai';
                btnVsAI.classList.add("btn-primary");
                btnVsAI.classList.remove("btn-secondary");
                if (btnPassAndPlay) {
                    btnPassAndPlay.classList.remove("btn-primary");
                    btnPassAndPlay.classList.add("btn-secondary");
                }
                initGame();
            });
        }

        // Giả lập giao diện Phòng Đấu Online
        const btnCreateRoom = document.getElementById("btnCreateRoom");
        const btnQuickMatch = document.getElementById("btnQuickMatch");
        const btnJoinRoom = document.getElementById("btnJoinRoom");
        const roomCodeBox = document.getElementById("roomCodeBox");
        const roomCodeDisplay = document.getElementById("roomCodeDisplay");
        const roomStatusText = document.getElementById("roomStatusText");
        const btnCopyCode = document.getElementById("btnCopyCode");
        const connectionBadge = document.getElementById("connectionBadge");

        if (btnCreateRoom) {
            btnCreateRoom.addEventListener("click", () => {
                const randomPin = Math.floor(1000 + Math.random() * 9000);
                if (roomCodeBox) roomCodeBox.style.display = "flex";
                if (roomCodeDisplay) roomCodeDisplay.textContent = `OTT${randomPin}`;
                if (roomStatusText) roomStatusText.textContent = `Đã tạo phòng OTT${randomPin}. Đang chờ người chơi thứ 2 kết nối...`;
                if (connectionBadge) {
                    connectionBadge.textContent = "Phòng sẵn sàng";
                    connectionBadge.classList.add("online");
                }
            });
        }

        if (btnQuickMatch) {
            btnQuickMatch.addEventListener("click", () => {
                if (roomStatusText) roomStatusText.textContent = "Đang tìm kiếm đối thủ trong sảnh chờ...";
                setTimeout(() => {
                    if (roomStatusText) roomStatusText.textContent = "Không tìm thấy phòng trống. Đang chuyển sang đấu với AI Bot...";
                    if (btnVsAI) btnVsAI.click();
                }, 1200);
            });
        }

        if (btnJoinRoom) {
            btnJoinRoom.addEventListener("click", () => {
                const joinInput = document.getElementById("joinRoomInput");
                const code = joinInput ? joinInput.value.trim().toUpperCase() : "";
                if (!code) {
                    alert("Vui lòng nhập mã phòng!");
                    return;
                }
                if (roomStatusText) roomStatusText.textContent = `Đang kết nối vào phòng ${code}...`;
            });
        }

        if (btnCopyCode) {
            btnCopyCode.addEventListener("click", () => {
                const code = roomCodeDisplay ? roomCodeDisplay.textContent : "";
                if (code && navigator.clipboard) {
                    navigator.clipboard.writeText(code).then(() => {
                        btnCopyCode.textContent = "✅";
                        setTimeout(() => btnCopyCode.textContent = "📋", 1500);
                    });
                }
            });
        }

        // Tương tác Chat trong phòng
        const btnSendChat = document.getElementById("btnSendChat");
        const chatInput = document.getElementById("chatInput");
        const chatMessages = document.getElementById("chatMessages");

        function sendChat() {
            if (!chatInput || !chatMessages) return;
            const text = chatInput.value.trim();
            if (!text) return;

            const nameInput = document.getElementById("playerNameInput");
            const senderName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Tôi";

            const msgDiv = document.createElement("div");
            msgDiv.style.fontSize = "12px";
            msgDiv.style.lineHeight = "1.4";
            msgDiv.innerHTML = `<strong style="color: var(--gold-color);">${senderName}:</strong> ${text}`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            chatInput.value = "";
        }

        if (btnSendChat) btnSendChat.addEventListener("click", sendChat);
        if (chatInput) {
            chatInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") sendChat();
            });
        }
    }

    // Tự động khởi chạy khi trang web tải xong
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener("DOMContentLoaded", () => {
                setupEventListeners();
                initGame();
            });
        } else {
            setupEventListeners();
            initGame();
        }
    }

    // Xuất module Game ra window
    const Game = {
        init: initGame,
        getBoardState,
        handleCellClick,
        handlePieceDrop,
        selectPiece,
        deselectPiece,
        executeMove,
        makeMove: (from, to) => executeMove(from, to)
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Game;
    }
    if (typeof global !== 'undefined') {
        global.Game = Game;
    }

})(typeof window !== 'undefined' ? window : globalThis);
