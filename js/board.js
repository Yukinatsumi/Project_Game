/**
 * ===================================================================
 * BOARD.JS - Module hiển thị & Tương tác Bàn Cờ 9x9
 * Kết hợp hoàn chỉnh giữa Person 1 (Drag & Drop, data-col, data-row)
 * và Person 3 (Yuki: style dark cyber, cell classes, highlight moves)
 * ===================================================================
 */

(function (global) {
    'use strict';

    // Cấu hình hiển thị quân cờ (tương thích cả tên tiếng Việt 'bua', 'bao', 'keo' và tiếng Anh)
    const pieceConfig = {
        // Tiếng Việt theo rules.js
        bua: { label: "✊", name: "Búa (Đấm)", symbol: "✊" },
        bao: { label: "🖐️", name: "Bao (Lá)", symbol: "🖐️" },
        keo: { label: "✌️", name: "Kéo", symbol: "✌️" },
        // Tương thích Person 1 (tmp/board.js)
        rock: { label: "✊", name: "Búa (Đá)", symbol: "✊" },
        paper: { label: "🖐️", name: "Bao", symbol: "🖐️" },
        scissors: { label: "✌️", name: "Kéo", symbol: "✌️" }
    };

    let boardElement = null;
    let selectedCell = null;
    let currentValidMoves = [];
    let onCellClickHandler = null;
    let onPieceDropHandler = null;

    // Danh sách phẳng các quân cờ để tương thích Person 1
    let pieces = [];

    /**
     * Lấy phần tử bàn cờ trên DOM (hỗ trợ cả #boardGrid của Yuki và #board của Person 1)
     */
    function getBoardElement() {
        if (!boardElement) {
            boardElement = document.getElementById("boardGrid") || document.getElementById("board");
        }
        return boardElement;
    }

    /**
     * Đồng bộ mảng phẳng pieces[] từ boardState 2D (9x9)
     */
    function syncFlatPieces(boardState) {
        pieces = [];
        if (!boardState) return;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const p = (typeof Rules !== 'undefined' && Rules.getPieceAt) 
                    ? Rules.getPieceAt(boardState, x, y) 
                    : (boardState[y] ? boardState[y][x] : null);

                if (p) {
                    pieces.push({
                        id: p.id || `piece_${p.team}_${p.type}_${x}_${y}`,
                        type: p.type,
                        team: p.team,
                        color: p.team === 'team1' ? 'red' : 'blue',
                        col: x,
                        row: y,
                        x: x,
                        y: y
                    });
                }
            }
        }
    }

    /**
     * Tạo lưới 81 ô cờ 9x9 trên DOM
     * Thứ tự hiển thị: Hàng 9 (trên cùng, y=8) xuống Hàng 1 (dưới cùng, y=0).
     * Cột a (trái, x=0) sang Cột i (phải, x=8).
     *
     * @param {Array<Array<Object|null>>} [boardState]
     * @param {Function} [onCellClick]
     * @param {Function} [onPieceDrop]
     */
    function createBoard(boardState, onCellClick, onPieceDrop) {
        const board = getBoardElement();
        if (!board) return;

        if (onCellClick) onCellClickHandler = onCellClick;
        if (onPieceDrop) onPieceDropHandler = onPieceDrop;

        board.innerHTML = "";

        // Duyệt từ hàng 9 (visual row = 0, y = 8) xuống hàng 1 (visual row = 8, y = 0)
        for (let r = 8; r >= 0; r--) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement("div");
                const x = c;
                const y = r;

                // Màu xen kẽ: (x + y) chẵn là light/white, lẻ là dark/black
                const isLight = (x + y) % 2 === 0;
                cell.className = `cell ${isLight ? 'light white' : 'dark black'}`;

                // Cứ điểm đặc biệt: a1 (x=0, y=0) và i9 (x=8, y=8)
                if (x === 0 && y === 0) {
                    cell.classList.add("base-a1");
                } else if (x === 8 && y === 8) {
                    cell.classList.add("base-i9");
                }

                // Gán dữ liệu tọa độ cho ô cờ
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.col = x;
                cell.dataset.row = y;
                if (typeof Rules !== 'undefined' && Rules.coordToAlgebraic) {
                    cell.dataset.notation = Rules.coordToAlgebraic(x, y);
                }

                // --- SỰ KIỆN KÉO THẢ (Drag & Drop) ---
                cell.addEventListener("dragover", (event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    cell.classList.add("drag-over");
                });

                cell.addEventListener("dragleave", () => {
                    cell.classList.remove("drag-over");
                });

                cell.addEventListener("drop", (event) => {
                    event.preventDefault();
                    cell.classList.remove("drag-over");
                    const board = getBoardElement();
                    if (board) board.classList.remove("is-dragging");

                    const draggedData = event.dataTransfer.getData("text/plain");
                    if (!draggedData) return;

                    try {
                        const data = JSON.parse(draggedData);
                        const targetCell = event.target.closest(".cell") || cell;
                        const from = { x: Number(data.x), y: Number(data.y) };
                        const to = { x: Number(targetCell.dataset.x), y: Number(targetCell.dataset.y) };

                        if (onPieceDropHandler) {
                            onPieceDropHandler(from, to, data.pieceId);
                        } else if (global.Game && typeof global.Game.handleMove === 'function') {
                            global.Game.handleMove(from, to);
                        }
                    } catch (err) {
                        console.error("Lỗi xử lý drop quân cờ:", err);
                    }
                });

                // --- SỰ KIỆN CLICK Ô CỜ ---
                cell.addEventListener("click", (event) => {
                    const targetCell = event.target.closest(".cell") || cell;
                    const cellCoord = {
                        x: Number(targetCell.dataset.x),
                        y: Number(targetCell.dataset.y)
                    };

                    if (onCellClickHandler) {
                        onCellClickHandler(cellCoord, targetCell);
                    } else if (global.Game && typeof global.Game.handleCellClick === 'function') {
                        global.Game.handleCellClick(cellCoord, targetCell);
                    }
                });

                board.appendChild(cell);
            }
        }

        if (boardState) {
            renderPieces(boardState);
        }
    }

    /**
     * Vẽ và cập nhật toàn bộ quân cờ lên bàn cờ
     * @param {Array<Array<Object|null>>} boardState 
     */
    function renderPieces(boardState) {
        const board = getBoardElement();
        if (!board) return;

        syncFlatPieces(boardState);

        const cells = board.querySelectorAll(".cell");
        cells.forEach((cell) => {
            const x = Number(cell.dataset.x);
            const y = Number(cell.dataset.y);

            // Xóa quân cờ cũ nếu có
            const existing = cell.querySelector(".piece");
            if (existing) existing.remove();

            const piece = (typeof Rules !== 'undefined' && Rules.getPieceAt)
                ? Rules.getPieceAt(boardState, x, y)
                : (boardState && boardState[y] ? boardState[y][x] : null);

            if (!piece) return;

            const pieceEl = document.createElement("div");
            const config = pieceConfig[piece.type] || { label: "❓", name: piece.type, symbol: "❓" };
            const isRed = (piece.team === 'team1' || piece.team === 'red');
            const teamClass = isRed ? "red-piece red" : "blue-piece blue";

            pieceEl.className = `piece ${piece.type} ${teamClass}`;
            pieceEl.draggable = true;
            pieceEl.textContent = config.label;
            pieceEl.title = `${config.name} (${isRed ? 'Phe Đỏ' : 'Phe Xanh'})`;
            pieceEl.dataset.id = piece.id || `piece_${x}_${y}`;
            pieceEl.dataset.type = piece.type;
            pieceEl.dataset.team = piece.team;
            pieceEl.dataset.x = x;
            pieceEl.dataset.y = y;

            // Sự kiện DragStart
            pieceEl.addEventListener("dragstart", (event) => {
                const dragPayload = {
                    pieceId: pieceEl.dataset.id,
                    type: piece.type,
                    team: piece.team,
                    x: x,
                    y: y
                };
                event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
                event.dataTransfer.effectAllowed = "move";
                pieceEl.classList.add("dragging");

                // Thêm class is-dragging vào bàn cờ để kích hoạt pointer-events: none trên các quân khác
                const bEl = getBoardElement();
                if (bEl) bEl.classList.add("is-dragging");

                // Nếu có game controller, tự động chọn quân cờ này và vẽ gợi ý
                if (global.Game && typeof global.Game.selectPiece === 'function') {
                    global.Game.selectPiece({ x, y });
                }
            });

            // Sự kiện DragEnd
            pieceEl.addEventListener("dragend", () => {
                pieceEl.classList.remove("dragging");
                const bEl = getBoardElement();
                if (bEl) {
                    bEl.classList.remove("is-dragging");
                    bEl.querySelectorAll(".drag-over").forEach(c => c.classList.remove("drag-over"));
                }
            });

            cell.appendChild(pieceEl);
        });
    }

    /**
     * Lấy phần tử ô cờ trên DOM theo tọa độ (x, y)
     * @param {number} x
     * @param {number} y
     * @returns {HTMLElement|null}
     */
    function getCell(x, y) {
        const board = getBoardElement();
        if (!board) return null;
        return board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    }

    /**
     * Tô sáng các ô nước đi hợp lệ
     * @param {Array<{x: number, y: number}>} validMoves
     * @param {Array<Array<Object|null>>} boardState
     * @param {{x: number, y: number}} selectedCoord
     */
    function highlightMoves(validMoves, boardState, selectedCoord) {
        clearHighlights();

        // Đánh dấu ô đang được chọn
        if (selectedCoord) {
            const cell = getCell(selectedCoord.x, selectedCoord.y);
            if (cell) cell.classList.add("selected");
            selectedCell = cell;
        }

        currentValidMoves = validMoves || [];

        currentValidMoves.forEach((move) => {
            const cell = getCell(move.x, move.y);
            if (!cell) return;

            const targetPiece = (typeof Rules !== 'undefined' && Rules.getPieceAt)
                ? Rules.getPieceAt(boardState, move.x, move.y)
                : (boardState && boardState[move.y] ? boardState[move.y][move.x] : null);

            if (targetPiece) {
                // Ô có quân địch -> Tấn công ăn quân
                cell.classList.add("valid-attack");
            } else {
                // Ô trống -> Di chuyển
                cell.classList.add("valid-move");
            }
        });
    }

    /**
     * Đánh dấu vệt nước đi gần nhất (nguồn và đích)
     * @param {{x: number, y: number}} from
     * @param {{x: number, y: number}} to
     */
    function highlightLastMove(from, to) {
        const board = getBoardElement();
        if (!board) return;

        board.querySelectorAll(".last-move-src, .last-move-dest").forEach(el => {
            el.classList.remove("last-move-src", "last-move-dest");
        });

        if (from) {
            const srcCell = getCell(from.x, from.y);
            if (srcCell) srcCell.classList.add("last-move-src");
        }
        if (to) {
            const destCell = getCell(to.x, to.y);
            if (destCell) destCell.classList.add("last-move-dest");
        }
    }

    /**
     * Xóa toàn bộ các highlight gợi ý di chuyển
     */
    function clearHighlights() {
        const board = getBoardElement();
        if (!board) return;

        board.querySelectorAll(".cell.selected, .cell.valid-move, .cell.valid-attack").forEach((cell) => {
            cell.classList.remove("selected", "valid-move", "valid-attack");
        });

        selectedCell = null;
        currentValidMoves = [];
    }

    /**
     * Hàm render lại toàn bộ bàn cờ (tương thích Person 1 renderBoard)
     */
    function renderBoard(boardState) {
        const state = boardState || (global.Game ? global.Game.getBoardState() : null);
        createBoard(state);
    }

    // Export module
    const Board = {
        pieceConfig,
        pieces,
        getBoardElement,
        createBoard,
        renderPieces,
        renderBoard,
        getCell,
        highlightMoves,
        highlightLastMove,
        clearHighlights
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Board;
    }
    if (typeof global !== 'undefined') {
        global.Board = Board;
        // Xuất các hàm toàn cục để tương thích tmp/board.js
        global.createBoard = createBoard;
        global.renderBoard = renderBoard;
        global.renderPieces = renderPieces;
        global.pieceConfig = pieceConfig;
        global.pieces = pieces;
    }

})(typeof window !== 'undefined' ? window : globalThis);