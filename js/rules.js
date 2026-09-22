

(function (global) {
    'use strict';

    /** Kích thước bàn cờ 9x9 */
    const BOARD_SIZE = 9;

    /** Trục hoành từ trái sang phải: A -> I */
    const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    /** Các loại quân cờ */
    const PIECE_TYPES = {
        ROCK: 'bua',       // Đá / Búa
        PAPER: 'bao',      // Bao
        SCISSORS: 'keo'    // Kéo
    };

    /** Số lượng quân mỗi loại cho từng đội (Tổng cộng 10 quân/đội: 3 Búa, 4 Bao, 3 Kéo) */
    const PIECE_COUNTS = {
        [PIECE_TYPES.ROCK]: 3,     // 3 quân Búa (Đá)
        [PIECE_TYPES.PAPER]: 4,    // 4 quân Bao
        [PIECE_TYPES.SCISSORS]: 3  // 3 quân Kéo
    };

    /** Danh sách 2 đội chơi */
    const TEAMS = {
        TEAM_1: 'team1', // Đội 1 (Xuất phát góc dưới-trái gần A0/A1)
        TEAM_2: 'team2'  // Đội 2 (Xuất phát góc trên-phải gần I9)
    };

    /**
     * Tọa độ ô mục tiêu của từng đội
     */
    const GOALS = {
        [TEAMS.TEAM_1]: { x: 0, y: 0, label: 'A1' }, // Mục tiêu của Đội 1 (Đội 2 cần vào đây - cứ điểm A1)
        [TEAMS.TEAM_2]: { x: 8, y: 8, label: 'I9' }  // Mục tiêu của Đội 2 (Đội 1 cần vào đây - cứ điểm I9)
    };

    const INITIAL_POSITIONS = {
        [TEAMS.TEAM_1]: [
            // Đá (3 quân)
            { type: PIECE_TYPES.ROCK,     notation: 'B4', x: 1, y: 3 },
            { type: PIECE_TYPES.ROCK,     notation: 'C3', x: 2, y: 2 },
            { type: PIECE_TYPES.ROCK,     notation: 'D2', x: 3, y: 1 },
            // Bao (4 quân)
            { type: PIECE_TYPES.PAPER,    notation: 'B5', x: 1, y: 4 },
            { type: PIECE_TYPES.PAPER,    notation: 'C4', x: 2, y: 3 },
            { type: PIECE_TYPES.PAPER,    notation: 'D3', x: 3, y: 2 },
            { type: PIECE_TYPES.PAPER,    notation: 'E2', x: 4, y: 1 },
            // Kéo (3 quân)
            { type: PIECE_TYPES.SCISSORS, notation: 'C5', x: 2, y: 4 },
            { type: PIECE_TYPES.SCISSORS, notation: 'D4', x: 3, y: 3 },
            { type: PIECE_TYPES.SCISSORS, notation: 'E3', x: 4, y: 2 }
        ],
        [TEAMS.TEAM_2]: [
            // Đá (3 quân)
            { type: PIECE_TYPES.ROCK,     notation: 'F8', x: 5, y: 7 },
            { type: PIECE_TYPES.ROCK,     notation: 'G7', x: 6, y: 6 },
            { type: PIECE_TYPES.ROCK,     notation: 'H6', x: 7, y: 5 },
            // Bao (4 quân)
            { type: PIECE_TYPES.PAPER,    notation: 'E8', x: 4, y: 7 },
            { type: PIECE_TYPES.PAPER,    notation: 'F7', x: 5, y: 6 },
            { type: PIECE_TYPES.PAPER,    notation: 'G6', x: 6, y: 5 },
            { type: PIECE_TYPES.PAPER,    notation: 'H5', x: 7, y: 4 },
            // Kéo (3 quân)
            { type: PIECE_TYPES.SCISSORS, notation: 'E7', x: 4, y: 6 },
            { type: PIECE_TYPES.SCISSORS, notation: 'F6', x: 5, y: 5 },
            { type: PIECE_TYPES.SCISSORS, notation: 'G5', x: 6, y: 4 }
        ]
    };

    /**
     * Tạo bàn cờ ban đầu với đầy đủ 20 quân cờ đã được sắp xếp đúng vị trí.
     * @returns {Array<Array<Object|null>>} Mảng 2D kích thước 9x9 [y][x]
     */
    function createInitialBoard() {
        const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

        let idCounter = 1;
        [TEAMS.TEAM_1, TEAMS.TEAM_2].forEach(team => {
            const pieces = INITIAL_POSITIONS[team];
            pieces.forEach(item => {
                board[item.y][item.x] = {
                    id: `${team}_${item.type}_${idCounter++}`,
                    type: item.type,
                    team: team,
                    x: item.x,
                    y: item.y,
                    notation: item.notation
                };
            });
        });

        return board;
    }

    /**
     * Chuyển tọa độ x, y (0-8) thành ký hiệu bàn cờ (ví dụ: x=1, y=3 -> "B4", x=8, y=8 -> "I9")
     * Quy ước chuẩn cờ vua 9x9: Cột A-I (x=0..8), Hàng 1-9 (y=0..8).
     * @param {number} x - Chỉ số cột (0 đến 8 tương ứng A đến I)
     * @param {number} y - Chỉ số hàng (0 đến 8 tương ứng 1 đến 9)
     * @returns {string} Ký hiệu cờ, ví dụ "A1", "B4", "I9"
     */
    function coordToAlgebraic(x, y) {
        if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return '';
        return `${COLUMNS[x]}${y + 1}`;
    }

    /**
     * Chuyển ký hiệu cờ (ví dụ "A0", "A1", "B4", "I9") thành tọa độ {x, y}
     * @param {string} notation
     * @returns {{x: number, y: number} | null}
     */
    function algebraicToCoord(notation) {
        if (!notation || typeof notation !== 'string' || notation.length < 2) return null;
        const colChar = notation[0].toUpperCase();
        const rowNum = parseInt(notation.slice(1), 10);
        
        const x = COLUMNS.indexOf(colChar);
        if (x === -1 || isNaN(rowNum)) return null;

        // Xử lý góc đặc biệt A0 tương đương ô đầu tiên (y = 0)
        let y;
        if (rowNum === 0) {
            y = 0;
        } else {
            y = rowNum - 1; // 1-indexed (hàng 1 -> y=0, hàng 9 -> y=8)
        }
        
        if (y < 0 || y >= BOARD_SIZE) return null;
        return { x, y };
    }

    /**
     * Kiểm tra xem tọa độ (x, y) có nằm trong phạm vi bàn cờ 9x9 hay không.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isWithinBoard(x, y) {
        return Number.isInteger(x) && Number.isInteger(y) &&
               x >= 0 && x < BOARD_SIZE &&
               y >= 0 && y < BOARD_SIZE;
    }


    /**
     * Đổi lượt chơi giữa 2 đội.
     * @param {string} currentTurn - Lượt hiện tại ('team1' hoặc 'team2')
     * @returns {string} Lượt tiếp theo
     */
    function switchTurn(currentTurn) {
        return currentTurn === TEAMS.TEAM_1 ? TEAMS.TEAM_2 : TEAMS.TEAM_1;
    }


    /**
     * Kiểm tra quân tấn công có thể ăn quân phòng thủ theo luật Oẳn Tù Tì hay không:
     * - Búa ăn Kéo
     * - Kéo ăn Bao
     * - Bao ăn Búa
     * - Cùng chức năng không thể ăn nhau (Búa x Búa, Kéo x Kéo, Bao x Bao) -> false
     *
     * @param {string} attackerType - Loại quân tấn công ('bua' | 'bao' | 'keo')
     * @param {string} defenderType - Loại quân phòng thủ ('bua' | 'bao' | 'keo')
     * @returns {boolean} True nếu ăn được, False nếu không ăn được
     */
    function canCapture(attackerType, defenderType) {
        // Không thể ăn quân cùng chức năng
        if (attackerType === defenderType) {
            return false;
        }

        if (
            (attackerType === PIECE_TYPES.ROCK && defenderType === PIECE_TYPES.SCISSORS) || // Búa đập Kéo
            (attackerType === PIECE_TYPES.SCISSORS && defenderType === PIECE_TYPES.PAPER) || // Kéo cắt Bao
            (attackerType === PIECE_TYPES.PAPER && defenderType === PIECE_TYPES.ROCK)        // Bao bọc Búa
        ) {
            return true;
        }

        return false;
    }


    /**
     * Kiểm tra hướng di chuyển có hợp lệ trong 8 hướng hay không (mỗi bước đi đúng 1 ô).
     * Tám hướng gồm: Ngang (Trái, Phải), Dọc (Lên, Xuống), Chéo (4 hướng).
     * 
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @returns {boolean}
     */
    function isValidDirection(fromX, fromY, toX, toY) {
        const dx = Math.abs(toX - fromX);
        const dy = Math.abs(toY - fromY);

        // Mỗi bước đi đúng 1 ô trong 8 hướng xung quanh (không đứng yên tại chỗ)
        return (dx <= 1 && dy <= 1) && (dx + dy > 0);
    }

    /**
     * Trích xuất thông tin quân cờ tại ô (x, y) từ boardState.
     * Hỗ trợ linh hoạt cấu trúc dữ liệu của Người 1:
     * - Dạng mảng 2D: boardState[y][x] hoặc boardState[x][y]
     * - Dạng đối tượng có hàm getPieceAt(x, y)
     * - Dạng object map key: "x,y"
     * 
     * @param {any} boardState 
     * @param {number} x 
     * @param {number} y 
     * @returns {{type: string, team: string} | null}
     */
    function getPieceAt(boardState, x, y) {
        if (!boardState) return null;

        // Board có phương thức getPieceAt(x, y)
        if (typeof boardState.getPieceAt === 'function') {
            return boardState.getPieceAt(x, y);
        }

        // Mảng 2D
        if (Array.isArray(boardState)) {
            if (boardState[y] && boardState[y][x] !== undefined) {
                return boardState[y][x];
            }
            if (boardState[x] && boardState[x][y] !== undefined) {
                return boardState[x][y];
            }
        }

        // Object map key "x,y"
        if (typeof boardState === 'object') {
            return boardState[`${x},${y}`] || boardState[`${x}_${y}`] || null;
        }

        return null;
    }

    /**
     * Kiểm tra một nước đi có hợp lệ hay không.
     * Các điều kiện kiểm tra:
     * 1. Ô xuất phát và ô đích phải nằm trong bàn cờ (0 <= x, y < 9).
     * 2. Ô xuất phát phải có quân và thuộc quyền điều khiển của đội đang đến lượt.
     * 3. Di chuyển đúng 1 ô theo 8 hướng.
     * 4. Nếu ô đích trống: Di chuyển hợp lệ.
     * 5. Nếu ô đích có quân cờ:
     *    - Không được ăn quân cùng đội.
     *    - Chỉ được đi vào nếu ăn được quân đối phương theo luật Oẳn Tù Tì.
     *
     * @param {any} boardState - Trạng thái bàn cờ hiện tại
     * @param {{x: number, y: number}} from - Tọa độ ô xuất phát
     * @param {{x: number, y: number}} to - Tọa độ ô đích
     * @param {string} currentTurn - Đội đang đến lượt ('team1' hoặc 'team2')
     * @returns {{valid: boolean, reason?: string}} Kết quả kiểm tra
     */
    function isValidMove(boardState, from, to, currentTurn) {
        if (!from || !to) {
            return { valid: false, reason: 'Tọa độ không hợp lệ' };
        }

        // 1. Kiểm tra biên bàn cờ
        if (!isWithinBoard(from.x, from.y)) {
            return { valid: false, reason: 'Tọa độ xuất phát ngoài bàn cờ' };
        }
        if (!isWithinBoard(to.x, to.y)) {
            return { valid: false, reason: 'Tọa độ đích đến ngoài bàn cờ' };
        }

        // 2. Kiểm tra quân ở ô xuất phát
        const piece = getPieceAt(boardState, from.x, from.y);
        if (!piece) {
            return { valid: false, reason: 'Không có quân cờ tại ô xuất phát' };
        }
        if (piece.team !== currentTurn) {
            return { valid: false, reason: 'Không phải lượt đi của đội sở hữu quân cờ này' };
        }

        // 3. Kiểm tra hướng và khoảng cách (8 hướng, 1 bước)
        if (!isValidDirection(from.x, from.y, to.x, to.y)) {
            return { valid: false, reason: 'Quân cờ chỉ được di chuyển 1 ô trong 8 hướng' };
        }

        // 4. Kiểm tra ô đích
        const targetPiece = getPieceAt(boardState, to.x, to.y);
        if (!targetPiece) {
            // Ô trống -> Hợp lệ
            return { valid: true };
        }

        // Ô đích có quân cùng đội
        if (targetPiece.team === piece.team) {
            return { valid: false, reason: 'Không thể di chuyển vào ô có quân cùng đội' };
        }

        // Ô đích có quân đối phương -> Kiểm tra quy tắc ăn quân Oẳn Tù Tì
        if (!canCapture(piece.type, targetPiece.type)) {
            if (piece.type === targetPiece.type) {
                return { valid: false, reason: `Không thể ăn quân cùng loại (${piece.type} hòa ${targetPiece.type})` };
            }
            return { valid: false, reason: `Quân ${piece.type} không thể ăn quân ${targetPiece.type}` };
        }

        // Ăn quân đối phương hợp lệ
        return { valid: true };
    }

    /**
     * Lấy danh sách tất cả các ô hợp lệ mà quân cờ tại vị trí `from` có thể đi tới.
     * (Hỗ trợ Người 3 vẽ vùng gợi ý di chuyển trên giao diện)
     *
     * @param {any} boardState 
     * @param {{x: number, y: number}} from 
     * @param {string} currentTurn 
     * @returns {Array<{x: number, y: number}>} Danh sách các ô có thể đi đến
     */
    function getValidMoves(boardState, from, currentTurn) {
        const validMoves = [];
        if (!isWithinBoard(from.x, from.y)) return validMoves;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const to = { x: from.x + dx, y: from.y + dy };
                const check = isValidMove(boardState, from, to, currentTurn);
                if (check.valid) {
                    validMoves.push(to);
                }
            }
        }

        return validMoves;
    }


    /**
     * Kiểm tra xem một nước đi có đưa quân vào ô mục tiêu của đối phương hay không:
     * - Đội 1 thắng khi đưa quân vào ô mục tiêu của Đội 2: I9 (x=8, y=8).
     * - Đội 2 thắng khi đưa quân vào ô mục tiêu của Đội 1: A0 (x=0, y=0).
     * 
     * @param {string} team - Đội vừa thực hiện nước đi ('team1' hoặc 'team2')
     * @param {{x: number, y: number}} destination - Vị trí quân vừa đi tới
     * @returns {boolean} True nếu đã chạm ô mục tiêu đối phương
     */
    function hasReachedEnemyGoal(team, destination) {
        if (!destination) return false;

        if (team === TEAMS.TEAM_1) {
            // Mục tiêu của Đội 1 là góc của Đội 2 (I9 / x=8, y=8)
            return destination.x === GOALS[TEAMS.TEAM_2].x && destination.y === GOALS[TEAMS.TEAM_2].y;
        } else if (team === TEAMS.TEAM_2) {
            // Mục tiêu của Đội 2 là góc của Đội 1 (A0 / x=0, y=0)
            return destination.x === GOALS[TEAMS.TEAM_1].x && destination.y === GOALS[TEAMS.TEAM_1].y;
        }
        return false;
    }

    /**
     * Đếm số lượng quân cờ còn lại trên bàn của từng đội.
     * @param {any} boardState 
     * @returns {{team1: number, team2: number}}
     */
    function countRemainingPieces(boardState) {
        let team1 = 0;
        let team2 = 0;

        for (let x = 0; x < BOARD_SIZE; x++) {
            for (let y = 0; y < BOARD_SIZE; y++) {
                const piece = getPieceAt(boardState, x, y);
                if (piece) {
                    if (piece.team === TEAMS.TEAM_1) team1++;
                    else if (piece.team === TEAMS.TEAM_2) team2++;
                }
            }
        }

        return { team1, team2 };
    }

    /**
     * Đếm chi tiết số lượng từng loại quân cờ còn lại của mỗi đội (hỗ trợ cập nhật HUD).
     * @param {any} boardState 
     * @returns {{
     *   team1: { bua: number, bao: number, keo: number, total: number },
     *   team2: { bua: number, bao: number, keo: number, total: number }
     * }}
     */
    function countPiecesByType(boardState) {
        const counts = {
            [TEAMS.TEAM_1]: { bua: 0, bao: 0, keo: 0, total: 0 },
            [TEAMS.TEAM_2]: { bua: 0, bao: 0, keo: 0, total: 0 }
        };

        for (let x = 0; x < BOARD_SIZE; x++) {
            for (let y = 0; y < BOARD_SIZE; y++) {
                const piece = getPieceAt(boardState, x, y);
                if (piece && counts[piece.team]) {
                    if (counts[piece.team][piece.type] !== undefined) {
                        counts[piece.team][piece.type]++;
                    }
                    counts[piece.team].total++;
                }
            }
        }

        return counts;
    }

    /**
     * Kiểm tra xem một đội còn nước đi hợp lệ nào không.
     * @param {any} boardState 
     * @param {string} team 
     * @returns {boolean} True nếu còn ít nhất 1 nước đi
     */
    function hasAnyValidMoves(boardState, team) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            for (let y = 0; y < BOARD_SIZE; y++) {
                const piece = getPieceAt(boardState, x, y);
                if (piece && piece.team === team) {
                    const moves = getValidMoves(boardState, { x, y }, team);
                    if (moves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Kiểm tra toàn diện điều kiện chiến thắng của trò chơi:
     * 1. Đưa quân vào ô mục tiêu của đối phương (Chiến thắng lập tức).
     * 2. Tiêu diệt toàn bộ quân đối phương (Đội kia không còn quân nào).
     * 3. Đối phương không còn nước đi hợp lệ nào (Bế tắc -> Thua).
     *
     * @param {any} boardState - Trạng thái bàn cờ hiện tại
     * @param {{team: string, to: {x: number, y: number}}} [lastMove] - Nước đi vừa thực hiện (nếu có)
     * @returns {{gameOver: boolean, winner: string | null, reason?: string}}
     */
    function checkWinCondition(boardState, lastMove) {
        // 1. Kiểm tra đưa quân vào ô mục tiêu của đối phương
        if (lastMove && lastMove.team && lastMove.to) {
            if (hasReachedEnemyGoal(lastMove.team, lastMove.to)) {
                const targetLabel = lastMove.team === TEAMS.TEAM_1 ? GOALS[TEAMS.TEAM_2].label : GOALS[TEAMS.TEAM_1].label;
                return {
                    gameOver: true,
                    winner: lastMove.team,
                    reason: `Đội ${lastMove.team === TEAMS.TEAM_1 ? '1' : '2'} đã đưa quân vào ô mục tiêu ${targetLabel} của đối phương!`
                };
            }
        }

        // 2. Kiểm tra số lượng quân còn lại
        const counts = countRemainingPieces(boardState);
        if (counts.team1 === 0 && counts.team2 > 0) {
            return {
                gameOver: true,
                winner: TEAMS.TEAM_2,
                reason: 'Đội 1 đã bị tiêu diệt toàn bộ quân cờ!'
            };
        }
        if (counts.team2 === 0 && counts.team1 > 0) {
            return {
                gameOver: true,
                winner: TEAMS.TEAM_1,
                reason: 'Đội 2 đã bị tiêu diệt toàn bộ quân cờ!'
            };
        }

        // 3. Kiểm tra bế tắc nước đi (Stalemate)
        const nextTurn = lastMove && lastMove.team ? switchTurn(lastMove.team) : TEAMS.TEAM_1;
        if (!hasAnyValidMoves(boardState, nextTurn)) {
            const winningTeam = switchTurn(nextTurn);
            return {
                gameOver: true,
                winner: winningTeam,
                reason: `Đội ${nextTurn === TEAMS.TEAM_1 ? '1' : '2'} không còn nước đi hợp lệ nào!`
            };
        }

        return { gameOver: false, winner: null };
    }


    const Rules = {
        BOARD_SIZE,
        COLUMNS,
        PIECE_TYPES,
        PIECE_COUNTS,
        TEAMS,
        GOALS,
        INITIAL_POSITIONS,
        createInitialBoard,
        coordToAlgebraic,
        algebraicToCoord,
        isWithinBoard,
        switchTurn,
        canCapture,
        isValidDirection,
        getPieceAt,
        isValidMove,
        getValidMoves,
        hasReachedEnemyGoal,
        countRemainingPieces,
        countPiecesByType,
        hasAnyValidMoves,
        checkWinCondition
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Rules;
    }
    if (typeof global !== 'undefined') {
        global.Rules = Rules;
    }

})(typeof window !== 'undefined' ? window : globalThis);
