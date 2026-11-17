(function () {
  // =========================================================
  // 1. HIỆU ỨNG HOA ANH ĐÀO (SAKURA) RƠI MƯỢT TRÊN CANVAS
  // =========================================================
  function initSakuraCanvas() {
    if (document.getElementById("sakuraCanvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "sakuraCanvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = [
      "rgba(255, 183, 213, 0.85)",
      "rgba(251, 146, 189, 0.78)",
      "rgba(253, 213, 229, 0.9)",
      "rgba(244, 114, 182, 0.68)"
    ];

    function createPetal(startRandomY) {
      const size = 6 + Math.random() * 8;
      return {
        x: Math.random() * width,
        y: startRandomY ? Math.random() * height : -20 - Math.random() * 40,
        size,
        speedY: 0.7 + Math.random() * 1.15,
        speedX: -0.45 + Math.random() * 0.9,
        swayAmp: 0.4 + Math.random() * 0.8,
        swayPhase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.03,
        isBlossom: Math.random() < 0.25,
        color: petalColors[Math.floor(Math.random() * petalColors.length)]
      };
    }

    const petalCount = width < 768 ? 24 : 40;
    const petals = Array.from({ length: petalCount }, () => createPetal(true));

    function drawSinglePetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      if (p.isBlossom) {
        // Bông hoa 5 cánh nhỏ
        for (let i = 0; i < 5; i++) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.size * 0.45, -p.size * 0.75, 0, -p.size);
          ctx.quadraticCurveTo(-p.size * 0.45, -p.size * 0.75, 0, 0);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(219, 39, 119, 0.65)";
        ctx.fill();
      } else {
        // Cánh hoa sakura khẽ xoay
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.7, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
        ctx.fill();
      }
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.swayPhase += 0.02;
        p.x += p.speedX + Math.sin(p.swayPhase) * p.swayAmp;
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.y > height + 25 || p.x < -30 || p.x > width + 30) {
          Object.assign(p, createPetal(false));
        }
        drawSinglePetal(p);
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  // =========================================================
  // 2. LINH VẬT NINJA LÀNG LÁ CHẠY (SVG CHIBI)
  // =========================================================
  function makeNinjaSvg({ hairColor, outfitColor, accentColor, skinColor }) {
    return `
      <svg viewBox="0 0 80 80" class="ninja-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Dải băng trán bay phía sau -->
        <path d="M22 25 Q8 20 4 27 Q12 31 23 29 Z" fill="#1e293b"/>
        <!-- Khăn choàng / áo choàng bay -->
        <path d="M28 45 Q12 46 8 54 Q18 57 32 52 Z" fill="${accentColor}"/>
        <!-- Chân chạy kiểu Naruto -->
        <path d="M36 58 L24 72 L30 74 L41 61 Z" fill="#1e293b"/>
        <path d="M44 58 L58 69 L53 74 L40 62 Z" fill="#0f172a"/>
        <!-- Thân áo Ninja -->
        <rect x="30" y="40" width="22" height="21" rx="8" fill="${outfitColor}"/>
        <rect x="30" y="51" width="22" height="4" fill="#0f172a"/>
        <!-- Hai tay đưa ra sau (Naruto Run) -->
        <path d="M31 44 L14 52 L17 56 L34 48 Z" fill="${outfitColor}"/>
        <!-- Đầu & tóc nhọn -->
        <circle cx="43" cy="27" r="14" fill="${skinColor}"/>
        <path d="M28 24 L25 13 L35 17 L41 8 L47 16 L56 11 L55 21 L61 23 L54 27 C48 21 36 21 28 24 Z" fill="${hairColor}"/>
        <!-- Băng trán Làng Lá (Konoha) -->
        <rect x="30" y="20" width="26" height="6" rx="2" fill="#334155"/>
        <rect x="36" y="20.5" width="14" height="5" rx="1.5" fill="#cbd5e1"/>
        <!-- Biểu tượng xoắn Làng Lá -->
        <path d="M40 23 C40 21.5 44 21.5 44 23 C44 24.3 41.5 24.3 41.5 23 C41.5 22.3 42.6 22.3 42.6 23" fill="none" stroke="#0f172a" stroke-width="1"/>
        <!-- Mắt & má hồng -->
        <circle cx="39" cy="30" r="1.9" fill="#0f172a"/>
        <circle cx="49" cy="30" r="1.9" fill="#0f172a"/>
        <ellipse cx="36" cy="33" rx="2.2" ry="1.2" fill="#fda4af"/>
        <ellipse cx="52" cy="33" rx="2.2" ry="1.2" fill="#fda4af"/>
        <path d="M42 34 Q44.5 36.5 47 34" fill="none" stroke="#9f1239" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    `;
  }

  function initNinjaTrack() {
    if (document.querySelector(".ninja-track")) return;
    const track = document.createElement("div");
    track.className = "ninja-track";
    track.setAttribute("aria-label", "Linh vật Ninja Làng Lá đang chạy");

    const ninjas = [
      {
        quote: "Dattebayo! Luyện tập Lab 08–10 cùng mình nhé!",
        duration: "15s",
        delay: "0s",
        colors: { hairColor: "#facc15", outfitColor: "#f97316", accentColor: "#ea580c", skinColor: "#fde68a" }
      },
      {
        quote: "Shannaro! Hoa anh đào & DOM thật mượt!",
        duration: "18s",
        delay: "-6s",
        colors: { hairColor: "#f472b6", outfitColor: "#ec4899", accentColor: "#be185d", skinColor: "#ffedd5" }
      },
      {
        quote: "Nhanh như Lôi Độn với jQuery!",
        duration: "21s",
        delay: "-12s",
        colors: { hairColor: "#1e293b", outfitColor: "#2563eb", accentColor: "#1e3a8a", skinColor: "#fde68a" }
      }
    ];

    ninjas.forEach((n) => {
      const runner = document.createElement("div");
      runner.className = "ninja-runner";
      runner.style.setProperty("--run-duration", n.duration);
      runner.style.setProperty("--run-delay", n.delay);
      runner.innerHTML = `<span class="ninja-bubble">${n.quote}</span>${makeNinjaSvg(n.colors)}`;

      runner.addEventListener("click", () => {
        const bubble = runner.querySelector(".ninja-bubble");
        bubble.classList.add("is-shown");
        setTimeout(() => bubble.classList.remove("is-shown"), 2200);
      });

      track.appendChild(runner);
    });

    document.body.appendChild(track);
  }

  // =========================================================
  // 3. NHẠC NỀN NARUTO NHẸ NHÀNG (WEB AUDIO API - KHÔNG CẦN FILE MP3)
  //    Giai điệu ngũ cung Nhật Bản (phong cách Sadness & Sorrow / Konoha)
  // =========================================================
  function initNarutoBgm() {
    if (document.getElementById("bgmWidget")) return;

    const widget = document.createElement("div");
    widget.id = "bgmWidget";
    widget.className = "bgm-widget";
    widget.innerHTML = `
      <button type="button" id="bgmToggleBtn" class="bgm-toggle" title="Bật / Tắt nhạc nền Naruto nhẹ">
        🎵 Bật nhạc Làng Lá
      </button>
      <div class="bgm-vol-wrap">
        <label for="bgmVolume">Âm lượng</label>
        <input type="range" id="bgmVolume" class="bgm-slider" min="0" max="40" value="15" aria-label="Âm lượng nhạc nền">
      </div>
    `;
    document.body.appendChild(widget);

    const toggleBtn = document.getElementById("bgmToggleBtn");
    const volSlider = document.getElementById("bgmVolume");

    let audioCtx = null;
    let masterGain = null;
    let isPlaying = false;
    let userManuallyPaused = false;
    let stepTimer = null;
    let stepIndex = 0;

    // Giai điệu ngũ cung nhẹ nhàng lấy cảm hứng phong cách Làng Lá (tần số Hz, 0 = nghỉ)
    // Kết hợp nốt sáo ấm (sine/triangle) + nốt nền koto nhẹ nhàng
    const melody = [
      { f: 440.0, b: 220.0, d: 0.7 }, // A4
      { f: 523.25, b: 0, d: 0.5 },    // C5
      { f: 587.33, b: 293.66, d: 0.9 }, // D5
      { f: 523.25, b: 0, d: 0.5 },    // C5
      { f: 440.0, b: 220.0, d: 0.7 }, // A4
      { f: 392.0, b: 196.0, d: 0.9 }, // G4
      { f: 329.63, b: 164.81, d: 1.0 }, // E4
      { f: 0, b: 0, d: 0.3 },

      { f: 392.0, b: 196.0, d: 0.6 }, // G4
      { f: 440.0, b: 220.0, d: 0.6 }, // A4
      { f: 523.25, b: 261.63, d: 0.8 }, // C5
      { f: 659.25, b: 0, d: 0.8 },    // E5
      { f: 587.33, b: 293.66, d: 0.9 }, // D5
      { f: 440.0, b: 220.0, d: 1.1 }, // A4
      { f: 0, b: 0, d: 0.4 },

      { f: 587.33, b: 293.66, d: 0.6 }, // D5
      { f: 659.25, b: 0, d: 0.6 },    // E5
      { f: 783.99, b: 261.63, d: 0.8 }, // G5
      { f: 659.25, b: 0, d: 0.6 },    // E5
      { f: 587.33, b: 293.66, d: 0.7 }, // D5
      { f: 523.25, b: 0, d: 0.6 },    // C5
      { f: 440.0, b: 220.0, d: 1.2 }, // A4
      { f: 0, b: 0, d: 0.5 }
    ];

    function ensureAudio() {
      if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        audioCtx = new AudioCtx();
        masterGain = audioCtx.createGain();
        // Mức âm lượng dịu nhẹ: thanh trượt 0..40 ánh xạ sang 0..0.22
        masterGain.gain.value = (Number(volSlider.value) / 100) * 0.55;
        masterGain.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return true;
    }

    function playSoftTone(freq, durationSec, type, gainPeak) {
      if (!audioCtx || !masterGain || freq <= 0) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(gainPeak, now + 0.08);
      env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(env);
      env.connect(masterGain);

      osc.start(now);
      osc.stop(now + durationSec + 0.04);
    }

    function scheduleNextNote() {
      if (!isPlaying) return;
      const note = melody[stepIndex % melody.length];
      stepIndex++;

      if (note.f > 0) {
        playSoftTone(note.f, note.d * 0.95, "sine", 0.35);
      }
      if (note.b > 0) {
        playSoftTone(note.b, note.d * 1.15, "triangle", 0.16);
      }

      stepTimer = setTimeout(scheduleNextNote, note.d * 620);
    }

    function startMusic() {
      if (isPlaying) return;
      if (!ensureAudio()) return;
      isPlaying = true;
      toggleBtn.classList.add("is-playing");
      toggleBtn.textContent = "🔊 Đang phát nhạc nhẹ";
      scheduleNextNote();
    }

    function stopMusic() {
      isPlaying = false;
      clearTimeout(stepTimer);
      toggleBtn.classList.remove("is-playing");
      toggleBtn.textContent = "🎵 Bật nhạc Làng Lá";
    }

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPlaying) {
        userManuallyPaused = true;
        stopMusic();
      } else {
        userManuallyPaused = false;
        startMusic();
      }
    });

    volSlider.addEventListener("input", () => {
      if (masterGain && audioCtx) {
        masterGain.gain.setTargetAtTime((Number(volSlider.value) / 100) * 0.55, audioCtx.currentTime, 0.05);
      }
    });

    // Trình duyệt yêu cầu có tương tác đầu tiên để phát âm thanh:
    // Tự bật nhạc êm dịu ngay ở lần chạm/nhấn đầu tiên bên ngoài nút nhạc
    function handleFirstInteraction(e) {
      if (e.target && e.target.closest && e.target.closest("#bgmWidget")) {
        document.removeEventListener("pointerdown", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
        return;
      }
      if (!isPlaying && !userManuallyPaused) {
        startMusic();
      }
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    }

    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSakuraCanvas();
    initNinjaTrack();
    initNarutoBgm();
  });
})();
