/**
 * ===================================================================
 * SERVER.JS - Máy chủ HTTP & WebSocket phục vụ Cờ Oẳn Tù Tì 9x9 (OTTv2)
 * Môn học: Lập trình mạng
 * Thuần Node.js (Zero-dependency, không cần cài đặt thêm thư viện ngoài)
 * 
 * Hỗ trợ:
 * - Phục vụ tệp tĩnh HTTP (HTML, CSS, JS, Assets)
 * - Máy chủ WebSocket chuẩn RFC 6455 tích hợp sẵn
 * - Quản lý phòng đấu 8 ký tự, ghép trận, chat, đồng bộ nước đi
 * - Cơ chế phân định vai trò Đỏ - Xanh ngẫu nhiên (Coin flip 50/50)
 * ===================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

// --- QUẢN LÝ PHÒNG ĐẤU TRONG BỘ NHỚ ---
const rooms = new Map(); // roomCode -> roomData
const clientToRoom = new Map(); // socket -> { roomCode, isHost, playerId, playerName }

/**
 * Tạo frame WebSocket RFC 6455 gửi từ server về client (không mask)
 */
function sendWsFrame(socket, opcode, data) {
    if (!socket || socket.destroyed) return;
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
    const len = payload.length;
    let header;

    if (len <= 125) {
        header = Buffer.alloc(2);
        header[0] = 0x80 | (opcode & 0x0F);
        header[1] = len;
    } else if (len <= 65535) {
        header = Buffer.alloc(4);
        header[0] = 0x80 | (opcode & 0x0F);
        header[1] = 126;
        header.writeUInt16BE(len, 2);
    } else {
        header = Buffer.alloc(10);
        header[0] = 0x80 | (opcode & 0x0F);
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(len), 2);
    }

    try {
        socket.write(Buffer.concat([header, payload]));
    } catch (err) {
        console.warn('Lỗi ghi socket WebSocket:', err.message);
    }
}

function sendWsJson(socket, obj) {
    sendWsFrame(socket, 0x1, JSON.stringify(obj));
}

/**
 * Xử lý thông điệp từ Client gửi lên WebSocket
 */
function handleWsMessage(socket, rawText) {
    let msg;
    try {
        msg = JSON.parse(rawText);
    } catch (e) {
        return;
    }

    const { type, roomCode } = msg;

    // 1. TẠO PHÒNG
    if (type === 'CREATE_ROOM') {
        const code = (roomCode || '').trim().toUpperCase();
        if (!code || code.length !== 8) {
            sendWsJson(socket, { type: 'ERROR', message: 'Mã phòng phải gồm đúng 8 ký tự!' });
            return;
        }

        const playerName = (msg.playerName || 'Người chơi 1').trim();
        const rolePreference = msg.rolePreference || 'random'; // 'random' | 'team1' | 'team2'
        const playerId = 'player_' + Math.random().toString(36).substring(2, 9);

        // Lưu thông tin phòng
        const roomData = {
            code: code,
            host: { socket, playerId, playerName, rolePreference },
            guest: null,
            roles: { host: 'team1', guest: 'team2' },
            currentTurn: 'team1',
            turnCount: 1,
            createdTime: Date.now()
        };

        rooms.set(code, roomData);
        clientToRoom.set(socket, { roomCode: code, isHost: true, playerId, playerName });

        sendWsJson(socket, {
            type: 'ROOM_CREATED',
            roomCode: code,
            rolePreference: rolePreference,
            message: `Đã tạo phòng ${code}. Đang chờ người chơi thứ hai tham gia...`
        });
        console.log(`[LAN-WS] Phòng ${code} được tạo bởi ${playerName} (Ưu tiên vai trò: ${rolePreference})`);
        return;
    }

    // 2. VÀO PHÒNG
    if (type === 'JOIN_ROOM') {
        const code = (roomCode || '').trim().toUpperCase();
        const roomData = rooms.get(code);

        if (!roomData) {
            sendWsJson(socket, { type: 'ERROR', message: `Phòng ${code} không tồn tại hoặc đã đóng!` });
            return;
        }

        if (roomData.guest && !roomData.guest.socket.destroyed) {
            sendWsJson(socket, { type: 'ERROR', message: `Phòng ${code} đã đủ 2 người chơi!` });
            return;
        }

        const playerName = (msg.playerName || 'Người chơi 2').trim();
        const playerId = 'player_' + Math.random().toString(36).substring(2, 9);

        roomData.guest = { socket, playerId, playerName };
        clientToRoom.set(socket, { roomCode: code, isHost: false, playerId, playerName });

        // PHÂN ĐỊNH VAI TRÒ ĐỎ - XANH
        const pref = roomData.host.rolePreference || 'random';
        if (pref === 'team1') {
            roomData.roles = { host: 'team1', guest: 'team2' };
        } else if (pref === 'team2') {
            roomData.roles = { host: 'team2', guest: 'team1' };
        } else {
            // Ngẫu nhiên 50/50
            const hostIsRed = Math.random() < 0.5;
            roomData.roles = {
                host: hostIsRed ? 'team1' : 'team2',
                guest: hostIsRed ? 'team2' : 'team1'
            };
        }

        roomData.currentTurn = 'team1'; // Phe Đỏ luôn đi trước
        roomData.turnCount = 1;

        console.log(`[LAN-WS] Phòng ${code}: ${playerName} đã tham gia. Phân vai: Host=${roomData.roles.host}, Guest=${roomData.roles.guest}`);

        // Gửi thông báo bắt đầu trận đấu tới cả Chủ phòng và Khách
        sendWsJson(roomData.host.socket, {
            type: 'GAME_START',
            roomCode: code,
            isHost: true,
            yourRole: roomData.roles.host,
            opponentName: roomData.guest.playerName,
            opponentRole: roomData.roles.guest,
            currentTurn: roomData.currentTurn,
            turnCount: 1,
            roles: roomData.roles
        });

        sendWsJson(roomData.guest.socket, {
            type: 'GAME_START',
            roomCode: code,
            isHost: false,
            yourRole: roomData.roles.guest,
            opponentName: roomData.host.playerName,
            opponentRole: roomData.roles.host,
            currentTurn: roomData.currentTurn,
            turnCount: 1,
            roles: roomData.roles
        });
        return;
    }

    // 3. ĐỒNG BỘ NƯỚC ĐI
    if (type === 'MOVE') {
        const clientInfo = clientToRoom.get(socket);
        if (!clientInfo) return;

        const roomData = rooms.get(clientInfo.roomCode);
        if (!roomData || !roomData.host || !roomData.guest) return;

        const opponentSocket = clientInfo.isHost ? roomData.guest.socket : roomData.host.socket;

        // Chuyển tiếp nước đi nguyên vẹn sang đối thủ
        sendWsJson(opponentSocket, {
            type: 'MOVE_SYNC',
            from: msg.from,
            to: msg.to,
            pieceId: msg.pieceId,
            pieceType: msg.pieceType,
            isCapture: msg.isCapture,
            capturedPiece: msg.capturedPiece,
            currentTurn: msg.currentTurn,
            turnCount: msg.turnCount,
            senderRole: msg.senderRole
        });
        return;
    }

    // 4. TRÒ CHUYỆN (CHAT)
    if (type === 'CHAT') {
        const clientInfo = clientToRoom.get(socket);
        if (!clientInfo) return;

        const roomData = rooms.get(clientInfo.roomCode);
        if (!roomData) return;

        const opponentSocket = clientInfo.isHost 
            ? (roomData.guest ? roomData.guest.socket : null)
            : roomData.host.socket;

        if (opponentSocket) {
            sendWsJson(opponentSocket, {
                type: 'CHAT_SYNC',
                text: msg.text,
                sender: msg.sender,
                role: msg.role,
                timestamp: Date.now()
            });
        }
        return;
    }

    // 5. ĐỔI VAI TRÒ (SWAP ROLES)
    if (type === 'SWAP_ROLE') {
        const clientInfo = clientToRoom.get(socket);
        if (!clientInfo) return;

        const roomData = rooms.get(clientInfo.roomCode);
        if (!roomData || !roomData.host || !roomData.guest) return;

        // Đảo ngược vai trò
        const oldHostRole = roomData.roles.host;
        roomData.roles.host = (oldHostRole === 'team1') ? 'team2' : 'team1';
        roomData.roles.guest = (roomData.roles.host === 'team1') ? 'team2' : 'team1';
        roomData.currentTurn = 'team1';
        roomData.turnCount = 1;

        console.log(`[LAN-WS] Phòng ${clientInfo.roomCode} đổi phe: Host=${roomData.roles.host}, Guest=${roomData.roles.guest}`);

        sendWsJson(roomData.host.socket, {
            type: 'ROLES_SWAPPED',
            yourRole: roomData.roles.host,
            opponentRole: roomData.roles.guest,
            currentTurn: 'team1',
            turnCount: 1,
            roles: roomData.roles
        });

        sendWsJson(roomData.guest.socket, {
            type: 'ROLES_SWAPPED',
            yourRole: roomData.roles.guest,
            opponentRole: roomData.roles.host,
            currentTurn: 'team1',
            turnCount: 1,
            roles: roomData.roles
        });
        return;
    }

    // 6. VÁN MỚI (RESTART)
    if (type === 'RESTART') {
        const clientInfo = clientToRoom.get(socket);
        if (!clientInfo) return;

        const roomData = rooms.get(clientInfo.roomCode);
        if (!roomData) return;

        if (msg.randomizeRoles && roomData.host && roomData.guest) {
            const hostIsRed = Math.random() < 0.5;
            roomData.roles = {
                host: hostIsRed ? 'team1' : 'team2',
                guest: hostIsRed ? 'team2' : 'team1'
            };
        }

        roomData.currentTurn = 'team1';
        roomData.turnCount = 1;

        const payload = {
            type: 'RESTART_SYNC',
            currentTurn: 'team1',
            turnCount: 1,
            roles: roomData.roles
        };

        if (roomData.host) {
            sendWsJson(roomData.host.socket, { ...payload, yourRole: roomData.roles.host });
        }
        if (roomData.guest) {
            sendWsJson(roomData.guest.socket, { ...payload, yourRole: roomData.roles.guest });
        }
        return;
    }
}

/**
 * Xử lý ngắt kết nối WebSocket
 */
function handleWsClose(socket) {
    const clientInfo = clientToRoom.get(socket);
    if (!clientInfo) return;

    clientToRoom.delete(socket);
    const roomData = rooms.get(clientInfo.roomCode);
    if (!roomData) return;

    console.log(`[LAN-WS] ${clientInfo.playerName} (${clientInfo.isHost ? 'Chủ phòng' : 'Khách'}) đã thoát phòng ${clientInfo.roomCode}`);

    if (clientInfo.isHost) {
        // Chủ phòng thoát: nếu có khách, báo cho khách biết
        if (roomData.guest && !roomData.guest.socket.destroyed) {
            sendWsJson(roomData.guest.socket, {
                type: 'PLAYER_LEFT',
                message: 'Chủ phòng đã thoát. Phòng đấu đã kết thúc.'
            });
        }
        rooms.delete(clientInfo.roomCode);
    } else {
        // Khách thoát: báo cho chủ phòng biết
        if (roomData.host && !roomData.host.socket.destroyed) {
            roomData.guest = null;
            sendWsJson(roomData.host.socket, {
                type: 'PLAYER_LEFT',
                message: 'Đối thủ đã ngắt kết nối hoặc thoát phòng. Đang chờ người chơi mới...'
            });
        } else {
            rooms.delete(clientInfo.roomCode);
        }
    }
}

// --- MÁY CHỦ HTTP PHỤC VỤ STATIC FILES ---
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // Mặc định chuyển hướng root sang game.html
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/game.html';
    }

    // Chặn directory traversal
    const safePath = path.normalize(decodeURIComponent(reqUrl)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('404 - Không tìm thấy tệp: ' + reqUrl);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        fs.createReadStream(filePath).pipe(res);
    });
});

// --- TÍCH HỢP WEBSOCKET SERVER RFC 6455 QUA SỰ KIỆN UPGRADE ---
server.on('upgrade', (req, socket, head) => {
    const upgradeHeader = (req.headers['upgrade'] || '').toLowerCase();
    if (upgradeHeader !== 'websocket') {
        socket.destroy();
        return;
    }

    const secKey = req.headers['sec-websocket-key'];
    if (!secKey) {
        socket.destroy();
        return;
    }

    // Tính toán Sec-WebSocket-Accept theo chuẩn RFC 6455
    const acceptKey = crypto.createHash('sha1')
        .update(secKey + WS_GUID)
        .digest('base64');

    socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
    );

    let buffer = Buffer.alloc(0);

    socket.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length >= 2) {
            const firstByte = buffer[0];
            const secondByte = buffer[1];
            const opcode = firstByte & 0x0F;
            const isMasked = (secondByte & 0x80) !== 0;
            let payloadLen = secondByte & 0x7F;
            let offset = 2;

            if (payloadLen === 126) {
                if (buffer.length < offset + 2) break;
                payloadLen = buffer.readUInt16BE(offset);
                offset += 2;
            } else if (payloadLen === 127) {
                if (buffer.length < offset + 8) break;
                payloadLen = Number(buffer.readBigUInt64BE(offset));
                offset += 8;
            }

            let maskKey = null;
            if (isMasked) {
                if (buffer.length < offset + 4) break;
                maskKey = buffer.slice(offset, offset + 4);
                offset += 4;
            }

            if (buffer.length < offset + payloadLen) break;

            let payload = buffer.slice(offset, offset + payloadLen);
            buffer = buffer.slice(offset + payloadLen);

            if (isMasked && maskKey) {
                const unmasked = Buffer.alloc(payloadLen);
                for (let i = 0; i < payloadLen; i++) {
                    unmasked[i] = payload[i] ^ maskKey[i % 4];
                }
                payload = unmasked;
            }

            // Xử lý opcode
            if (opcode === 0x8) { // Close frame
                handleWsClose(socket);
                socket.end();
                return;
            } else if (opcode === 0x9) { // Ping frame -> trả lời Pong
                sendWsFrame(socket, 0xA, payload);
            } else if (opcode === 0x1) { // Text frame
                const rawText = payload.toString('utf8');
                handleWsMessage(socket, rawText);
            }
        }
    });

    socket.on('error', (err) => {
        handleWsClose(socket);
    });

    socket.on('close', () => {
        handleWsClose(socket);
    });
});

// Lấy danh sách địa chỉ IP trong mạng LAN
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ips.push(net.address);
            }
        }
    }
    return ips;
}

server.listen(PORT, () => {
    console.log('====================================================');
    console.log('⚔️  MÁY CHỦ CỜ OẲN TÙ TÌ 9x9 (HTTP + WEBSOCKET LAN)');
    console.log('====================================================');
    console.log(`> Cục bộ (Localhost):   http://localhost:${PORT}`);
    const localIPs = getLocalIPs();
    localIPs.forEach(ip => {
        console.log(`> Trong mạng LAN:       http://${ip}:${PORT}`);
    });
    console.log(`> WebSocket LAN:        ws://localhost:${PORT}/ws`);
    console.log('====================================================');
    console.log('Đã tích hợp WebSocket Server thuần RFC 6455!');
    console.log('Nhấn Ctrl+C để dừng máy chủ.\n');
});
