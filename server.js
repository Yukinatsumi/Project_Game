/**
 * ===================================================================
 * SERVER.JS - Máy chủ HTTP phục vụ trò chơi Cờ Oẳn Tù Tì 9x9 (OTTv2)
 * Môn học: Lập trình mạng
 * Thuần Node.js (Zero-dependency, không cần cài đặt thêm thư viện ngoài)
 * ===================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

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

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // Mặc định chuyển hướng root sang game.html
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/game.html';
    }

    // Chặn đường dẫn thoát khỏi thư mục gốc (Directory traversal protection)
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
    console.log('⚔️  MÁY CHỦ CỜ OẲN TÙ TÌ 9x9 (OTTV2) ĐÃ KHỞI CHẠY!');
    console.log('====================================================');
    console.log(`> Máy cục bộ (Localhost): http://localhost:${PORT}`);
    const localIPs = getLocalIPs();
    localIPs.forEach(ip => {
        console.log(`> Trong mạng LAN:         http://${ip}:${PORT}`);
    });
    console.log('====================================================');
    console.log('Nhấn Ctrl+C để dừng máy chủ.\n');
});
