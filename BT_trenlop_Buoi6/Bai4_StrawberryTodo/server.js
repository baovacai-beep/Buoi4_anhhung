const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const db = require('./db');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const VALID_PRIORITIES = new Set(['low', 'medium', 'high']);
const VALID_STATUSES = new Set(['todo', 'in_progress', 'done']);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(body);
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
            if (raw.length > 1024 * 1024) {
                reject(new Error('PAYLOAD_TOO_LARGE'));
                req.destroy();
            }
        });
        req.on('end', () => {
            if (!raw.trim()) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new Error('INVALID_JSON'));
            }
        });
        req.on('error', reject);
    });
}

function validateTodoInput(data, { isPartial = false } = {}) {
    const errors = [];
    const cleaned = {};

    if (!isPartial || data.title !== undefined) {
        const title = typeof data.title === 'string' ? data.title.trim() : '';
        if (!title) {
            errors.push('Tiêu đề công việc không được để trống.');
        } else if (title.length > 140) {
            errors.push('Tiêu đề công việc tối đa 140 ký tự.');
        } else {
            cleaned.title = title;
        }
    }

    if (data.description !== undefined) {
        cleaned.description = typeof data.description === 'string' ? data.description.trim().slice(0, 500) : '';
    }

    if (data.category !== undefined) {
        const cat = typeof data.category === 'string' ? data.category.trim() : '';
        cleaned.category = cat || 'Học tập';
    }

    if (data.priority !== undefined) {
        if (!VALID_PRIORITIES.has(data.priority)) {
            errors.push('Mức ưu tiên không hợp lệ (low, medium, high).');
        } else {
            cleaned.priority = data.priority;
        }
    }

    if (data.status !== undefined) {
        if (!VALID_STATUSES.has(data.status)) {
            errors.push('Trạng thái không hợp lệ (todo, in_progress, done).');
        } else {
            cleaned.status = data.status;
        }
    }

    if (data.sticker !== undefined) {
        const sticker = typeof data.sticker === 'string' ? data.sticker.trim() : '';
        cleaned.sticker = sticker ? sticker.slice(0, 8) : '🍓';
    }

    if (data.due_date !== undefined) {
        const due = typeof data.due_date === 'string' ? data.due_date.trim() : '';
        if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
            errors.push('Ngày hạn chót phải có định dạng YYYY-MM-DD.');
        } else {
            cleaned.due_date = due;
        }
    }

    return { errors, cleaned };
}

function serveStaticFile(res, pathname) {
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
    const fullPath = path.join(PUBLIC_DIR, safePath);

    if (!fullPath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Internal Server Error');
            }
            return;
        }
        const ext = path.extname(fullPath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(content);
    });
}

async function handleApi(req, res, parsedUrl) {
    const { pathname, searchParams } = parsedUrl;
    const method = req.method.toUpperCase();

    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // GET /api/health
    if (method === 'GET' && pathname === '/api/health') {
        return sendJson(res, 200, {
            ok: true,
            app: 'Dâu Cute TODO App',
            database: path.basename(db.DB_PATH)
        });
    }

    // GET /api/stats
    if (method === 'GET' && pathname === '/api/stats') {
        return sendJson(res, 200, { ok: true, data: db.getStats() });
    }

    // GET /api/todos
    if (method === 'GET' && pathname === '/api/todos') {
        const todos = db.listTodos({
            status: searchParams.get('status'),
            category: searchParams.get('category'),
            priority: searchParams.get('priority'),
            search: searchParams.get('search'),
            sort: searchParams.get('sort')
        });
        return sendJson(res, 200, { ok: true, data: todos });
    }

    // POST /api/todos
    if (method === 'POST' && pathname === '/api/todos') {
        const body = await readJsonBody(req);
        const { errors, cleaned } = validateTodoInput(body, { isPartial: false });
        if (errors.length > 0) {
            return sendJson(res, 400, { ok: false, error: errors[0], errors });
        }
        const created = db.createTodo(cleaned);
        return sendJson(res, 201, { ok: true, data: created });
    }

    // DELETE /api/todos/completed
    if (method === 'DELETE' && pathname === '/api/todos/completed') {
        const deletedCount = db.deleteCompletedTodos();
        return sendJson(res, 200, { ok: true, deletedCount });
    }

    // Routes with :id
    const statusMatch = pathname.match(/^\/api\/todos\/(\d+)\/status$/);
    if (method === 'PATCH' && statusMatch) {
        const id = Number(statusMatch[1]);
        const body = await readJsonBody(req);
        if (!VALID_STATUSES.has(body.status)) {
            return sendJson(res, 400, { ok: false, error: 'Trạng thái không hợp lệ.' });
        }
        const updated = db.updateTodoStatus(id, body.status);
        if (!updated) {
            return sendJson(res, 404, { ok: false, error: 'Không tìm thấy công việc.' });
        }
        return sendJson(res, 200, { ok: true, data: updated });
    }

    const idMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
    if (idMatch) {
        const id = Number(idMatch[1]);

        if (method === 'GET') {
            const todo = db.getTodoById(id);
            if (!todo) return sendJson(res, 404, { ok: false, error: 'Không tìm thấy công việc.' });
            return sendJson(res, 200, { ok: true, data: todo });
        }

        if (method === 'PUT') {
            const body = await readJsonBody(req);
            const { errors, cleaned } = validateTodoInput(body, { isPartial: true });
            if (errors.length > 0) {
                return sendJson(res, 400, { ok: false, error: errors[0], errors });
            }
            const updated = db.updateTodo(id, cleaned);
            if (!updated) return sendJson(res, 404, { ok: false, error: 'Không tìm thấy công việc.' });
            return sendJson(res, 200, { ok: true, data: updated });
        }

        if (method === 'DELETE') {
            const deleted = db.deleteTodo(id);
            if (!deleted) return sendJson(res, 404, { ok: false, error: 'Không tìm thấy công việc.' });
            return sendJson(res, 200, { ok: true, data: deleted });
        }
    }

    return sendJson(res, 404, { ok: false, error: 'API endpoint không tồn tại.' });
}

const server = http.createServer(async (req, res) => {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        if (parsedUrl.pathname.startsWith('/api/')) {
            await handleApi(req, res, parsedUrl);
        } else {
            serveStaticFile(res, parsedUrl.pathname);
        }
    } catch (err) {
        if (err.message === 'INVALID_JSON') {
            return sendJson(res, 400, { ok: false, error: 'Dữ liệu JSON không hợp lệ.' });
        }
        if (err.message === 'PAYLOAD_TOO_LARGE') {
            return sendJson(res, 413, { ok: false, error: 'Dữ liệu gửi lên quá lớn.' });
        }
        console.error('Server error:', err);
        sendJson(res, 500, { ok: false, error: 'Lỗi máy chủ nội bộ.' });
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`🍓 Dâu Cute TODO Server đang chạy tại: http://localhost:${PORT}`);
    });
}

module.exports = server;
