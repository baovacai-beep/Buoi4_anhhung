// ================= PHẦN 1: BIẾN & CHỈ SỐ ANH HÙNG (BÀI 1 - 4) =================
var ten = "Hồ Gia Bảo";
var mssv = "31241023360";

var level = 1;
var xp = 0;
var skillPoints = 5;

level++;
xp = 150 * (level - 1) + 200;
skillPoints = skillPoints + xp / 10;

var strength = 0.6 * skillPoints + 0.1 * xp;
var agility = 0.2 * skillPoints + 0.2 * xp;
var intel = 0.2 * skillPoints + 10 * level;

level = 3;
xp = xp + 200;

var nhapTen = prompt("Hãy nhập tên bạn", "Hồ Gia Bảo");
if (nhapTen == ten) {
    console.log("Chính xác! Bạn có trí nhớ rất tốt! intel +5!");
    intel = intel + 5;
} else {
    console.log("Tệ thật! Tên chính mình mà không nhớ sao?! intel -5!");
    intel = intel - 5;
}

var chonPhanCap = prompt("Bạn muốn chọn phân cấp nào? a: Chiến Binh | b: Sát Thủ | c: Thợ Săn", "a");
var phancap = "Tập Sự";

switch (chonPhanCap) {
    case "a":
        phancap = "Chiến Binh";
        strength = strength + 15;
        agility = agility - 10;
        intel = intel - 5;
        break;
    case "b":
        phancap = "Sát Thủ";
        strength = strength - 15;
        agility = agility + 10;
        intel = intel + 5;
        break;
    case "c":
        phancap = "Thợ Săn";
        strength = strength - 15;
        intel = intel + 15;
        break;
    default:
        break;
}

level = 4;
xp = xp + 700;
level = 5;

// ================= PHẦN 2: CẤU HÌNH ĐẤU TRƯỜNG & VẬT LÝ BẬT NẢY =================
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var heroImg = new Image();
heroImg.src = "images/wanda.jpg";

// Chỉ số máu & thuộc tính (cân bằng cho thời gian thực từ công thức gốc)
var maxHealth = (level + 100) * 3; // 315 HP
var health = maxHealth;

var maxDragonHealth = 600;
var dragonHealth = maxDragonHealth;
var dragonStr = 100;
var dragonAgi = 15;
var dragonInt = 80;

var gameOver = false;
var amThanhBat = true;
var screenShake = 0;
var wallFlash = 0;
var globalTime = 0;

// Tọa độ chuột để nhắm
var mouse = { x: canvas.width * 0.75, y: canvas.height * 0.5 };

// Đối tượng Anh Hùng (bật nảy như bóng)
var hero = {
    x: 130,
    y: 270,
    vx: 210,
    vy: 185,
    r: 32,
    hurtTimer: 0,
    dodgeTimer: 0,
    slashTimer: 0,
    slashAngle: 0,
    cdRanged: 0,
    cdMelee: 0,
    cdUlt: 0
};

// Đối tượng Rồng Già (bật nảy & hoạt ảnh nhiều khớp)
var dragon = {
    x: 470,
    y: 270,
    vx: -175,
    vy: -195,
    r: 46,
    hurtTimer: 0,
    dodgeTimer: 0,
    mouthOpen: 0,
    rageTimer: 0,
    attackCooldown: 1.6,
    skillCycle: 0
};

var projectiles = [];
var particles = [];
var floatingTexts = [];

// ================= PHẦN 3: ÂM THANH TỔNG HỢP (WEB AUDIO API) =================
var audioCtx = null;

function phatAmThanh(loai) {
    if (!amThanhBat) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    var now = audioCtx.currentTime;

    if (loai === "bounce") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (loai === "shoot") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
    } else if (loai === "slash") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
    } else if (loai === "ult") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.35);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (loai === "dragonFire") {
        osc.type = "square";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
    } else if (loai === "crit") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.38);
        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
    } else if (loai === "dodge") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (loai === "win") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.14);
        osc.frequency.setValueAtTime(783.99, now + 0.28);
        osc.frequency.setValueAtTime(1046.5, now + 0.42);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
        osc.start(now);
        osc.stop(now + 0.75);
    } else if (loai === "lose") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(95, now + 0.6);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

function batTatAmThanh() {
    amThanhBat = !amThanhBat;
    document.getElementById("btnSound").innerText = amThanhBat ? "🔊 Âm: BẬT" : "🔇 Âm: TẮT";
}

// ================= PHẦN 4: ĐIỀU KHIỂN & KỸ NĂNG NGƯỜI CHƠI =================
canvas.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener("mousedown", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (e.button === 0) {
        suDungChieuBan();
    } else if (e.button === 2) {
        suDungChieuChem();
    }
});

canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

window.addEventListener("keydown", function (e) {
    if (e.key === "1") suDungChieuBan();
    if (e.key === "2" || e.code === "Space") {
        e.preventDefault();
        suDungChieuChem();
    }
    if (e.key === "3" || e.key === "e" || e.key === "E") suDungTuyetChieu();
});

// Chiêu 1: Bắn Cầu Hỗn Mang về hướng chuột
function suDungChieuBan() {
    if (gameOver || hero.cdRanged > 0) return;
    hero.cdRanged = 0.55;
    phatAmThanh("shoot");

    var angle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
    var speed = 520;
    projectiles.push({
        owner: "hero",
        type: "bolt",
        x: hero.x + Math.cos(angle) * (hero.r + 8),
        y: hero.y + Math.sin(angle) * (hero.r + 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 11,
        damage: Math.round(strength * 0.75 + intel * 0.25),
        color: "#ff1744"
    });
    taoHatHieuUng(hero.x, hero.y, "#ff4081", 8);
}

// Chiêu 2: Chém Cận Chiến (Đánh lan quanh người, phản đòn cầu lửa, không thể né)
function suDungChieuChem() {
    if (gameOver || hero.cdMelee > 0) return;
    hero.cdMelee = 1.3;
    hero.slashTimer = 0.28;
    hero.slashAngle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
    phatAmThanh("slash");

    var slashRange = 138;
    taoHatHieuUng(hero.x, hero.y, "#e040fb", 18);

    // Chém trúng cầu lửa của Rồng sẽ phá hủy đạn
    for (var i = projectiles.length - 1; i >= 0; i--) {
        var p = projectiles[i];
        if (p.owner === "dragon" && Math.hypot(p.x - hero.x, p.y - hero.y) <= slashRange + p.r) {
            taoHatHieuUng(p.x, p.y, "#ffd54f", 12);
            themChuBay(p.x, p.y - 10, "PHÁ ĐÒN!", "#ffd54f");
            projectiles.splice(i, 1);
        }
    }

    // Kiểm tra chém trúng Rồng ở cự ly gần
    var distToDragon = Math.hypot(dragon.x - hero.x, dragon.y - hero.y);
    if (distToDragon <= slashRange + dragon.r) {
        var isCrit = (Math.random() * 100) < intel;
        var dmg = Math.round(strength * 1.45);
        if (isCrit) dmg *= 2;

        dragonHealth -= dmg;
        dragon.hurtTimer = 0.25;
        screenShake = isCrit ? 12 : 6;

        // Đẩy lùi Rồng ra xa
        var pushAngle = Math.atan2(dragon.y - hero.y, dragon.x - hero.x);
        dragon.vx = Math.cos(pushAngle) * 280;
        dragon.vy = Math.sin(pushAngle) * 280;

        if (isCrit) {
            phatAmThanh("crit");
            themChuBay(dragon.x, dragon.y - 40, "-" + dmg + " TRẢM LONG CHÍ MẠNG!", "#ff1744");
            ghiLichSu("⚔️ TRẢM LONG CHÍ MẠNG! Chém cận chiến gây <b>" + dmg + "</b> sát thương!", "log-crit");
        } else {
            themChuBay(dragon.x, dragon.y - 40, "-" + dmg + " CHÉM!", "#ea80fc");
            ghiLichSu("⚔️ Chém cận chiến trúng Rồng gây <b>" + dmg + "</b> sát thương!", "log-melee");
        }
        taoHatHieuUng(dragon.x, dragon.y, "#ea80fc", 22);
        kiemTraKetThuc();
    } else {
        themChuBay(hero.x, hero.y - 35, "CHÉM GIÓ!", "#ce93d8");
    }
}

// Chiêu 3: Tuyệt chiêu Bão Năng Lượng (5 tia đạn hình quạt + hồi máu theo Intel)
function suDungTuyetChieu() {
    if (gameOver || hero.cdUlt > 0) return;
    hero.cdUlt = 4.5;
    phatAmThanh("ult");

    var baseAngle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
    for (var i = -2; i <= 2; i++) {
        var a = baseAngle + i * 0.16;
        projectiles.push({
            owner: "hero",
            type: "ult",
            x: hero.x + Math.cos(a) * (hero.r + 10),
            y: hero.y + Math.sin(a) * (hero.r + 10),
            vx: Math.cos(a) * 560,
            vy: Math.sin(a) * 560,
            r: 13,
            damage: Math.round(strength * 0.65 + intel * 0.45),
            color: "#ffab00"
        });
    }

    var healAmount = Math.round(25 + intel * 0.5);
    health = Math.min(maxHealth, health + healAmount);
    themChuBay(hero.x, hero.y - 40, "+" + healAmount + " HP!", "#69f0ae");
    taoHatHieuUng(hero.x, hero.y, "#ffab00", 25);
    ghiLichSu("💥 Kích hoạt Bão Năng Lượng 5 tia và hồi <b>" + healAmount + " HP</b>!", "log-hero");
}

// ================= PHẦN 5: HIỆU ỨNG HẠT & VẬT LÝ BẬT NẢY =================
function taoHatHieuUng(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = 60 + Math.random() * 200;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: 0.35 + Math.random() * 0.25,
            maxLife: 0.6,
            size: 3 + Math.random() * 4,
            color: color
        });
    }
}

function themChuBay(x, y, text, color) {
    floatingTexts.push({
        x: x,
        y: y,
        text: text,
        color: color,
        life: 0.95
    });
}

function ghiLichSu(html, cls) {
    var box = document.getElementById("battleLog");
    var div = document.createElement("div");
    div.className = cls;
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function xuLyVaChamTuong(obj, isDragon) {
    var bounced = false;
    if (obj.x - obj.r < 0) {
        obj.x = obj.r;
        obj.vx = Math.abs(obj.vx);
        bounced = true;
    } else if (obj.x + obj.r > canvas.width) {
        obj.x = canvas.width - obj.r;
        obj.vx = -Math.abs(obj.vx);
        bounced = true;
    }

    if (obj.y - obj.r < 0) {
        obj.y = obj.r;
        obj.vy = Math.abs(obj.vy);
        bounced = true;
    } else if (obj.y + obj.r > canvas.height) {
        obj.y = canvas.height - obj.r;
        obj.vy = -Math.abs(obj.vy);
        bounced = true;
    }

    if (bounced) {
        // Thêm chút góc nảy ngẫu nhiên để quỹ đạo luôn biến hóa
        var jitter = (Math.random() - 0.5) * 35;
        obj.vx += jitter;
        obj.vy -= jitter;
        wallFlash = 0.15;
        phatAmThanh("bounce");
        taoHatHieuUng(obj.x, obj.y, isDragon ? "#ff9100" : "#ff4081", 6);
    }
}

function xuLyVaChamHaiNhanVat() {
    var dx = dragon.x - hero.x;
    var dy = dragon.y - hero.y;
    var dist = Math.hypot(dx, dy);
    var minDist = hero.r + dragon.r;

    if (dist < minDist && dist > 0) {
        var nx = dx / dist;
        var ny = dy / dist;
        var overlap = minDist - dist;

        // Tách hai nhân vật khỏi nhau
        hero.x -= nx * overlap * 0.5;
        hero.y -= ny * overlap * 0.5;
        dragon.x += nx * overlap * 0.5;
        dragon.y += ny * overlap * 0.5;

        // Đổi hướng bật nảy đàn hồi
        var tempVx = hero.vx;
        var tempVy = hero.vy;
        hero.vx = dragon.vx * 1.05;
        hero.vy = dragon.vy * 1.05;
        dragon.vx = tempVx * 0.95;
        dragon.vy = tempVy * 0.95;

        taoHatHieuUng((hero.x + dragon.x) / 2, (hero.y + dragon.y) / 2, "#ffffff", 12);
        phatAmThanh("bounce");

        // Nếu Rồng đang ở trạng thái Lao Húc (rageTimer > 0) mà húc trúng Anh Hùng
        if (dragon.rageTimer > 0 && !gameOver) {
            dragon.rageTimer = 0;
            if ((Math.random() * 100) < agility) {
                hero.dodgeTimer = 0.35;
                phatAmThanh("dodge");
                themChuBay(hero.x, hero.y - 35, "NÉ CÚ HÚC!", "#69f0ae");
                ghiLichSu("⚡ Bạn lộn nhào né được cú lao húc của Rồng!", "log-dodge");
            } else {
                var bodyDmg = Math.round(dragonStr * 0.35);
                health -= bodyDmg;
                hero.hurtTimer = 0.3;
                screenShake = 10;
                phatAmThanh("dragonFire");
                themChuBay(hero.x, hero.y - 35, "-" + bodyDmg + " RỒNG HÚC!", "#ff9100");
                ghiLichSu("🐉 Rồng Già lao húc trực diện gây <b>" + bodyDmg + "</b> sát thương!", "log-dragon");
                kiemTraKetThuc();
            }
        }
    }
}

// ================= PHẦN 6: TRÍ TUỆ NHÂN TẠO CỦA RỒNG =================
function capNhatAIRong(dt) {
    if (gameOver) return;
    if (dragon.mouthOpen > 0) dragon.mouthOpen -= dt;
    if (dragon.rageTimer > 0) dragon.rageTimer -= dt;

    dragon.attackCooldown -= dt;
    if (dragon.attackCooldown <= 0) {
        dragon.skillCycle++;
        dragon.mouthOpen = 0.45;
        var angleToHero = Math.atan2(hero.y - dragon.y, hero.x - dragon.x);

        if (dragon.skillCycle % 3 === 0) {
            // Kỹ năng 3 của Rồng: Lao húc tăng tốc bật nảy
            dragon.rageTimer = 1.6;
            dragon.vx = Math.cos(angleToHero) * 340;
            dragon.vy = Math.sin(angleToHero) * 340;
            dragon.attackCooldown = 2.0;
            phatAmThanh("dragonFire");
            themChuBay(dragon.x, dragon.y - 52, "🔥 RỒNG CUỒNG NỘ!", "#ff6d00");
            ghiLichSu("🐉 Rồng Già gầm thét và lao húc tốc độ cao!", "log-dragon");
        } else if (dragonHealth < maxDragonHealth * 0.65 && dragon.skillCycle % 2 === 0) {
            // Kỹ năng 2 của Rồng: Phun 3 cầu lửa tỏa quạt
            phatAmThanh("dragonFire");
            for (var k = -1; k <= 1; k++) {
                var spread = angleToHero + k * 0.24;
                projectiles.push({
                    owner: "dragon",
                    type: "fireball",
                    x: dragon.x + Math.cos(spread) * (dragon.r + 8),
                    y: dragon.y + Math.sin(spread) * (dragon.r + 8),
                    vx: Math.cos(spread) * 320,
                    vy: Math.sin(spread) * 320,
                    r: 13,
                    damage: Math.round(dragonStr * 0.26),
                    color: "#ff6d00"
                });
            }
            dragon.attackCooldown = 1.85;
        } else {
            // Kỹ năng 1 của Rồng: Phun Hỏa Cầu đơn
            phatAmThanh("dragonFire");
            projectiles.push({
                owner: "dragon",
                type: "fireball",
                x: dragon.x + Math.cos(angleToHero) * (dragon.r + 8),
                y: dragon.y + Math.sin(angleToHero) * (dragon.r + 8),
                vx: Math.cos(angleToHero) * 360,
                vy: Math.sin(angleToHero) * 360,
                r: 15,
                damage: Math.round(dragonStr * 0.3),
                color: "#ff3d00"
            });
            dragon.attackCooldown = 1.5;
        }
    }
}

// ================= PHẦN 7: VẼ ĐỒ HỌA CHÂN THỰC TRÊN CANVAS =================
function veSanDau() {
    ctx.fillStyle = "#140c1c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lưới gạch đá đấu trường
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (var x = 0; x <= canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var y = 0; y <= canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Vòng tròn ma pháp giữa sân
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(globalTime * 0.25);
    ctx.strokeStyle = "rgba(255, 42, 85, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(-85, -85, 170, 170);
    ctx.restore();

    // Hiệu ứng sáng viền tường khi có va chạm bật nảy
    if (wallFlash > 0) {
        ctx.strokeStyle = "rgba(255, 213, 79, " + (wallFlash * 4) + ")";
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
}

function veAnhHung() {
    // Đường nhắm laser từ Anh Hùng tới vị trí chuột
    if (!gameOver) {
        var aimAngle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "rgba(255, 82, 119, 0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hero.x, hero.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();

        // Tâm ngắm tại chuột
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // Hiệu ứng vòng chém cận chiến
    if (hero.slashTimer > 0) {
        ctx.save();
        ctx.translate(hero.x, hero.y);
        ctx.rotate(hero.slashAngle);
        ctx.strokeStyle = "rgba(224, 64, 251, " + (hero.slashTimer / 0.28) + ")";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 115, -0.9, 0.9);
        ctx.stroke();
        ctx.restore();
    }

    ctx.save();
    ctx.translate(hero.x, hero.y);
    if (hero.dodgeTimer > 0) ctx.globalAlpha = 0.45;

    // Hào quang năng lượng đỏ xung quanh Wanda
    var pulse = 4 + Math.sin(globalTime * 10) * 3;
    ctx.shadowColor = hero.hurtTimer > 0 ? "#ffffff" : "#ff1744";
    ctx.shadowBlur = 18 + pulse;

    // Cắt tròn ảnh wanda.jpg
    ctx.beginPath();
    ctx.arc(0, 0, hero.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (heroImg.complete && heroImg.naturalWidth > 0) {
        ctx.drawImage(heroImg, -hero.r, -hero.r, hero.r * 2, hero.r * 2);
    } else {
        ctx.fillStyle = "#c2185b";
        ctx.fillRect(-hero.r, -hero.r, hero.r * 2, hero.r * 2);
    }

    if (hero.hurtTimer > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fillRect(-hero.r, -hero.r, hero.r * 2, hero.r * 2);
    }
    ctx.restore();

    // Viền khung nhân vật
    ctx.save();
    ctx.strokeStyle = "#ff4081";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hero.x, hero.y, hero.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function veConRong() {
    var angleToHero = Math.atan2(hero.y - dragon.y, hero.x - dragon.x);
    var flap = Math.sin(globalTime * 11) * 0.45; // Nhịp đập cánh
    var tailWave = Math.sin(globalTime * 7);

    ctx.save();
    ctx.translate(dragon.x, dragon.y);
    if (dragon.dodgeTimer > 0) ctx.globalAlpha = 0.45;
    ctx.rotate(angleToHero);

    // Hào quang khi Rồng cuồng nộ
    if (dragon.rageTimer > 0) {
        ctx.shadowColor = "#ff6d00";
        ctx.shadowBlur = 28;
    }

    var bodyColor = dragon.hurtTimer > 0 ? "#ffffff" : "#b71c1c";
    var wingColor = dragon.hurtTimer > 0 ? "#ffe0b2" : "#d84315";
    var bellyColor = dragon.hurtTimer > 0 ? "#ffffff" : "#ff8f00";

    // 1. Đuôi rồng uốn lượn nhiều đốt
    for (var t = 1; t <= 5; t++) {
        var tx = -28 - t * 13;
        var ty = Math.sin(globalTime * 8 - t * 0.8) * (t * 4.5);
        var tr = Math.max(4, 18 - t * 2.6);
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(tx, ty, tr, 0, Math.PI * 2);
        ctx.fill();
    }
    // Mũi nhọn chóp đuôi
    ctx.fillStyle = "#ffab00";
    ctx.beginPath();
    ctx.moveTo(-95, tailWave * 22);
    ctx.lineTo(-112, tailWave * 26 - 6);
    ctx.lineTo(-112, tailWave * 26 + 6);
    ctx.closePath();
    ctx.fill();

    // 2. Hai cánh rồng vỗ liên tục
    ctx.fillStyle = wingColor;
    ctx.strokeStyle = "#4e342e";
    ctx.lineWidth = 2;

    // Cánh trái
    ctx.save();
    ctx.rotate(-0.4 + flap);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.quadraticCurveTo(-20, -68, -55, -52);
    ctx.quadraticCurveTo(-35, -30, -45, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Cánh phải
    ctx.save();
    ctx.rotate(0.4 - flap);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(-20, 68, -55, 52);
    ctx.quadraticCurveTo(-35, 30, -45, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. Thân rồng & vảy bụng
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(-4, 0, 34, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(2, 0, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Đầu rồng, sừng và hàm phun lửa
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(28, 0, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sừng rồng vàng
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.moveTo(16, -10);
    ctx.lineTo(-4, -24);
    ctx.lineTo(10, -5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, 10);
    ctx.lineTo(-4, 24);
    ctx.lineTo(10, 5);
    ctx.fill();

    // Lửa trong miệng khi sắp phun chiêu
    if (dragon.mouthOpen > 0) {
        ctx.fillStyle = "#ffea00";
        ctx.beginPath();
        ctx.arc(48, 0, 10 + Math.sin(globalTime * 30) * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Mắt rồng phát sáng
    ctx.fillStyle = "#ffea00";
    ctx.beginPath();
    ctx.arc(32, -7, 3.5, 0, Math.PI * 2);
    ctx.arc(32, 7, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ================= PHẦN 8: VÒNG LẶP GAME CHÍNH (60 FPS) =================
function kiemTraKetThuc() {
    if (gameOver) return;
    if (dragonHealth <= 0) {
        dragonHealth = 0;
        gameOver = true;
        level = 6;
        xp += 600;
        phatAmThanh("win");
        taoHatHieuUng(dragon.x, dragon.y, "#ffab00", 50);
        ghiLichSu("🏆 CHIẾN THẮNG! Bạn đạt danh hiệu 'Dũng sĩ diệt Rồng'! LEVEL UP cấp 6! XP +600", "log-win");
    } else if (health <= 0) {
        health = 0;
        gameOver = true;
        phatAmThanh("lose");
        taoHatHieuUng(hero.x, hero.y, "#ff1744", 45);
        ghiLichSu("💀 THẤT BẠI! Bạn đã trở thành món Hiệp sĩ nướng lá lốt của Rồng!", "log-lose");
    }
}

function capNhatHUD() {
    document.getElementById("heroIdentity").innerText =
        "Anh Hùng: " + ten + " (MSSV: " + mssv + ") | Phân cấp: " + phancap;
    document.getElementById("heroNameLabel").innerText = "🦸 " + ten + " (" + phancap + ")";
    document.getElementById("heroHpLabel").innerText = "HP: " + Math.max(0, health) + " / " + maxHealth;
    document.getElementById("heroHpBar").style.width = (Math.max(0, health) / maxHealth * 100) + "%";
    document.getElementById("heroStatsLabel").innerHTML =
        "<span>STR: " + strength + " | AGI: " + agility + " | INT: " + intel + "</span>" +
        "<span>Cấp: " + level + " | XP: " + xp + "</span>";

    document.getElementById("dragonHpLabel").innerText = "HP: " + Math.max(0, dragonHealth) + " / " + maxDragonHealth;
    document.getElementById("dragonHpBar").style.width = (Math.max(0, dragonHealth) / maxDragonHealth * 100) + "%";
    document.getElementById("dragonStateLabel").innerText =
        dragon.rageTimer > 0 ? "🔥 Trạng thái: CUỒNG NỘ!" : "Trạng thái: Đang bay lượn";

    // Thanh hồi chiêu trực quan trên 3 nút kỹ năng
    document.getElementById("cd1").style.height = Math.min(100, (hero.cdRanged / 0.55) * 100) + "%";
    document.getElementById("cd2").style.height = Math.min(100, (hero.cdMelee / 1.3) * 100) + "%";
    document.getElementById("cd3").style.height = Math.min(100, (hero.cdUlt / 4.5) * 100) + "%";
}

var lastTimestamp = performance.now();

function gameLoop(now) {
    var dt = Math.min(0.05, (now - lastTimestamp) / 1000);
    lastTimestamp = now;
    globalTime += dt;

    // Giảm hồi chiêu và bộ đếm hiệu ứng
    if (hero.cdRanged > 0) hero.cdRanged -= dt;
    if (hero.cdMelee > 0) hero.cdMelee -= dt;
    if (hero.cdUlt > 0) hero.cdUlt -= dt;
    if (hero.hurtTimer > 0) hero.hurtTimer -= dt;
    if (hero.dodgeTimer > 0) hero.dodgeTimer -= dt;
    if (hero.slashTimer > 0) hero.slashTimer -= dt;
    if (dragon.hurtTimer > 0) dragon.hurtTimer -= dt;
    if (dragon.dodgeTimer > 0) dragon.dodgeTimer -= dt;
    if (wallFlash > 0) wallFlash -= dt;
    if (screenShake > 0) screenShake -= dt * 30;

    if (!gameOver) {
        // Di chuyển & bật nảy cả 2 nhân vật
        hero.x += hero.vx * dt;
        hero.y += hero.vy * dt;
        xuLyVaChamTuong(hero, false);

        dragon.x += dragon.vx * dt;
        dragon.y += dragon.vy * dt;
        xuLyVaChamTuong(dragon, true);

        xuLyVaChamHaiNhanVat();
        capNhatAIRong(dt);
    }

    // Cập nhật đạn bay & kiểm tra trúng mục tiêu
    for (var i = projectiles.length - 1; i >= 0; i--) {
        var p = projectiles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Ra khỏi khung vuông thì xóa đạn
        if (p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
            projectiles.splice(i, 1);
            continue;
        }

        if (p.owner === "hero" && !gameOver) {
            if (Math.hypot(p.x - dragon.x, p.y - dragon.y) <= p.r + dragon.r) {
                projectiles.splice(i, 1);
                if ((Math.random() * 100) < dragonAgi) {
                    dragon.dodgeTimer = 0.3;
                    phatAmThanh("dodge");
                    themChuBay(dragon.x, dragon.y - 35, "XÍ HỤT!", "#80deea");
                    ghiLichSu("💨 Rồng lượn mình né được cầu phép!", "log-dodge");
                } else {
                    var crit = (Math.random() * 100) < intel;
                    var finalDmg = crit ? p.damage * 2 : p.damage;
                    dragonHealth -= finalDmg;
                    dragon.hurtTimer = 0.2;
                    screenShake = crit ? 10 : 4;
                    if (crit) {
                        phatAmThanh("crit");
                        themChuBay(dragon.x, dragon.y - 35, "-" + finalDmg + " CHÍ MẠNG!", "#ff1744");
                        ghiLichSu("🔥 CHÍ MẠNG! Cầu phép gây <b>" + finalDmg + "</b> sát thương cho Rồng!", "log-crit");
                    } else {
                        themChuBay(dragon.x, dragon.y - 35, "-" + finalDmg, "#ff80ab");
                        ghiLichSu("🔮 Cầu phép trúng Rồng gây <b>" + finalDmg + "</b> sát thương.", "log-hero");
                    }
                    taoHatHieuUng(p.x, p.y, p.color, 14);
                    kiemTraKetThuc();
                }
            }
        } else if (p.owner === "dragon" && !gameOver) {
            if (Math.hypot(p.x - hero.x, p.y - hero.y) <= p.r + hero.r) {
                projectiles.splice(i, 1);
                if ((Math.random() * 100) < agility) {
                    hero.dodgeTimer = 0.3;
                    phatAmThanh("dodge");
                    themChuBay(hero.x, hero.y - 30, "NÉ ĐÒN!", "#69f0ae");
                    ghiLichSu("⚡ Bạn né được Hỏa Cầu của Rồng!", "log-dodge");
                } else {
                    var dCrit = (Math.random() * 100) < dragonInt;
                    var dDmg = dCrit ? Math.round(p.damage * 1.5) : p.damage;
                    health -= dDmg;
                    hero.hurtTimer = 0.25;
                    screenShake = dCrit ? 11 : 5;
                    if (dCrit) {
                        phatAmThanh("crit");
                        themChuBay(hero.x, hero.y - 30, "-" + dDmg + " HỎA CẦU CHÍ MẠNG!", "#ff1744");
                        ghiLichSu("💥 Rồng phun Hỏa Cầu CHÍ MẠNG gây <b>" + dDmg + "</b> sát thương!", "log-crit");
                    } else {
                        themChuBay(hero.x, hero.y - 30, "-" + dDmg, "#ffb74d");
                        ghiLichSu("🔥 Hỏa Cầu trúng bạn gây <b>" + dDmg + "</b> sát thương.", "log-dragon");
                    }
                    taoHatHieuUng(p.x, p.y, "#ff6d00", 14);
                    kiemTraKetThuc();
                }
            }
        }
    }

    // Cập nhật hạt nổ & chữ bay
    for (var j = particles.length - 1; j >= 0; j--) {
        var pt = particles[j];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) particles.splice(j, 1);
    }

    for (var m = floatingTexts.length - 1; m >= 0; m--) {
        var ft = floatingTexts[m];
        ft.y -= 42 * dt;
        ft.life -= dt;
        if (ft.life <= 0) floatingTexts.splice(m, 1);
    }

    // Vẽ khung hình
    ctx.save();
    if (screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    }

    veSanDau();
    if (dragonHealth > 0) veConRong();
    if (health > 0) veAnhHung();

    // Vẽ đạn phép & cầu lửa
    for (var k = 0; k < projectiles.length; k++) {
        var pr = projectiles[k];
        ctx.save();
        ctx.shadowColor = pr.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pr.color;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Vẽ hạt hiệu ứng
    for (var n = 0; n < particles.length; n++) {
        var par = particles[n];
        ctx.save();
        ctx.globalAlpha = Math.max(0, par.life / par.maxLife);
        ctx.fillStyle = par.color;
        ctx.beginPath();
        ctx.arc(par.x, par.y, par.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Vẽ chữ sát thương bay lên
    for (var f = 0; f < floatingTexts.length; f++) {
        var fl = floatingTexts[f];
        ctx.save();
        ctx.globalAlpha = Math.min(1, fl.life * 1.5);
        ctx.font = "bold 17px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText(fl.text, fl.x + 2, fl.y + 2);
        ctx.fillStyle = fl.color;
        ctx.fillText(fl.text, fl.x, fl.y);
        ctx.restore();
    }

    ctx.restore();
    capNhatHUD();
    requestAnimationFrame(gameLoop);
}

function khoiDongLaiTranDau() {
    health = maxHealth;
    dragonHealth = maxDragonHealth;
    gameOver = false;
    projectiles = [];
    particles = [];
    floatingTexts = [];
    hero.x = 130; hero.y = 270; hero.vx = 210; hero.vy = 185;
    dragon.x = 470; dragon.y = 270; dragon.vx = -175; dragon.vy = -195;
    dragon.rageTimer = 0;
    document.getElementById("battleLog").innerHTML = "";
    ghiLichSu("🆕 Trận chiến mới! Cả hai đang bật nảy trong đấu trường — hãy nhắm và tung chiêu đúng lúc!", "");
}

khoiDongLaiTranDau();
requestAnimationFrame(gameLoop);