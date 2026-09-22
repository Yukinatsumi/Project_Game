/**
 * ===================================================================
 * GAME.JS - Bộ điều khiển trung tâm trò chơi Cờ Oẳn Tù Tì 9x9 (OTTv2)
 * Hỗ trợ:
 * - Engine luật chơi: Rules (js/rules.js)
 * - Module vẽ bàn cờ: Board (js/board.js)
 * - Chơi 2 người cùng máy (Pass & Play)
 * - Đấu Với Máy (AI Bot Heuristic)
 * - Đấu Trực Tuyến 2 người qua playhtml.fun (mã phòng 8 ký tự + liên kết mời ?room=)
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

    // --- TRẠNG THÁI PHÒNG ĐẤU TRỰC TUYẾN (playhtml.fun) ---
    let playHTMLInstance = null;     // Instance singleton của thư viện playhtml sau khi import động
    let gameChannel = null;          // PageDataChannel đồng bộ trạng thái ván đấu (nước đi, ván mới, đổi phe)
    let chatChannel = null;          // PageDataChannel đồng bộ tin nhắn chat
    let myOnlineRole = null;         // 'team1' (Đỏ) hoặc 'team2' (Xanh)
    let currentRoomCode = null;
    let isRoomHost = false;
    let lastProcessedMoveTime = null;
    let lastProcessedChatTime = null;
    let localRestartId = 0;
    let localSwapId = 0;

    const ROOM_SESSION_KEY_PREFIX = 'ott_room_role_';

    /**
     * Sinh ngẫu nhiên mã phòng gồm đúng 8 ký tự chữ cái và số in hoa
     */
    function generateRoomCode8() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Nạp động thư viện playhtml.fun (chỉ nạp 1 lần, dùng chung cho cả phiên trang).
     * Thư viện được đóng gói sẵn cục bộ tại js/playhtml/ (không cần build/CDN ngoài).
     * @returns {Promise<any>} Đối tượng `playhtml` singleton (init, createPageData, ...)
     */
    async function loadPlayHTML() {
        if (playHTMLInstance) return playHTMLInstance;
        // Chú ý: import() động phân giải đường dẫn tương đối theo vị trí của CHÍNH
        // file game.js (js/game.js), không phải theo URL trang HTML gốc.
        // Vì vậy playhtml nằm ở "./playhtml/..." (cùng thư mục js/), không phải "./js/playhtml/...".
        const mod = await import('./playhtml/playhtml.es.js');
        playHTMLInstance = mod.playhtml;
        return playHTMLInstance;
    }

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
    function initGame(isRemote = false) {
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
            Board.clearHighlights();
        }

        updateHUD();
        updateTurnBanner();
        updateHistoryLog();

        // Ẩn modal chiến thắng nếu đang mở
        const victoryModal = document.getElementById("victoryModal");
        if (victoryModal) victoryModal.classList.remove("active");

        // Đồng bộ ván mới tới đối thủ nếu đang ở phòng Online (playhtml.fun)
        if (gameMode === 'online' && !isRemote && currentRoomCode && gameChannel) {
            const cur = gameChannel.getData() || {};
            const nextId = (cur.restartId || 0) + 1;
            localRestartId = nextId; // Tránh tự xử lý lại chính thông điệp mình vừa gửi (echo)
            gameChannel.setData((draft) => {
                draft.restartId = nextId;
            });
        }
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
            if (gameMode === 'online') {
                const isMyTurn = (currentTurn === myOnlineRole);
                const myRoleName = (myOnlineRole === Rules.TEAMS.TEAM_1) ? "Phe Đỏ" : "Phe Xanh";
                const oppRoleName = (myOnlineRole === Rules.TEAMS.TEAM_1) ? "Phe Xanh" : "Phe Đỏ";
                turnText.textContent = isMyTurn
                    ? `🎮 LƯỢT CỦA BẠN (${myRoleName})`
                    : `⏳ Đang chờ ${oppRoleName} di chuyển...`;
            } else {
                turnText.textContent = isRed
                    ? "Lượt của Đỏ (Người chơi 1)"
                    : (gameMode === 'ai' ? "Lượt của Xanh (AI Bot đang nghĩ...)" : "Lượt của Xanh (Người chơi 2)");
            }
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

        // Nếu ở chế độ online, chỉ cho phép đi nếu tới lượt phe mình
        if (gameMode === 'online' && currentTurn !== myOnlineRole) {
            playSound('error');
            return;
        }

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
                if (gameMode === 'online' && clickedPiece.team !== myOnlineRole) {
                    deselectPiece();
                    return;
                }
                selectPiece(coord);
                return;
            }

            // Click ra ô không hợp lệ -> Hủy chọn
            deselectPiece();
            return;
        }

        // 2. Chưa chọn quân nào: Nếu click vào quân của phe mình -> Chọn quân
        if (clickedPiece && clickedPiece.team === currentTurn) {
            if (gameMode === 'online' && clickedPiece.team !== myOnlineRole) {
                return;
            }
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

        if (gameMode === 'online' && currentTurn !== myOnlineRole) {
            playSound('error');
            return;
        }

        if (gameMode === 'ai' && currentTurn === Rules.TEAMS.TEAM_2) {
            return;
        }

        const piece = Rules.getPieceAt(boardState, from.x, from.y);
        if (gameMode === 'online' && piece && piece.team !== myOnlineRole) {
            playSound('error');
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
     * @param {boolean} [isRemote=false]
     */
    function executeMove(from, to, isRemote = false) {
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

        // Đồng bộ nước đi tới đối thủ qua playhtml.fun nếu đang chơi Online và là nước đi cục bộ.
        // Chỉ gửi tọa độ from/to - đối thủ sẽ tự tính lại kết quả (ăn quân, thắng/thua) bằng Rules
        // để đảm bảo 2 bên luôn đồng nhất logic, tránh sai lệch do tin tưởng dữ liệu gửi qua mạng.
        if (gameMode === 'online' && !isRemote && currentRoomCode && gameChannel) {
            gameChannel.setData((draft) => {
                draft.lastMove = {
                    from: { x: from.x, y: from.y },
                    to: { x: to.x, y: to.y },
                    senderRole: myOnlineRole,
                    timestamp: Date.now()
                };
            });
        }

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
     * Hiển thị tin nhắn chat lên khung trò chuyện
     */
    function displayChatMessage(sender, text) {
        const chatMessages = document.getElementById("chatMessages");
        if (!chatMessages) return;

        const msgDiv = document.createElement("div");
        msgDiv.style.fontSize = "12px";
        msgDiv.style.lineHeight = "1.4";
        msgDiv.innerHTML = `<strong style="color: var(--gold-color);">${sender}:</strong> ${text}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Trí tuệ nhân tạo (AI Bot cơ bản cho Phe Xanh - Team 2)
     */
    function makeAIMove() {
        if (isGameOver || currentTurn !== Rules.TEAMS.TEAM_2) return;

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

        if (allPossibleMoves.length === 0) return;

        let bestMove = null;
        let bestScore = -Infinity;

        allPossibleMoves.forEach(m => {
            let score = 0;

            // Đích đến là ô A1 (x=0, y=0) -> Thắng ngay
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

            // Thêm một chút ngẫu nhiên
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

    // --- TIỆN ÍCH URL & PHIÊN LÀM VIỆC CHO PHÒNG ĐẤU TRỰC TUYẾN ---

    /**
     * Xây dựng liên kết mời đầy đủ cho một mã phòng (VD: .../Project_Game/?room=ABCD1234)
     * @param {string} roomCode
     * @returns {string}
     */
    function buildRoomShareUrl(roomCode) {
        return window.location.origin + window.location.pathname + '?room=' + roomCode;
    }

    /**
     * Ghi lại vai trò của tab hiện tại trong 1 phòng vào sessionStorage.
     * Giúp phân biệt "người tạo phòng tải lại trang" (vẫn là Đỏ) với
     * "người bấm vào liên kết mời lần đầu" (luôn là Xanh) mà không cần máy chủ trung tâm.
     */
    function rememberRoomRole(roomCode, isCreator) {
        try {
            sessionStorage.setItem(ROOM_SESSION_KEY_PREFIX + roomCode, isCreator ? 'team1' : 'team2');
        } catch (e) {
            // sessionStorage có thể bị chặn (chế độ ẩn danh nghiêm ngặt) -> bỏ qua, không nghiêm trọng
        }
    }

    function recallRoomRole(roomCode) {
        try {
            return sessionStorage.getItem(ROOM_SESSION_KEY_PREFIX + roomCode);
        } catch (e) {
            return null;
        }
    }

    function forgetRoomRole(roomCode) {
        try {
            sessionStorage.removeItem(ROOM_SESSION_KEY_PREFIX + roomCode);
        } catch (e) {
            // bỏ qua
        }
    }

    // --- KẾT NỐI PHÒNG ĐẤU TRỰC TUYẾN QUA PLAYHTML.FUN (MÃ 8 KÝ TỰ) ---
    async function connectToPlayRoom(roomCode, isCreator = false) {
        roomCode = (roomCode || '').trim().toUpperCase();
        if (roomCode.length !== 8) {
            alert("Mã phòng phải gồm đúng 8 ký tự (VD: W4N8K2P9)!");
            return;
        }

        // Đã ở đúng phòng này rồi -> không làm gì thêm (tránh đăng ký lại listener 2 lần)
        if (gameMode === 'online' && currentRoomCode === roomCode) {
            return;
        }

        // Thư viện playhtml chỉ khởi tạo (init) một lần cho mỗi lượt tải trang.
        // Nếu tab đang ở một phòng KHÁC, cách an toàn để chuyển phòng sạch sẽ là
        // tải lại trang với mã phòng mới trên URL - tránh rò rỉ listener/observer cũ.
        if (gameMode === 'online' && currentRoomCode) {
            rememberRoomRole(roomCode, isCreator);
            window.location.href = buildRoomShareUrl(roomCode);
            return;
        }

        currentRoomCode = roomCode;
        myOnlineRole = isCreator ? Rules.TEAMS.TEAM_1 : Rules.TEAMS.TEAM_2;
        isRoomHost = isCreator;
        gameMode = 'online';
        lastProcessedMoveTime = null;
        lastProcessedChatTime = null;
        localRestartId = 0;
        localSwapId = 0;

        rememberRoomRole(roomCode, isCreator);
        try {
            window.history.replaceState(null, '', buildRoomShareUrl(roomCode));
        } catch (e) {
            // history API có thể bị chặn khi mở file cục bộ -> bỏ qua
        }

        const statusText = document.getElementById("roomStatusText");
        const badge = document.getElementById("connectionBadge");
        const roomCodeBox = document.getElementById("roomCodeBox");
        const roomCodeDisplay = document.getElementById("roomCodeDisplay");
        const roomActionsBox = document.getElementById("roomActionsBox");
        const nameInput = document.getElementById("playerNameInput");
        const p1NameEl = document.getElementById("p1Name");
        const p2NameEl = document.getElementById("p2Name");

        const myName = (nameInput && nameInput.value.trim())
            ? nameInput.value.trim()
            : (isCreator ? "Người chơi 1 (Đỏ)" : "Người chơi 2 (Xanh)");

        if (roomCodeBox) roomCodeBox.style.display = "flex";
        if (roomCodeDisplay) roomCodeDisplay.textContent = currentRoomCode;
        if (roomActionsBox) roomActionsBox.style.display = "flex";

        if (statusText) statusText.textContent = `Đang kết nối vào phòng ${currentRoomCode} qua playhtml.fun...`;
        if (badge) {
            badge.textContent = "Đang kết nối...";
            badge.className = "badge";
        }

        try {
            const p = await loadPlayHTML();
            await p.init({ room: roomCode });

            // Kênh đồng bộ nước đi và trạng thái bàn cờ
            gameChannel = p.createPageData("ottGameState", {
                lastMove: null,
                p1Name: isCreator ? myName : "",
                p2Name: !isCreator ? myName : "",
                restartId: 0,
                swapId: 0
            });

            // Kênh đồng bộ tin nhắn trò chuyện
            chatChannel = p.createPageData("ottChatState", {
                message: null
            });

            // Lắng nghe cập nhật bàn cờ từ đối thủ
            gameChannel.onUpdate((state) => {
                if (!state) return;

                if (state.p1Name && p1NameEl) p1NameEl.textContent = `${state.p1Name} (Đỏ)`;
                if (state.p2Name && p2NameEl) p2NameEl.textContent = `${state.p2Name} (Xanh)`;

                if (state.p1Name && state.p2Name) {
                    if (statusText) statusText.textContent = `Trận đấu Online đang diễn ra giữa ${state.p1Name} và ${state.p2Name}!`;
                    if (badge) {
                        badge.textContent = "Đã kết nối";
                        badge.className = "badge online";
                    }
                }

                // Xử lý nước đi nhận từ đối thủ (bỏ qua thông điệp do chính mình gửi)
                if (state.lastMove && state.lastMove.senderRole !== myOnlineRole) {
                    if (state.lastMove.timestamp && state.lastMove.timestamp !== lastProcessedMoveTime) {
                        lastProcessedMoveTime = state.lastMove.timestamp;
                        executeMove(state.lastMove.from, state.lastMove.to, true);
                    }
                }

                // Xử lý ván mới từ đối thủ (hoặc từ chính thiết bị khác của mình)
                if (typeof state.restartId === 'number' && state.restartId > 0 && state.restartId !== localRestartId) {
                    localRestartId = state.restartId;
                    initGame(true);
                }

                // Xử lý yêu cầu đổi phe - cả 2 phía cùng lật vai trò khi thấy swapId mới
                if (typeof state.swapId === 'number' && state.swapId > 0 && state.swapId !== localSwapId) {
                    localSwapId = state.swapId;
                    myOnlineRole = (myOnlineRole === Rules.TEAMS.TEAM_1) ? Rules.TEAMS.TEAM_2 : Rules.TEAMS.TEAM_1;
                    isRoomHost = !isRoomHost;
                    if (statusText) {
                        statusText.textContent = `Đã đổi phe! Bạn hiện là ${myOnlineRole === Rules.TEAMS.TEAM_1 ? 'Phe Đỏ' : 'Phe Xanh'}.`;
                    }
                    updateTurnBanner();
                }
            });

            // Lắng nghe tin nhắn chat từ đối thủ
            chatChannel.onUpdate((chatData) => {
                if (!chatData || !chatData.message) return;
                const msg = chatData.message;
                if (msg.timestamp && msg.timestamp !== lastProcessedChatTime) {
                    lastProcessedChatTime = msg.timestamp;
                    if (msg.role !== myOnlineRole) {
                        displayChatMessage(msg.sender, msg.text);
                    }
                }
            });

            // Công bố tên của mình lên kênh chung (dùng draft mutator để tránh ghi đè
            // dữ liệu đối thủ vừa cập nhật đồng thời)
            gameChannel.setData((draft) => {
                if (isCreator) {
                    draft.p1Name = myName;
                } else {
                    draft.p2Name = myName;
                }
            });

            initGame(true);

            if (isCreator) {
                if (statusText) statusText.textContent = `Đã tạo phòng ${currentRoomCode}. Bạn là Phe Đỏ. Bấm 📋 để copy liên kết mời gửi cho bạn bè!`;
                if (badge) {
                    badge.textContent = "Chờ đối thủ";
                    badge.className = "badge online";
                }
            } else {
                if (statusText) statusText.textContent = `Đã tham gia phòng ${currentRoomCode} thành công! Bạn là Phe Xanh. Đang chờ Phe Đỏ đi trước.`;
                if (badge) {
                    badge.textContent = "Đã vào phòng";
                    badge.className = "badge online";
                }
            }

            updateTurnBanner();
        } catch (err) {
            console.error("Lỗi kết nối playhtml:", err);
            if (statusText) statusText.textContent = "Lỗi kết nối playhtml.fun: " + err.message;
            if (badge) {
                badge.textContent = "Lỗi kết nối";
                badge.className = "badge";
            }
        }
    }

    /**
     * Yêu cầu đổi phe Đỏ / Xanh với đối thủ trong phòng (chỉ áp dụng trước khi
     * ván đấu có nước đi đầu tiên, để tránh đổi phe giữa chừng gây nhầm lẫn).
     * Cả 2 phía sẽ cùng tự lật vai trò của mình khi nhận được cùng 1 swapId dùng chung.
     */
    function requestSwapRole() {
        if (gameMode !== 'online' || !gameChannel) return;
        if (moveHistory.length > 0) {
            alert("Chỉ có thể đổi phe trước khi ván đấu có nước đi đầu tiên!");
            return;
        }

        const cur = gameChannel.getData() || {};
        const nextId = (cur.swapId || 0) + 1;
        localSwapId = nextId; // Tránh tự xử lý lại chính yêu cầu mình vừa gửi (echo)
        myOnlineRole = (myOnlineRole === Rules.TEAMS.TEAM_1) ? Rules.TEAMS.TEAM_2 : Rules.TEAMS.TEAM_1;
        isRoomHost = !isRoomHost;
        updateTurnBanner();

        gameChannel.setData((draft) => {
            draft.swapId = nextId;
        });
    }

    /**
     * Rời phòng đấu online hiện tại. Cách đơn giản và chắc chắn nhất để dọn dẹp
     * toàn bộ kết nối/observer của playhtml là tải lại trang mà không có ?room=.
     */
    function leaveRoom() {
        if (currentRoomCode) forgetRoomRole(currentRoomCode);
        window.location.href = window.location.pathname;
    }

    /**
     * Đưa khu vực trạng thái phòng Online về mặc định (dùng khi chuyển sang
     * chế độ chơi offline mà không tải lại trang, ví dụ lần đầu bấm mode
     * trước khi từng kết nối phòng nào).
     */
    function resetOnlineStatusUI() {
        const badge = document.getElementById("connectionBadge");
        const roomCodeBox = document.getElementById("roomCodeBox");
        const roomActionsBox = document.getElementById("roomActionsBox");
        if (badge) {
            badge.textContent = "Ngoại tuyến";
            badge.className = "badge";
        }
        if (roomCodeBox) roomCodeBox.style.display = "none";
        if (roomActionsBox) roomActionsBox.style.display = "none";
    }

    /**
     * Kiểm tra URL hiện tại có tham số ?room=XXXXXXXX hay không (liên kết mời chia sẻ).
     * Nếu có, tự động kết nối vào phòng đó - vai trò (Đỏ/Xanh) được suy ra từ
     * sessionStorage đã lưu trước đó (người tạo phòng tải lại trang) hoặc mặc định
     * là Xanh (người vừa bấm vào liên kết mời lần đầu).
     */
    function tryAutoJoinFromUrl() {
        try {
            const params = new URLSearchParams(window.location.search);
            const roomParam = (params.get('room') || '').trim().toUpperCase();
            if (!roomParam || roomParam.length !== 8) return;

            const joinInput = document.getElementById("joinRoomInput");
            if (joinInput) joinInput.value = roomParam;

            const isCreator = recallRoomRole(roomParam) === 'team1';

            const statusText = document.getElementById("roomStatusText");
            if (statusText) {
                statusText.textContent = isCreator
                    ? `Đang khôi phục phòng ${roomParam} bạn đã tạo trước đó...`
                    : `Phát hiện liên kết mời vào phòng ${roomParam}. Đang tự động tham gia...`;
            }

            connectToPlayRoom(roomParam, isCreator);
        } catch (err) {
            console.error("Lỗi tự động vào phòng từ URL:", err);
        }
    }

    // --- CÀI ĐẶT SỰ KIỆN CÁC NÚT ĐIỀU KHIỂN ---
    function setupEventListeners() {
        // Nút Ván mới / Làm mới
        const btnResetGame = document.getElementById("btnResetGame");
        if (btnResetGame) {
            btnResetGame.addEventListener("click", () => initGame(false));
        }

        const btnModalPlayAgain = document.getElementById("btnModalPlayAgain");
        if (btnModalPlayAgain) {
            btnModalPlayAgain.addEventListener("click", () => initGame(false));
        }

        const createBoardBtn = document.getElementById("createBoardBtn");
        if (createBoardBtn) {
            createBoardBtn.addEventListener("click", () => initGame(false));
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

        // Chọn chế độ chơi Pass & Play
        const btnPassAndPlay = document.getElementById("btnPassAndPlay");
        const btnVsAI = document.getElementById("btnVsAI");

        if (btnPassAndPlay) {
            btnPassAndPlay.addEventListener("click", () => {
                // Đang ở phòng Online -> thư viện playhtml chỉ init được 1 lần/trang,
                // nên rời phòng (tải lại trang) là cách sạch nhất để quay về chơi offline.
                if (gameMode === 'online' && currentRoomCode) {
                    leaveRoom();
                    return;
                }
                gameMode = 'pass_and_play';
                btnPassAndPlay.classList.add("btn-primary");
                btnPassAndPlay.classList.remove("btn-secondary");
                if (btnVsAI) {
                    btnVsAI.classList.remove("btn-primary");
                    btnVsAI.classList.add("btn-secondary");
                }
                resetOnlineStatusUI();
                const statusText = document.getElementById("roomStatusText");
                if (statusText) statusText.textContent = "Chế độ: 2 Người cùng máy (Pass & Play)";
                initGame(false);
            });
        }

        // Chọn chế độ Đấu Với Máy (AI Bot)
        if (btnVsAI) {
            btnVsAI.addEventListener("click", () => {
                if (gameMode === 'online' && currentRoomCode) {
                    leaveRoom();
                    return;
                }
                gameMode = 'ai';
                btnVsAI.classList.add("btn-primary");
                btnVsAI.classList.remove("btn-secondary");
                if (btnPassAndPlay) {
                    btnPassAndPlay.classList.remove("btn-primary");
                    btnPassAndPlay.classList.add("btn-secondary");
                }
                resetOnlineStatusUI();
                const statusText = document.getElementById("roomStatusText");
                if (statusText) statusText.textContent = "Chế độ: Đấu với Máy (AI Bot)";
                initGame(false);
            });
        }

        // --- PHÒNG ĐẤU TRỰC TUYẾN QUA PLAYHTML.FUN (MÃ 8 KÝ TỰ + LIÊN KẾT MỜI) ---
        const btnCreateRoom = document.getElementById("btnCreateRoom");
        const btnJoinRoom = document.getElementById("btnJoinRoom");
        const btnCopyCode = document.getElementById("btnCopyCode");
        const btnSwapRole = document.getElementById("btnSwapRole");
        const btnLeaveRoom = document.getElementById("btnLeaveRoom");
        const roomCodeDisplay = document.getElementById("roomCodeDisplay");

        // 1. Tạo phòng: Sinh mã 8 ký tự, kết nối và đưa mã lên URL (?room=...) để chia sẻ
        if (btnCreateRoom) {
            btnCreateRoom.addEventListener("click", () => {
                const code8 = generateRoomCode8();
                connectToPlayRoom(code8, true);
            });
        }

        // 2. Vào phòng: Nhập đúng 8 ký tự (hoặc dán từ liên kết mời)
        if (btnJoinRoom) {
            btnJoinRoom.addEventListener("click", () => {
                const joinInput = document.getElementById("joinRoomInput");
                const code = joinInput ? joinInput.value.trim().toUpperCase() : "";
                if (code.length !== 8) {
                    alert("Vui lòng nhập đúng mã phòng gồm 8 ký tự!");
                    return;
                }
                connectToPlayRoom(code, false);
            });
        }

        // Đổi phe Đỏ / Xanh (chỉ trước nước đi đầu tiên)
        if (btnSwapRole) {
            btnSwapRole.addEventListener("click", requestSwapRole);
        }

        // Rời phòng đấu online
        if (btnLeaveRoom) {
            btnLeaveRoom.addEventListener("click", leaveRoom);
        }

        // Sao chép liên kết mời đầy đủ (VD: .../Project_Game/?room=ABCD1234)
        if (btnCopyCode) {
            btnCopyCode.addEventListener("click", () => {
                const code = roomCodeDisplay ? roomCodeDisplay.textContent : "";
                if (!code || !currentRoomCode) return;
                const shareUrl = buildRoomShareUrl(code);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        btnCopyCode.textContent = "✅";
                        setTimeout(() => btnCopyCode.textContent = "📋", 1500);
                    }).catch(() => {});
                }
            });
        }

        // Tương tác Chat trong phòng
        const btnSendChat = document.getElementById("btnSendChat");
        const chatInput = document.getElementById("chatInput");

        function sendChat() {
            if (!chatInput) return;
            const text = chatInput.value.trim();
            if (!text) return;

            const nameInput = document.getElementById("playerNameInput");
            let senderName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Tôi";
            if (gameMode === 'online' && myOnlineRole) {
                senderName += (myOnlineRole === Rules.TEAMS.TEAM_1 ? " (Đỏ)" : " (Xanh)");
            }

            displayChatMessage(senderName, text);

            if (gameMode === 'online' && chatChannel) {
                const timestamp = Date.now();
                lastProcessedChatTime = timestamp; // tránh hiển thị lại chính tin của mình khi echo về
                chatChannel.setData((draft) => {
                    draft.message = {
                        sender: senderName,
                        role: myOnlineRole,
                        text: text,
                        timestamp: timestamp
                    };
                });
            }

            chatInput.value = "";
        }

        if (btnSendChat) btnSendChat.addEventListener("click", sendChat);
        if (chatInput) {
            chatInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") sendChat();
            });
        }
    }

    // Tự động khởi chạy khi DOM sẵn sàng
    if (typeof document !== 'undefined') {
        const bootstrap = () => {
            setupEventListeners();
            initGame(false);
            // Nếu trang được mở từ liên kết mời (?room=XXXXXXXX), tự động vào phòng đó
            tryAutoJoinFromUrl();
        };

        if (document.readyState === 'loading') {
            document.addEventListener("DOMContentLoaded", bootstrap);
        } else {
            bootstrap();
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
        makeMove: (from, to) => executeMove(from, to, false),
        connectToPlayRoom,
        requestSwapRole,
        leaveRoom,
        generateRoomCode8
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Game;
    }
    if (typeof global !== 'undefined') {
        global.Game = Game;
    }

})(typeof window !== 'undefined' ? window : globalThis);
