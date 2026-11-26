/**
 * StrawberryAudio - Bộ tổng hợp âm thanh dễ thương & nhạc Lo-fi Chill
 * Dùng 100% Web Audio API (không cần tải file MP3 ngoài, chạy mượt offline)
 */
class StrawberryAudio {
    constructor() {
        this.ctx = null;
        this.sfxEnabled = true;
        this.bgmPlaying = false;
        this.bgmVolume = 0.45;
        this.bgmGain = null;
        this.bgmTimer = null;
        this.stepIndex = 0;

        // Vòng hợp âm Lo-fi Strawberry Chill (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
        this.chords = [
            { bass: 174.61, notes: [261.63, 329.63, 349.23, 440.00], melody: [523.25, 659.25, 587.33] }, // Fmaj7
            { bass: 164.81, notes: [246.94, 293.66, 329.63, 392.00], melody: [493.88, 587.33, 659.25] }, // Em7
            { bass: 146.83, notes: [220.00, 261.63, 293.66, 349.23], melody: [440.00, 523.25, 587.33] }, // Dm7
            { bass: 130.81, notes: [196.00, 246.94, 261.63, 329.63], melody: [392.00, 493.88, 523.25] }  // Cmaj7
        ];
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            this.ctx = new AudioCtx();
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = this.bgmVolume * 0.25;
            this.bgmGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    setSfxEnabled(enabled) {
        this.sfxEnabled = enabled;
    }

    setVolume(percent) {
        this.bgmVolume = Math.max(0, Math.min(1, percent / 100));
        if (this.bgmGain && this.ctx) {
            this.bgmGain.gain.setTargetAtTime(this.bgmVolume * 0.25, this.ctx.currentTime, 0.05);
        }
    }

    playTone(freq, {
        duration = 0.14,
        type = 'sine',
        gain = 0.12,
        delay = 0,
        slideTo = null,
        targetNode = null
    } = {}) {
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const amp = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
        }

        amp.gain.setValueAtTime(0.0001, start);
        amp.gain.linearRampToValueAtTime(gain, start + 0.015);
        amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(amp);
        amp.connect(targetNode || ctx.destination);

        osc.start(start);
        osc.stop(start + duration + 0.03);
    }

    // SFX: Tiếng "pop" bong bóng dễ thương
    playPop() {
        if (!this.sfxEnabled) return;
        this.playTone(520, { duration: 0.075, type: 'sine', gain: 0.08, slideTo: 780 });
    }

    // SFX: Tiếng chạm bé Dâu mascot
    playBoop() {
        if (!this.sfxEnabled) return;
        this.playTone(620, { duration: 0.09, type: 'triangle', gain: 0.11, slideTo: 930 });
        this.playTone(930, { duration: 0.12, type: 'sine', gain: 0.08, delay: 0.07, slideTo: 1120 });
    }

    // SFX: Thêm công việc mới
    playAdd() {
        if (!this.sfxEnabled) return;
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((f, idx) => {
            this.playTone(f, { duration: 0.16, type: 'triangle', gain: 0.09, delay: idx * 0.055 });
        });
    }

    // SFX: Chuyển sang Đang làm
    playProgress() {
        if (!this.sfxEnabled) return;
        this.playTone(587.33, { duration: 0.14, type: 'sine', gain: 0.09 });
        this.playTone(783.99, { duration: 0.18, type: 'sine', gain: 0.09, delay: 0.07 });
    }

    // SFX: Hoàn thành công việc (giai điệu lấp lánh!)
    playComplete() {
        if (!this.sfxEnabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        notes.forEach((f, idx) => {
            this.playTone(f, { duration: 0.22, type: 'sine', gain: 0.1, delay: idx * 0.055 });
        });
    }

    // SFX: Xóa nhẹ nhàng
    playDelete() {
        if (!this.sfxEnabled) return;
        this.playTone(440, { duration: 0.12, type: 'sine', gain: 0.08, slideTo: 260 });
    }

    // Nhạc nền Lo-fi Chill Synthesizer
    toggleBgm() {
        if (this.bgmPlaying) {
            this.stopBgm();
            return false;
        }
        this.startBgm();
        return true;
    }

    startBgm() {
        const ctx = this.ensureContext();
        if (!ctx || this.bgmPlaying) return;

        this.bgmPlaying = true;
        this.scheduleBar();
        this.bgmTimer = setInterval(() => this.scheduleBar(), 2600);
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    scheduleBar() {
        if (!this.bgmPlaying || !this.ctx) return;
        const ctx = this.ctx;
        const chord = this.chords[this.stepIndex % this.chords.length];
        this.stepIndex += 1;

        // Low-pass filter tạo độ ấm kiểu đĩa than Lo-fi
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 920;
        filter.connect(this.bgmGain);

        // Nốt Bass mềm
        this.playTone(chord.bass, {
            duration: 2.3,
            type: 'triangle',
            gain: 0.36,
            targetNode: filter
        });

        // Hợp âm Rhodes ấm áp
        chord.notes.forEach((note, idx) => {
            this.playTone(note, {
                duration: 2.2,
                type: 'sine',
                gain: 0.16,
                delay: idx * 0.04,
                targetNode: filter
            });
        });

        // Giai điệu Kalimba dâu rải nhẹ
        const melodyOrder = [0, 1, 2, 1];
        melodyOrder.forEach((mIdx, beat) => {
            const freq = chord.melody[mIdx];
            if (Math.random() > 0.18) {
                this.playTone(freq, {
                    duration: 0.55,
                    type: 'sine',
                    gain: 0.14,
                    delay: 0.45 + beat * 0.52,
                    targetNode: filter
                });
            }
        });
    }
}

window.strawberryAudio = new StrawberryAudio();
