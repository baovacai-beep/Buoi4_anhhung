const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'strawberry_todo.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(DB_PATH);

function nowLocalISO() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function todayDateStr(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function initDatabase() {
    const schemaSQL = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSQL);

    const row = db.prepare('SELECT COUNT(*) AS total FROM todos').get();
    if (row.total === 0) {
        const seedTodos = [
            {
                title: 'Hoàn thành bài tập BackEnd Node.js',
                description: 'Xây dựng ứng dụng TODO với API CRUD, cập nhật trạng thái, thống kê và database SQLite.',
                category: 'Học tập',
                priority: 'high',
                status: 'in_progress',
                sticker: '🍓',
                due_date: todayDateStr(0)
            },
            {
                title: 'Chụp ảnh màn hình và nộp file Word lên LMS',
                description: 'Tổng hợp ảnh giao diện, database, code API vào file HoGiaBao.docx và nén thư mục nộp trước 12:00.',
                category: 'Học tập',
                priority: 'high',
                status: 'todo',
                sticker: '📝',
                due_date: todayDateStr(0)
            },
            {
                title: 'Tự thưởng một ly trà sữa dâu kem cheese',
                description: 'Sau khi nộp bài đúng hạn thì chill nhẹ một ly hồng dâu ngọt ngào.',
                category: 'Cá nhân',
                priority: 'medium',
                status: 'todo',
                sticker: '🧋',
                due_date: todayDateStr(0)
            },
            {
                title: 'Thiết kế giao diện Hồng Dâu Pastel',
                description: 'Chọn bảng màu hồng dâu, hiệu ứng hoa rơi, confetti và nhạc nền Lo-fi chill.',
                category: 'Công việc',
                priority: 'medium',
                status: 'done',
                sticker: '🌸',
                due_date: todayDateStr(-1)
            },
            {
                title: 'Ôn tập kiến thức REST API & SQLite',
                description: 'Xem lại các phương thức GET, POST, PUT, PATCH, DELETE và câu lệnh SQL SELECT/GROUP BY.',
                category: 'Học tập',
                priority: 'medium',
                status: 'done',
                sticker: '✨',
                due_date: todayDateStr(1)
            },
            {
                title: 'Đi dạo buổi chiều & uống đủ 2 lít nước',
                description: 'Giữ tinh thần thoải mái, nghe nhạc chill và nghỉ ngơi mắt sau giờ học.',
                category: 'Sức khỏe',
                priority: 'low',
                status: 'todo',
                sticker: '🎀',
                due_date: todayDateStr(2)
            }
        ];

        const insertStmt = db.prepare(`
            INSERT INTO todos (title, description, category, priority, status, sticker, due_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const now = nowLocalISO();
        for (const item of seedTodos) {
            insertStmt.run(
                item.title,
                item.description,
                item.category,
                item.priority,
                item.status,
                item.sticker,
                item.due_date,
                now,
                now
            );
        }

        logActivity(null, 'seed', 'Khởi tạo dữ liệu mẫu Dâu Cute TODO thành công 🍓');
    }
}

function logActivity(todoId, action, message) {
    db.prepare(`
        INSERT INTO activity_logs (todo_id, action, message, created_at)
        VALUES (?, ?, ?, ?)
    `).run(todoId, action, message, nowLocalISO());
}

function listTodos({ status, category, priority, search, sort } = {}) {
    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
        conditions.push('status = ?');
        params.push(status);
    }
    if (category && category !== 'all') {
        conditions.push('category = ?');
        params.push(category);
    }
    if (priority && priority !== 'all') {
        conditions.push('priority = ?');
        params.push(priority);
    }
    if (search && search.trim() !== '') {
        conditions.push('(title LIKE ? OR description LIKE ? OR category LIKE ?)');
        const q = `%${search.trim()}%`;
        params.push(q, q, q);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = `
        ORDER BY
            CASE status WHEN 'in_progress' THEN 0 WHEN 'todo' THEN 1 WHEN 'done' THEN 2 END,
            CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END,
            id DESC
    `;

    if (sort === 'newest') {
        orderClause = 'ORDER BY id DESC';
    } else if (sort === 'due_asc') {
        orderClause = "ORDER BY CASE WHEN due_date = '' THEN 1 ELSE 0 END, due_date ASC, id DESC";
    } else if (sort === 'priority') {
        orderClause = `
            ORDER BY
                CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END,
                id DESC
        `;
    }

    const sql = `SELECT * FROM todos ${whereClause} ${orderClause}`;
    return db.prepare(sql).all(...params);
}

function getTodoById(id) {
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
}

function createTodo({ title, description = '', category = 'Học tập', priority = 'medium', status = 'todo', sticker = '🍓', due_date = '' }) {
    const now = nowLocalISO();
    const result = db.prepare(`
        INSERT INTO todos (title, description, category, priority, status, sticker, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, category, priority, status, sticker, due_date, now, now);

    const created = getTodoById(Number(result.lastInsertRowid));
    logActivity(created.id, 'create', `Đã thêm việc mới: "${created.title}" ${created.sticker}`);
    return created;
}

function updateTodo(id, fields) {
    const existing = getTodoById(id);
    if (!existing) return null;

    const updated = {
        title: fields.title !== undefined ? fields.title : existing.title,
        description: fields.description !== undefined ? fields.description : existing.description,
        category: fields.category !== undefined ? fields.category : existing.category,
        priority: fields.priority !== undefined ? fields.priority : existing.priority,
        status: fields.status !== undefined ? fields.status : existing.status,
        sticker: fields.sticker !== undefined ? fields.sticker : existing.sticker,
        due_date: fields.due_date !== undefined ? fields.due_date : existing.due_date,
        updated_at: nowLocalISO()
    };

    db.prepare(`
        UPDATE todos
        SET title = ?, description = ?, category = ?, priority = ?, status = ?, sticker = ?, due_date = ?, updated_at = ?
        WHERE id = ?
    `).run(
        updated.title,
        updated.description,
        updated.category,
        updated.priority,
        updated.status,
        updated.sticker,
        updated.due_date,
        updated.updated_at,
        id
    );

    logActivity(id, 'update', `Đã cập nhật: "${updated.title}"`);
    return getTodoById(id);
}

function updateTodoStatus(id, status) {
    const existing = getTodoById(id);
    if (!existing) return null;

    const now = nowLocalISO();
    db.prepare('UPDATE todos SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);

    const labels = {
        todo: 'Chưa làm',
        in_progress: 'Đang làm',
        done: 'Hoàn thành'
    };
    logActivity(id, 'status', `Đổi trạng thái "${existing.title}" → ${labels[status] || status}`);
    return getTodoById(id);
}

function deleteTodo(id) {
    const existing = getTodoById(id);
    if (!existing) return null;

    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    logActivity(id, 'delete', `Đã xóa việc: "${existing.title}"`);
    return existing;
}

function deleteCompletedTodos() {
    const completed = db.prepare("SELECT COUNT(*) AS count FROM todos WHERE status = 'done'").get();
    db.prepare("DELETE FROM todos WHERE status = 'done'").run();
    if (completed.count > 0) {
        logActivity(null, 'clear_done', `Đã dọn sạch ${completed.count} việc đã hoàn thành ✨`);
    }
    return completed.count;
}

function getStats() {
    const today = todayDateStr(0);

    const summary = db.prepare(`
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END), 0) AS todo,
            COALESCE(SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END), 0) AS in_progress,
            COALESCE(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END), 0) AS done,
            COALESCE(SUM(CASE WHEN status != 'done' AND due_date != '' AND due_date < ? THEN 1 ELSE 0 END), 0) AS overdue,
            COALESCE(SUM(CASE WHEN status != 'done' AND due_date = ? THEN 1 ELSE 0 END), 0) AS due_today
        FROM todos
    `).get(today, today);

    const byCategory = db.prepare(`
        SELECT
            category,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END), 0) AS done
        FROM todos
        GROUP BY category
        ORDER BY total DESC, category ASC
    `).all();

    const byPriority = db.prepare(`
        SELECT
            priority,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END), 0) AS done
        FROM todos
        GROUP BY priority
    `).all();

    const recentLogs = db.prepare(`
        SELECT id, todo_id, action, message, created_at
        FROM activity_logs
        ORDER BY id DESC
        LIMIT 8
    `).all();

    const completionRate = summary.total > 0
        ? Math.round((summary.done / summary.total) * 100)
        : 0;

    return {
        summary: {
            ...summary,
            completionRate
        },
        byCategory,
        byPriority,
        recentLogs
    };
}

initDatabase();

module.exports = {
    DB_PATH,
    listTodos,
    getTodoById,
    createTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    deleteCompletedTodos,
    getStats
};
