(() => {
    const audio = window.strawberryAudio;

    const STICKERS = ['🍓', '🍰', '🧋', '🌸', '🎀', '✨', '📝', '🌷'];
    const QUOTES_HAPPY = [
        'Yay! Bạn làm đỉnh quá đi mất, thưởng ngay một trái dâu ngọt nhé~ 🍓✨',
        'Bé Dâu tự hào về bạn lắm luôn! Chill nhẹ một chút rồi làm tiếp nha 🌸',
        'Wow, năng suất cực kỳ! Hôm nay thật rực rỡ màu hồng dâu 💖',
        'Chạm nhẹ vào bé Dâu để nhận thêm 100% năng lượng dễ thương nào~ 🎀'
    ];

    const state = {
        todos: [],
        stats: null,
        filters: {
            status: 'all',
            category: 'all',
            priority: 'all',
            search: '',
            sort: 'default'
        },
        quickStickerIdx: 0,
        fxEnabled: true,
        confirmCallback: null
    };

    // DOM Elements
    const el = {
        todoList: document.getElementById('todo-list'),
        listSubtitle: document.getElementById('list-subtitle'),
        statTotal: document.getElementById('stat-total'),
        statTodo: document.getElementById('stat-todo'),
        statInProgress: document.getElementById('stat-in-progress'),
        statDone: document.getElementById('stat-done'),
        statOverdueBadge: document.getElementById('stat-overdue-badge'),
        progressPercent: document.getElementById('progress-percent'),
        progressFill: document.getElementById('progress-fill'),
        dueTodayText: document.getElementById('due-today-text'),
        overdueText: document.getElementById('overdue-text'),
        donutWrap: document.getElementById('donut-chart-wrap'),
        donutLegend: document.getElementById('donut-legend'),
        categoryBars: document.getElementById('category-bars'),
        priorityChips: document.getElementById('priority-chips'),
        activityLogs: document.getElementById('activity-logs'),
        mascotQuote: document.getElementById('mascot-quote'),
        mascotSvg: document.getElementById('mascot-svg'),
        mascotPetBtn: document.getElementById('mascot-pet-btn'),
        brandLogo: document.querySelector('.brand-logo'),

        // Quick Add & Filters
        quickAddForm: document.getElementById('quick-add-form'),
        quickTitle: document.getElementById('quick-title'),
        quickStickerBtn: document.getElementById('quick-sticker-btn'),
        statusTabs: document.getElementById('status-tabs'),
        filterSearch: document.getElementById('filter-search'),
        filterCategory: document.getElementById('filter-category'),
        filterPriority: document.getElementById('filter-priority'),
        filterSort: document.getElementById('filter-sort'),
        btnClearDone: document.getElementById('btn-clear-done'),

        // Header Buttons
        btnOpenAdd: document.getElementById('btn-open-add'),
        btnMusicToggle: document.getElementById('btn-music-toggle'),
        musicWidget: document.getElementById('music-widget'),
        musicLabel: document.getElementById('music-label'),
        musicVolume: document.getElementById('music-volume'),
        btnSfxToggle: document.getElementById('btn-sfx-toggle'),
        btnFxToggle: document.getElementById('btn-fx-toggle'),

        // Todo Modal
        todoModal: document.getElementById('todo-modal'),
        modalTitle: document.getElementById('modal-title'),
        todoForm: document.getElementById('todo-form'),
        formId: document.getElementById('form-id'),
        formTitle: document.getElementById('form-title'),
        formDescription: document.getElementById('form-description'),
        formCategory: document.getElementById('form-category'),
        formPriority: document.getElementById('form-priority'),
        formStatus: document.getElementById('form-status'),
        formDueDate: document.getElementById('form-due-date'),
        stickerPicker: document.getElementById('sticker-picker'),
        btnCloseModal: document.getElementById('btn-close-modal'),
        btnCancelModal: document.getElementById('btn-cancel-modal'),

        // Confirm Modal
        confirmModal: document.getElementById('confirm-modal'),
        confirmTitle: document.getElementById('confirm-title'),
        confirmMessage: document.getElementById('confirm-message'),
        btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
        btnConfirmOk: document.getElementById('btn-confirm-ok'),

        toastContainer: document.getElementById('toast-container'),
        sparkleLayer: document.getElementById('sparkle-layer'),
        fxCanvas: document.getElementById('fx-canvas')
    };

    // ---------------- UTILITIES ----------------
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function todayISO() {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function formatDateVN(isoDate) {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-');
        if (!y || !m || !d) return isoDate;
        return `${d}/${m}/${y}`;
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'error' : ''}`;
        toast.innerHTML = `<span>${type === 'error' ? '💔' : '🍓'}</span><span>${escapeHtml(message)}</span>`;
        el.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            toast.style.transition = 'all 0.25s ease';
            setTimeout(() => toast.remove(), 260);
        }, 2800);
    }

    // ---------------- VISUAL EFFECTS (SPARKLES + PETALS + CONFETTI) ----------------
    function spawnSparkles(x, y, count = 8) {
        if (!state.fxEnabled) return;
        const icons = ['✨', '🍓', '💖', '🌸', '🫧'];
        for (let i = 0; i < count; i++) {
            const node = document.createElement('span');
            node.className = 'sparkle-particle';
            node.textContent = icons[Math.floor(Math.random() * icons.length)];
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const dist = 32 + Math.random() * 44;
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            node.style.setProperty('--ty', `${Math.sin(angle) * dist - 14}px`);
            node.style.setProperty('--rot', `${Math.round((Math.random() - 0.5) * 90)}deg`);
            el.sparkleLayer.appendChild(node);
            setTimeout(() => node.remove(), 900);
        }
    }

    const fxCtx = el.fxCanvas.getContext('2d');
    const petals = [];
    const confetti = [];

    function resizeCanvas() {
        el.fxCanvas.width = window.innerWidth;
        el.fxCanvas.height = window.innerHeight;
    }

    function initPetals() {
        petals.length = 0;
        const total = Math.min(26, Math.max(14, Math.floor(window.innerWidth / 55)));
        for (let i = 0; i < total; i++) {
            petals.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: 5 + Math.random() * 6,
                vy: 0.45 + Math.random() * 0.7,
                vx: (Math.random() - 0.5) * 0.45,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.025,
                kind: Math.random() > 0.28 ? 'petal' : 'berry',
                alpha: 0.35 + Math.random() * 0.38
            });
        }
    }

    function burstConfetti(x, y) {
        if (!state.fxEnabled) return;
        const colors = ['#ff5c8a', '#ff85a8', '#ffd166', '#52c788', '#ff9ebb', '#ffffff'];
        for (let i = 0; i < 36; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.5 + Math.random() * 6.5;
            confetti.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3.2,
                size: 5 + Math.random() * 6,
                color: colors[i % colors.length],
                rot: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.2,
                life: 1
            });
        }
    }

    function renderFxLoop() {
        fxCtx.clearRect(0, 0, el.fxCanvas.width, el.fxCanvas.height);

        if (state.fxEnabled) {
            for (const p of petals) {
                p.y += p.vy;
                p.x += p.vx + Math.sin(p.angle) * 0.35;
                p.angle += p.spin;
                if (p.y > el.fxCanvas.height + 20) {
                    p.y = -15;
                    p.x = Math.random() * el.fxCanvas.width;
                }
                if (p.x > el.fxCanvas.width + 20) p.x = -15;
                if (p.x < -20) p.x = el.fxCanvas.width + 15;

                fxCtx.save();
                fxCtx.translate(p.x, p.y);
                fxCtx.rotate(p.angle);
                fxCtx.globalAlpha = p.alpha;
                if (p.kind === 'petal') {
                    fxCtx.fillStyle = '#ff9ebb';
                    fxCtx.beginPath();
                    fxCtx.ellipse(0, 0, p.r, p.r * 0.58, 0, 0, Math.PI * 2);
                    fxCtx.fill();
                } else {
                    fxCtx.fillStyle = '#ff5c8a';
                    fxCtx.beginPath();
                    fxCtx.arc(0, 0, p.r * 0.55, 0, Math.PI * 2);
                    fxCtx.fill();
                    fxCtx.fillStyle = '#5ccb7f';
                    fxCtx.fillRect(-2, -p.r * 0.8, 4, 3);
                }
                fxCtx.restore();
            }
        }

        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.16;
            c.rot += c.vRot;
            c.life -= 0.016;
            if (c.life <= 0) {
                confetti.splice(i, 1);
                continue;
            }
            fxCtx.save();
            fxCtx.translate(c.x, c.y);
            fxCtx.rotate(c.rot);
            fxCtx.globalAlpha = c.life;
            fxCtx.fillStyle = c.color;
            fxCtx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.65);
            fxCtx.restore();
        }

        requestAnimationFrame(renderFxLoop);
    }

    // ---------------- API LAYER ----------------
    async function apiFetch(url, options = {}) {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
            throw new Error(data.error || 'Có lỗi xảy ra khi kết nối máy chủ.');
        }
        return data;
    }

    async function loadAll() {
        const params = new URLSearchParams();
        if (state.filters.status !== 'all') params.set('status', state.filters.status);
        if (state.filters.category !== 'all') params.set('category', state.filters.category);
        if (state.filters.priority !== 'all') params.set('priority', state.filters.priority);
        if (state.filters.search.trim()) params.set('search', state.filters.search.trim());
        if (state.filters.sort !== 'default') params.set('sort', state.filters.sort);

        try {
            const [todosRes, statsRes] = await Promise.all([
                apiFetch(`/api/todos?${params.toString()}`),
                apiFetch('/api/stats')
            ]);
            state.todos = todosRes.data;
            state.stats = statsRes.data;
            renderTodoList();
            renderStats();
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    // ---------------- RENDERING ----------------
    function getPriorityMeta(priority) {
        if (priority === 'high') return { label: '🔥 Ưu tiên cao', cls: 'pill-priority-high' };
        if (priority === 'low') return { label: '🌿 Thấp', cls: 'pill-priority-low' };
        return { label: '🍓 Trung bình', cls: 'pill-priority-medium' };
    }

    function renderTodoList() {
        const items = state.todos;
        el.listSubtitle.textContent = `Hiển thị ${items.length} công việc (lưu trực tiếp trong SQLite)`;

        if (items.length === 0) {
            el.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-emoji">🍓🌸</div>
                    <h3>Chưa có công việc nào ở đây hết!</h3>
                    <p>Hãy thêm một việc mới hoặc đổi bộ lọc để bé Dâu tìm giúp bạn nhé~</p>
                </div>
            `;
            return;
        }

        const today = todayISO();
        el.todoList.innerHTML = items.map((item) => {
            const prio = getPriorityMeta(item.priority);
            const isDone = item.status === 'done';

            let dueBadge = '';
            if (item.due_date) {
                let dueCls = 'pill-due';
                let duePrefix = '📅';
                if (!isDone && item.due_date < today) {
                    dueCls += ' overdue';
                    duePrefix = '⏰ Quá hạn:';
                } else if (!isDone && item.due_date === today) {
                    dueCls += ' today';
                    duePrefix = '🌟 Hôm nay:';
                }
                dueBadge = `<span class="meta-pill ${dueCls}">${duePrefix} ${escapeHtml(formatDateVN(item.due_date))}</span>`;
            }

            return `
                <article class="todo-card ${isDone ? 'is-done' : ''}" data-id="${item.id}">
                    <button
                        type="button"
                        class="cute-check ${isDone ? 'checked' : ''}"
                        data-action="toggle-check"
                        data-id="${item.id}"
                        title="${isDone ? 'Đánh dấu chưa làm' : 'Đánh dấu hoàn thành'}"
                    >${isDone ? '✓' : ''}</button>

                    <div class="todo-body">
                        <div class="todo-top">
                            <span class="todo-sticker">${escapeHtml(item.sticker || '🍓')}</span>
                            <h3 class="todo-title">${escapeHtml(item.title)}</h3>
                        </div>
                        ${item.description ? `<p class="todo-desc">${escapeHtml(item.description)}</p>` : ''}
                        <div class="todo-meta">
                            <span class="meta-pill pill-category">📂 ${escapeHtml(item.category)}</span>
                            <span class="meta-pill ${prio.cls}">${prio.label}</span>
                            ${dueBadge}
                        </div>
                    </div>

                    <div class="todo-actions-col">
                        <div class="status-switcher" role="group" aria-label="Đổi trạng thái">
                            <button type="button" class="status-btn ${item.status === 'todo' ? 'active' : ''}" data-action="set-status" data-id="${item.id}" data-status="todo">Chưa làm</button>
                            <button type="button" class="status-btn ${item.status === 'in_progress' ? 'active' : ''}" data-action="set-status" data-id="${item.id}" data-status="in_progress">Đang làm</button>
                            <button type="button" class="status-btn ${item.status === 'done' ? 'active' : ''}" data-action="set-status" data-id="${item.id}" data-status="done">Xong</button>
                        </div>
                        <div class="card-btns">
                            <button type="button" class="mini-action-btn" data-action="edit" data-id="${item.id}">✏️ Sửa</button>
                            <button type="button" class="mini-action-btn del" data-action="delete" data-id="${item.id}">🗑️ Xóa</button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderStats() {
        if (!state.stats) return;
        const { summary, byCategory, byPriority, recentLogs } = state.stats;

        el.statTotal.textContent = summary.total;
        el.statTodo.textContent = summary.todo;
        el.statInProgress.textContent = summary.in_progress;
        el.statDone.textContent = summary.done;
        el.statOverdueBadge.textContent = summary.overdue > 0 ? `⚠️ ${summary.overdue} quá hạn` : '✨ Không trễ hạn';

        el.progressPercent.textContent = `${summary.completionRate}%`;
        el.progressFill.style.width = `${summary.completionRate}%`;
        el.dueTodayText.textContent = `📅 ${summary.due_today} việc đến hạn hôm nay`;
        el.overdueText.textContent = `⏰ ${summary.overdue} quá hạn`;

        updateMascotByProgress(summary);
        renderDonutChart(summary);
        renderCategoryBars(byCategory);
        renderPriorityChips(byPriority);
        renderActivityLogs(recentLogs);
    }

    function updateMascotByProgress(summary) {
        if (summary.total === 0) {
            el.mascotQuote.textContent = 'Danh sách đang trống nè! Thêm vài việc dễ thương để tụi mình cùng làm nhé 🍓';
        } else if (summary.completionRate === 100) {
            el.mascotQuote.textContent = 'Xuất sắc 100% luôn! Tự thưởng cho bản thân một ly trà sữa dâu ngay thôi 🧋🎉';
        } else if (summary.completionRate >= 60) {
            el.mascotQuote.textContent = `Đã xong ${summary.completionRate}% rồi nè! Chỉ còn chút xíu nữa thôi, cố lên nhé~ 🌸`;
        } else if (summary.in_progress > 0) {
            el.mascotQuote.textContent = `Đang tập trung làm ${summary.in_progress} việc! Bật chút nhạc Lo-fi chill cho đỡ căng thẳng nha 🎵`;
        } else {
            el.mascotQuote.textContent = 'Hít thở sâu một hơi, chọn 1 việc nhỏ nhất để bắt đầu cùng bé Dâu nhé 🍓✨';
        }
    }

    function renderDonutChart(summary) {
        const total = summary.total || 0;
        const segments = [
            { label: 'Chưa làm', value: summary.todo, color: '#ff85a8' },
            { label: 'Đang làm', value: summary.in_progress, color: '#ffb703' },
            { label: 'Hoàn thành', value: summary.done, color: '#3fb984' }
        ];

        const radius = 46;
        const circumference = 2 * Math.PI * radius;
        let offset = 0;

        const circlesHtml = total === 0
            ? `<circle cx="60" cy="60" r="${radius}" fill="none" stroke="#ffe3ec" stroke-width="15"></circle>`
            : segments.map((seg) => {
                if (seg.value === 0) return '';
                const len = (seg.value / total) * circumference;
                const svgCircle = `
                    <circle
                        cx="60"
                        cy="60"
                        r="${radius}"
                        fill="none"
                        stroke="${seg.color}"
                        stroke-width="15"
                        stroke-dasharray="${len} ${circumference - len}"
                        stroke-dashoffset="${-offset}"
                        stroke-linecap="round"
                        transform="rotate(-90 60 60)"
                    ></circle>
                `;
                offset += len;
                return svgCircle;
            }).join('');

        el.donutWrap.innerHTML = `
            <svg viewBox="0 0 120 120" width="126" height="126">
                <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#fff0f5" stroke-width="15"></circle>
                ${circlesHtml}
            </svg>
            <div class="donut-center">
                <strong>${summary.completionRate}%</strong>
                <span>Hoàn thành</span>
            </div>
        `;

        el.donutLegend.innerHTML = segments.map((seg) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            return `
                <div class="legend-item">
                    <span class="legend-left">
                        <span class="legend-dot" style="background: ${seg.color}"></span>
                        <span>${seg.label}</span>
                    </span>
                    <span>${seg.value} (${pct}%)</span>
                </div>
            `;
        }).join('');
    }

    function renderCategoryBars(byCategory) {
        if (!byCategory || byCategory.length === 0) {
            el.categoryBars.innerHTML = '<p style="font-size:0.82rem;color:#8b6676">Chưa có dữ liệu danh mục.</p>';
            return;
        }
        el.categoryBars.innerHTML = byCategory.map((row) => {
            const pct = row.total > 0 ? Math.round((row.done / row.total) * 100) : 0;
            return `
                <div class="cat-bar-item">
                    <div class="cat-bar-head">
                        <span>${escapeHtml(row.category)}</span>
                        <span>${row.done}/${row.total} xong (${pct}%)</span>
                    </div>
                    <div class="cat-bar-track">
                        <div class="cat-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderPriorityChips(byPriority) {
        const map = { high: 0, medium: 0, low: 0 };
        for (const r of (byPriority || [])) {
            map[r.priority] = r.total;
        }
        el.priorityChips.innerHTML = `
            <div class="prio-chip">
                <span>🔥 Cao</span>
                <strong>${map.high}</strong>
            </div>
            <div class="prio-chip">
                <span>🍓 Trung bình</span>
                <strong>${map.medium}</strong>
            </div>
            <div class="prio-chip">
                <span>🌿 Thấp</span>
                <strong>${map.low}</strong>
            </div>
        `;
    }

    function renderActivityLogs(logs) {
        if (!logs || logs.length === 0) {
            el.activityLogs.innerHTML = '<li class="log-item"><span class="log-msg">Chưa có hoạt động nào.</span></li>';
            return;
        }
        el.activityLogs.innerHTML = logs.map((log) => `
            <li class="log-item">
                <span class="log-msg">${escapeHtml(log.message)}</span>
                <span class="log-time">🕒 ${escapeHtml(log.created_at)}</span>
            </li>
        `).join('');
    }

    // ---------------- MODALS ----------------
    function selectStickerInModal(sticker) {
        const btns = el.stickerPicker.querySelectorAll('.sticker-opt');
        btns.forEach((b) => b.classList.toggle('active', b.dataset.sticker === sticker));
    }

    function getSelectedModalSticker() {
        const active = el.stickerPicker.querySelector('.sticker-opt.active');
        return active ? active.dataset.sticker : '🍓';
    }

    function openTodoModal(todo = null) {
        audio.playPop();
        if (todo) {
            el.modalTitle.textContent = '✏️ Chỉnh sửa công việc';
            el.formId.value = todo.id;
            el.formTitle.value = todo.title;
            el.formDescription.value = todo.description || '';
            el.formCategory.value = todo.category || 'Học tập';
            el.formPriority.value = todo.priority || 'medium';
            el.formStatus.value = todo.status || 'todo';
            el.formDueDate.value = todo.due_date || '';
            selectStickerInModal(todo.sticker || '🍓');
        } else {
            el.modalTitle.textContent = '🍓 Thêm công việc mới';
            el.formId.value = '';
            el.todoForm.reset();
            el.formCategory.value = 'Học tập';
            el.formPriority.value = 'medium';
            el.formStatus.value = 'todo';
            el.formDueDate.value = todayISO();
            selectStickerInModal('🍓');
        }
        el.todoModal.hidden = false;
        setTimeout(() => el.formTitle.focus(), 50);
    }

    function closeTodoModal() {
        el.todoModal.hidden = true;
    }

    function openConfirmModal(title, message, onConfirm) {
        audio.playPop();
        el.confirmTitle.textContent = title;
        el.confirmMessage.textContent = message;
        state.confirmCallback = onConfirm;
        el.confirmModal.hidden = false;
    }

    function closeConfirmModal() {
        el.confirmModal.hidden = true;
        state.confirmCallback = null;
    }

    // ---------------- ACTIONS ----------------
    async function handleStatusChange(id, newStatus, event) {
        try {
            await apiFetch(`/api/todos/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });

            const rect = event?.target?.getBoundingClientRect?.();
            const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
            const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

            if (newStatus === 'done') {
                audio.playComplete();
                burstConfetti(cx, cy);
                spawnSparkles(cx, cy, 10);
                showToast('Yay! Hoàn thành công việc rồi nè 🎉🍓');
            } else if (newStatus === 'in_progress') {
                audio.playProgress();
                spawnSparkles(cx, cy, 6);
                showToast('Đã chuyển sang Đang làm 🧋');
            } else {
                audio.playPop();
                showToast('Đã chuyển về Chưa làm 🎀');
            }

            await loadAll();
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    // ---------------- EVENT LISTENERS ----------------
    el.quickStickerBtn.addEventListener('click', (e) => {
        audio.playPop();
        state.quickStickerIdx = (state.quickStickerIdx + 1) % STICKERS.length;
        el.quickStickerBtn.textContent = STICKERS[state.quickStickerIdx];
        spawnSparkles(e.clientX, e.clientY, 5);
    });

    el.quickAddForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = el.quickTitle.value.trim();
        if (!title) {
            showToast('Bạn ơi, nhập tên công việc trước nha~ 🍓', 'error');
            el.quickTitle.focus();
            return;
        }
        try {
            await apiFetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    sticker: el.quickStickerBtn.textContent,
                    due_date: todayISO()
                })
            });
            el.quickTitle.value = '';
            audio.playAdd();
            const rect = el.quickAddForm.getBoundingClientRect();
            spawnSparkles(rect.right - 60, rect.top + 20, 9);
            showToast('Đã thêm việc mới vào SQLite 🍓');
            await loadAll();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    el.statusTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-pill');
        if (!btn) return;
        audio.playPop();
        el.statusTabs.querySelectorAll('.tab-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.status = btn.dataset.status;
        loadAll();
    });

    let searchTimer = null;
    el.filterSearch.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            state.filters.search = el.filterSearch.value;
            loadAll();
        }, 200);
    });

    el.filterCategory.addEventListener('change', () => {
        audio.playPop();
        state.filters.category = el.filterCategory.value;
        loadAll();
    });

    el.filterPriority.addEventListener('change', () => {
        audio.playPop();
        state.filters.priority = el.filterPriority.value;
        loadAll();
    });

    el.filterSort.addEventListener('change', () => {
        audio.playPop();
        state.filters.sort = el.filterSort.value;
        loadAll();
    });

    el.todoList.addEventListener('click', (e) => {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) return;

        const id = Number(actionEl.dataset.id);
        const action = actionEl.dataset.action;
        const todo = state.todos.find((t) => t.id === id);

        if (action === 'toggle-check' && todo) {
            const nextStatus = todo.status === 'done' ? 'todo' : 'done';
            handleStatusChange(id, nextStatus, e);
        } else if (action === 'set-status') {
            handleStatusChange(id, actionEl.dataset.status, e);
        } else if (action === 'edit' && todo) {
            openTodoModal(todo);
        } else if (action === 'delete' && todo) {
            openConfirmModal(
                'Xóa công việc này nhé?',
                `"${todo.title}" sẽ bị xóa khỏi cơ sở dữ liệu SQLite.`,
                async () => {
                    try {
                        await apiFetch(`/api/todos/${id}`, { method: 'DELETE' });
                        audio.playDelete();
                        showToast('Đã xóa công việc nhẹ nhàng 🫧');
                        await loadAll();
                    } catch (err) {
                        showToast(err.message, 'error');
                    }
                }
            );
        }
    });

    el.btnClearDone.addEventListener('click', () => {
        const doneCount = state.stats?.summary?.done || 0;
        if (doneCount === 0) {
            audio.playPop();
            showToast('Chưa có công việc nào hoàn thành để dọn nè~ 🌸');
            return;
        }
        openConfirmModal(
            `Dọn sạch ${doneCount} việc đã xong?`,
            'Các công việc ở trạng thái Hoàn thành sẽ được xóa khỏi database.',
            async () => {
                try {
                    const res = await apiFetch('/api/todos/completed', { method: 'DELETE' });
                    audio.playDelete();
                    showToast(`Đã dọn sạch ${res.deletedCount} công việc đã xong ✨`);
                    await loadAll();
                } catch (err) {
                    showToast(err.message, 'error');
                }
            }
        );
    });

    // Modal handlers
    el.btnOpenAdd.addEventListener('click', (e) => {
        spawnSparkles(e.clientX, e.clientY, 6);
        openTodoModal(null);
    });

    el.btnCloseModal.addEventListener('click', closeTodoModal);
    el.btnCancelModal.addEventListener('click', closeTodoModal);

    el.todoModal.addEventListener('click', (e) => {
        if (e.target === el.todoModal) closeTodoModal();
    });

    el.stickerPicker.addEventListener('click', (e) => {
        const opt = e.target.closest('.sticker-opt');
        if (!opt) return;
        audio.playPop();
        selectStickerInModal(opt.dataset.sticker);
    });

    el.todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = el.formId.value;
        const payload = {
            title: el.formTitle.value.trim(),
            description: el.formDescription.value.trim(),
            category: el.formCategory.value,
            priority: el.formPriority.value,
            status: el.formStatus.value,
            due_date: el.formDueDate.value,
            sticker: getSelectedModalSticker()
        };

        try {
            if (id) {
                await apiFetch(`/api/todos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                audio.playAdd();
                showToast('Đã cập nhật công việc thành công ✨');
            } else {
                await apiFetch('/api/todos', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                audio.playAdd();
                showToast('Đã thêm công việc mới siêu cute 🍓');
            }
            closeTodoModal();
            await loadAll();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    el.btnConfirmCancel.addEventListener('click', closeConfirmModal);
    el.confirmModal.addEventListener('click', (e) => {
        if (e.target === el.confirmModal) closeConfirmModal();
    });
    el.btnConfirmOk.addEventListener('click', async () => {
        const cb = state.confirmCallback;
        closeConfirmModal();
        if (cb) await cb();
    });

    // Audio & FX toggles
    el.btnMusicToggle.addEventListener('click', (e) => {
        const playing = audio.toggleBgm();
        el.musicWidget.classList.toggle('playing', playing);
        el.mascotSvg.classList.toggle('dancing', playing);
        el.musicLabel.textContent = playing ? 'Nhạc Chill: Đang phát' : 'Nhạc Chill: Tắt';
        spawnSparkles(e.clientX, e.clientY, 7);
        showToast(playing ? 'Đang phát nhạc Lo-fi Strawberry Chill 🎵🍓' : 'Đã tạm dừng nhạc nền chill 🫧');
    });

    el.musicVolume.addEventListener('input', () => {
        audio.setVolume(Number(el.musicVolume.value));
    });

    el.btnSfxToggle.addEventListener('click', () => {
        const next = !audio.sfxEnabled;
        audio.setSfxEnabled(next);
        el.btnSfxToggle.classList.toggle('muted', !next);
        el.btnSfxToggle.innerHTML = `${next ? '🔔' : '🔕'} <span class="hide-sm">Âm thanh: ${next ? 'Bật' : 'Tắt'}</span>`;
        if (next) audio.playPop();
    });

    el.btnFxToggle.addEventListener('click', () => {
        audio.playPop();
        state.fxEnabled = !state.fxEnabled;
        el.btnFxToggle.classList.toggle('muted', !state.fxEnabled);
        el.btnFxToggle.innerHTML = `${state.fxEnabled ? '🌸' : '🫧'} <span class="hide-sm">Hiệu ứng: ${state.fxEnabled ? 'Bật' : 'Tắt'}</span>`;
    });

    // Mascot pet interaction
    function petMascot(e) {
        audio.playBoop();
        const rect = el.mascotPetBtn.getBoundingClientRect();
        spawnSparkles(e.clientX || rect.left + 45, e.clientY || rect.top + 45, 9);
        el.mascotQuote.textContent = QUOTES_HAPPY[Math.floor(Math.random() * QUOTES_HAPPY.length)];
    }

    el.mascotPetBtn.addEventListener('click', petMascot);
    el.brandLogo.addEventListener('click', petMascot);

    // Keyboard Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!el.todoModal.hidden) closeTodoModal();
            if (!el.confirmModal.hidden) closeConfirmModal();
        }
    });

    // Init
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initPetals();
    renderFxLoop();
    loadAll();
})();
