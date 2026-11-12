// ================= BÀI 1 - 4: KHỞI TẠO ANH HÙNG =================
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

// Kiểm tra tên (Bài 4)
var nhapTen = prompt("Hãy nhập tên bạn", "Hồ Gia Bảo");
if (nhapTen == ten) {
    console.log("Chính xác! Bạn có trí nhớ rất tốt! intel +5!");
    intel = intel + 5;
} else {
    console.log("Tệ thật! Tên chính mình mà không nhớ sao?! intel -5!");
    intel = intel - 5;
}

// Chọn phân cấp (Bài 4)
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

// ================= QUEST 5 & BÀI TẬP 6: ĐẤU TRƯỜNG RỒNG GIÀ =================
level = 5; // Đảm bảo ở cấp độ 5 trước trận chiến
var maxHealth = level + 100;
var health = maxHealth;

var maxDragonHealth = 600;
var dragonHealth = maxDragonHealth;
var dragonStr = 100;
var dragonAgi = 15;
var dragonInt = 80;

var gameContinue = true;
var luotThu = 0;
var autoTimer = null;
var amThanhBat = true;

// Cập nhật thông tin lên giao diện DOM
document.getElementById("heroIntro").innerText =
    "Tôi tên là " + ten + " – MSSV: " + mssv + " | Phân cấp: " + phancap + " (Cấp " + level + ")";
document.getElementById("heroTitle").innerText = ten + " (" + phancap + ")";
capNhatGiaoDien();

// ================= HỆ THỐNG ÂM THANH (WEB AUDIO API) =================
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

    if (loai === "heroAttack") {
        // Tiếng chưởng phép Wanda
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (loai === "dragonAttack") {
        // Tiếng rồng khạc lửa trầm
        osc.type = "square";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (loai === "crit") {
        // Tiếng nổ chí mạng
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (loai === "dodge") {
        // Tiếng lướt né đòn
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
    } else if (loai === "win") {
        // Nhạc chiến thắng
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        osc.frequency.setValueAtTime(1046.5, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
        osc.start(now);
        osc.stop(now + 0.75);
    } else if (loai === "lose") {
        // Nhạc thất bại
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.6);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

function batTatAmThanh() {
    amThanhBat = !amThanhBat;
    document.getElementById("btnSound").innerText = amThanhBat ? "🔊 Âm thanh: BẬT" : "🔇 Âm thanh: TẮT";
}

// ================= HÀM HIỆU ỨNG & CẬP NHẬT UI =================
function kichHoatHieuUng(elementId, className) {
    var el = document.getElementById(elementId);
    el.classList.remove(className);
    void el.offsetWidth; // Reset animation CSS
    el.classList.add(className);
}

function hienChuBay(elementId, noiDung, mauSac) {
    var el = document.getElementById(elementId);
    el.innerText = noiDung;
    el.style.color = mauSac;
    kichHoatHieuUng(elementId, "anim-float");
}

function ghiLichSu(noiDung, className) {
    var logBox = document.getElementById("battleLog");
    var p = document.createElement("div");
    p.className = className;
    p.innerHTML = noiDung;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

function capNhatGiaoDien() {
    var hpHienTai = Math.max(0, health);
    var dragonHpHienTai = Math.max(0, dragonHealth);

    document.getElementById("heroHpBar").style.width = (hpHienTai / maxHealth * 100) + "%";
    document.getElementById("heroHpText").innerText = "HP: " + hpHienTai + " / " + maxHealth;
    document.getElementById("heroStatsText").innerText =
        "STR: " + strength + " | AGI: " + agility + " | INT: " + intel;
    document.getElementById("heroStatus").innerText =
        "Cấp độ: " + level + " | XP: " + xp + " | Sẵn sàng diệt Rồng!";

    document.getElementById("dragonHpBar").style.width = (dragonHpHienTai / maxDragonHealth * 100) + "%";
    document.getElementById("dragonHpText").innerText = "HP: " + dragonHpHienTai + " / " + maxDragonHealth;
}

// ================= LOGIC CHIẾN ĐẤU (BÀI TẬP 5 & 7) =================
function kiemTraTrungDon(chiSoNeCuaMucTieu) {
    return (Math.random() * 100) > chiSoNeCuaMucTieu;
}

function gaySatThuong(mauHienTai, satThuong) {
    return mauHienTai - satThuong;
}

function thucHienLuotDanh() {
    if (!gameContinue) return;
    luotThu++;
    ghiLichSu("<strong>--- Lượt " + luotThu + " ---</strong>", "");

    // 1. ANH HÙNG TẤN CÔNG TRƯỚC
    kichHoatHieuUng("heroBox", "anim-hero-attack");
    kichHoatHieuUng("heroOrb", "anim-shoot-right");

    var heroHit = kiemTraTrungDon(dragonAgi);
    if (heroHit) {
        dragonHealth = gaySatThuong(dragonHealth, strength);
        var tongSatThuongHero = strength;
        var heroCritical = (Math.random() * 100) < intel;

        if (heroCritical) {
            dragonHealth = gaySatThuong(dragonHealth, strength * 2);
            tongSatThuongHero += strength * 2;
            phatAmThanh("crit");
            kichHoatHieuUng("dragonBox", "anim-hurt");
            hienChuBay("dragonFloat", "-" + tongSatThuongHero + " CHÍ MẠNG!", "#ff1744");
            ghiLichSu("🔥 TRẢM LONG CHÍ MẠNG! " + ten + " gây <b>" + tongSatThuongHero + "</b> sát thương cho Rồng!", "log-crit");
        } else {
            phatAmThanh("heroAttack");
            kichHoatHieuUng("dragonBox", "anim-hurt");
            hienChuBay("dragonFloat", "-" + tongSatThuongHero, "#ff80ab");
            ghiLichSu("⚔️ TRẢM LONG! " + ten + " gây " + tongSatThuongHero + " sát thương cho Rồng.", "log-hero");
        }
    } else {
        phatAmThanh("dodge");
        kichHoatHieuUng("dragonBox", "anim-dodge");
        hienChuBay("dragonFloat", "XÍ HỤT!", "#80deea");
        ghiLichSu("💨 XÍ HỤT! Rồng Già đã lượn tránh được đòn tấn công của bạn!", "log-dodge");
    }

    capNhatGiaoDien();

    // Kiểm tra Rồng chết chưa
    if (dragonHealth <= 0) {
        gameContinue = false;
        dungTuDong();
        level = 6;
        xp += 600;
        capNhatGiaoDien();
        phatAmThanh("win");
        ghiLichSu("🏆 CHIẾN THẮNG!!! Bạn đạt danh hiệu 'Dũng sĩ diệt Rồng'! LEVEL UP cấp 6! XP +600", "log-win");
        document.getElementById("btnAttack").disabled = true;
        document.getElementById("btnAuto").disabled = true;
        return;
    }

    // 2. RỒNG TẤN CÔNG SAU (trễ 550ms để nhìn rõ hiệu ứng 2 pha)
    setTimeout(function () {
        if (!gameContinue) return;

        kichHoatHieuUng("dragonBox", "anim-dragon-attack");
        kichHoatHieuUng("dragonFire", "anim-shoot-left");

        var dragonHit = kiemTraTrungDon(agility);
        if (dragonHit) {
            health = gaySatThuong(health, dragonStr);
            var tongSatThuongRong = dragonStr;
            var dragonCritical = (Math.random() * 100) < dragonInt;

            if (dragonCritical) {
                health = gaySatThuong(health, dragonStr * 2);
                tongSatThuongRong += dragonStr * 2;
                phatAmThanh("crit");
                kichHoatHieuUng("heroBox", "anim-hurt");
                hienChuBay("heroFloat", "-" + tongSatThuongRong + " CHÍ MẠNG!", "#ff1744");
                ghiLichSu("💥 HỎA CẦU CHÍ MẠNG! Rồng gây <b>" + tongSatThuongRong + "</b> sát thương cho bạn!", "log-crit");
            } else {
                phatAmThanh("dragonAttack");
                kichHoatHieuUng("heroBox", "anim-hurt");
                hienChuBay("heroFloat", "-" + tongSatThuongRong, "#ffb74d");
                ghiLichSu("🔥 HỎA CẦU! Rồng gây " + tongSatThuongRong + " sát thương cho bạn.", "log-dragon");
            }
        } else {
            phatAmThanh("dodge");
            kichHoatHieuUng("heroBox", "anim-dodge");
            hienChuBay("heroFloat", "NÉ ĐÒN!", "#69f0ae");
            ghiLichSu("⚡ XÍ HỤT! Bạn đã né tránh ngoạn mục đòn phun lửa từ Rồng!", "log-dodge");
        }

        capNhatGiaoDien();

        // Kiểm tra Anh Hùng chết chưa
        if (health <= 0) {
            gameContinue = false;
            dungTuDong();
            phatAmThanh("lose");
            ghiLichSu("💀 THẤT BẠI!!! Bạn đã có tên trên menu món tối của Rồng: Hiệp sĩ nướng lá lốt!", "log-lose");
            document.getElementById("btnAttack").disabled = true;
            document.getElementById("btnAuto").disabled = true;
        }
    }, 550);
}

function batTatTuDong() {
    if (autoTimer) {
        dungTuDong();
    } else {
        thucHienLuotDanh();
        autoTimer = setInterval(function () {
            if (!gameContinue) {
                dungTuDong();
            } else {
                thucHienLuotDanh();
            }
        }, 1400);
        document.getElementById("btnAuto").innerText = "⏸️ Dừng Tự Động";
    }
}

function dungTuDong() {
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
    }
    document.getElementById("btnAuto").innerText = "⚡ Tự Động Đấu";
}

function choiLai() {
    dungTuDong();
    health = maxHealth;
    dragonHealth = maxDragonHealth;
    luotThu = 0;
    gameContinue = true;
    document.getElementById("battleLog").innerHTML = "";
    document.getElementById("btnAttack").disabled = false;
    document.getElementById("btnAuto").disabled = false;
    capNhatGiaoDien();
    ghiLichSu("🆕 Trận đấu mới bắt đầu! Hãy nhấn <b>Tấn Công</b> hoặc <b>Tự Động Đấu</b>.", "");
}