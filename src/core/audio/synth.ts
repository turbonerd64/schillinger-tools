export interface TrackMixerChannel {
  id: 'a' | 'b' | 'c' | 'resultant' | 'accent';
  name: string;
  muted: boolean;
  solo: boolean;
  volume: number; // 0.0 to 1.0
  frequency: number; // Base Hz
}

export type PlayheadCallback = (currentTick: number, progressRatio: number) => void;

class SchillingerAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private bpm: number = 100;
  private masterVolume: number = 0.85;
  private currentTick: number = 0;
  private totalTicks: number = 12;
  private nextTickTime: number = 0;
  private lookaheadMs: number = 25;
  private scheduleAheadSec: number = 0.1;
  private onPlayheadUpdate: PlayheadCallback | null = null;

  // Harmony progression state
  private harmonyTimerId: number | null = null;
  private isHarmonyPlaying: boolean = false;

  // Track channels configuration
  public channels: Record<'a' | 'b' | 'c' | 'resultant' | 'accent', TrackMixerChannel> = {
    a: { id: 'a', name: 'Generator a', muted: false, solo: false, volume: 0.8, frequency: 320 },
    b: { id: 'b', name: 'Generator b', muted: false, solo: false, volume: 0.8, frequency: 640 },
    c: { id: 'c', name: 'Generator c', muted: false, solo: false, volume: 0.8, frequency: 960 },
    resultant: { id: 'resultant', name: 'Resultant r', muted: false, solo: false, volume: 0.9, frequency: 880 },
    accent: { id: 'accent', name: 'Phase Accents', muted: false, solo: false, volume: 0.85, frequency: 1150 },
  };

  private eventTimeline: Map<number, Array<{ channel: 'a' | 'b' | 'c' | 'resultant' | 'accent'; isAccented: boolean }>> = new Map();

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(30, Math.min(300, newBpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setPlayheadCallback(cb: PlayheadCallback | null) {
    this.onPlayheadUpdate = cb;
  }

  public loadSequence(
    totalTicks: number,
    events: Array<{ tick: number; channel: 'a' | 'b' | 'c' | 'resultant' | 'accent'; isAccented: boolean }>
  ) {
    this.totalTicks = Math.max(1, totalTicks);
    this.eventTimeline.clear();

    for (const ev of events) {
      const list = this.eventTimeline.get(ev.tick) || [];
      list.push(ev);
      this.eventTimeline.set(ev.tick, list);
    }
  }

  /**
   * Resonant Melodic Chime for Resultant Identity
   */
  private triggerResultantChime(time: number, gain: number, isAccented: boolean) {
    if (!this.ctx || !this.masterGainNode) return;

    const baseFreq = this.channels.resultant.frequency;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.Q.value = 5.0;
    filter.frequency.setValueAtTime(baseFreq, time);

    // Warm fundamental triangle + harmonic overtone
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.0, time);

    const decaySec = 0.18;
    gain1.gain.setValueAtTime(gain * 0.9, time);
    gain1.gain.exponentialRampToValueAtTime(0.0001, time + decaySec);

    gain2.gain.setValueAtTime(gain * 0.35, time);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + decaySec * 0.7);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.masterGainNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + decaySec + 0.02);
    osc2.stop(time + decaySec + 0.02);
  }

  /**
   * Authentic Acoustic Metallic Strike for Phase Coincidence Accents
   */
  private triggerMetallicAccent(time: number, gain: number) {
    if (!this.ctx || !this.masterGainNode) return;

    // Dual inharmonic square wave partials (agogo/cowbell mode pair: 845 Hz & 1260 Hz)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const bandpass = this.ctx.createBiquadFilter();

    bandpass.type = 'bandpass';
    bandpass.Q.value = 6.0;
    bandpass.frequency.setValueAtTime(1150, time);

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(845, time);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1260, time);

    const ringDecay = 0.22;
    oscGain.gain.setValueAtTime(gain * 0.85, time);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, time + ringDecay);

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(bandpass);
    bandpass.connect(this.masterGainNode);

    // Sharp stick strike click transient
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(2600, time);
    clickGain.gain.setValueAtTime(gain * 0.5, time);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.012);

    click.connect(clickGain);
    clickGain.connect(this.masterGainNode);

    osc1.start(time);
    osc2.start(time);
    click.start(time);
    osc1.stop(time + ringDecay + 0.02);
    osc2.stop(time + ringDecay + 0.02);
    click.stop(time + 0.02);
  }

  /**
   * Acoustic Percussion Synthesizer
   */
  private triggerPercussion(
    channelId: 'a' | 'b' | 'c' | 'resultant' | 'accent',
    time: number,
    isAccented: boolean
  ) {
    if (!this.ctx || !this.masterGainNode) return;

    const ch = this.channels[channelId];
    if (!ch) return;

    const hasAnySolo = Object.values(this.channels).some((c) => c.solo);
    if (hasAnySolo && !ch.solo) return;
    if (!hasAnySolo && ch.muted) return;

    const velocity = isAccented ? 1.0 : 0.75;
    const finalGain = ch.volume * velocity;

    if (channelId === 'accent') {
      this.triggerMetallicAccent(time, finalGain);
      return;
    }

    if (channelId === 'resultant') {
      this.triggerResultantChime(time, finalGain, isAccented);
      return;
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.Q.value = 4.0;
    const baseFreq = ch.frequency;
    filter.frequency.setValueAtTime(baseFreq, time);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.025);

    const decayDuration = channelId === 'a' ? 0.12 : 0.09;
    gainNode.gain.setValueAtTime(finalGain, time);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(baseFreq * 3, time);
    clickGain.gain.setValueAtTime(finalGain * 0.4, time);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.008);

    clickOsc.connect(filter);
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(this.masterGainNode);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGainNode);

    osc.start(time);
    clickOsc.start(time);
    osc.stop(time + decayDuration + 0.01);
    clickOsc.stop(time + 0.01);
  }

  /**
   * Polyphonic Voice Synthesizer for Chords
   * Supports 'epiano' (Rhodes), 'piano' (Acoustic Grand), and 'guitar' (Acoustic Pluck)
   */
  public playVoicedChord(
    midiNotes: number[],
    durationSec: number = 0.9,
    instrument: 'epiano' | 'piano' | 'guitar' = 'epiano',
    startTime?: number
  ) {
    this.initContext();
    if (!this.ctx || !this.masterGainNode) return;

    const start = startTime ?? this.ctx.currentTime;
    const noteGainAmount = 0.45 / Math.sqrt(Math.max(1, midiNotes.length));

    midiNotes.forEach((midi, voiceIndex) => {
      if (!this.ctx || !this.masterGainNode) return;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (instrument === 'piano') {
        // Acoustic Grand Piano: percussive hammer hit + rich decay
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, start);
        filter.frequency.exponentialRampToValueAtTime(700, start + durationSec);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        // Hammer click transient
        const hammer = this.ctx.createOscillator();
        const hammerGain = this.ctx.createGain();
        hammer.type = 'sine';
        hammer.frequency.setValueAtTime(freq * 4, start);
        hammerGain.gain.setValueAtTime(noteGainAmount * 0.4, start);
        hammerGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.02);
        hammer.connect(hammerGain);
        hammerGain.connect(this.masterGainNode);
        hammer.start(start);
        hammer.stop(start + 0.025);

        // Envelope: immediate attack (0.005s), natural acoustic decay
        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.linearRampToValueAtTime(noteGainAmount * 1.2, start + 0.008);
        gainNode.gain.exponentialRampToValueAtTime(noteGainAmount * 0.4, start + durationSec * 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);
      } else if (instrument === 'guitar') {
        // Acoustic Plucked Guitar: bright string pluck + body resonance
        filter.type = 'bandpass';
        filter.Q.value = 2.5;
        filter.frequency.setValueAtTime(freq * 2.2, start);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.1, start + 0.15);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        // Pluck transient
        const pluck = this.ctx.createOscillator();
        const pluckGain = this.ctx.createGain();
        pluck.type = 'square';
        pluck.frequency.setValueAtTime(freq * 5, start);
        pluckGain.gain.setValueAtTime(noteGainAmount * 0.35, start);
        pluckGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.015);
        pluck.connect(pluckGain);
        pluckGain.connect(this.masterGainNode);
        pluck.start(start);
        pluck.stop(start + 0.02);

        // Envelope: fast pluck attack (0.006s), guitar body ring
        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.linearRampToValueAtTime(noteGainAmount * 1.1, start + 0.006);
        gainNode.gain.exponentialRampToValueAtTime(noteGainAmount * 0.3, start + durationSec * 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);
      } else {
        // Electric Piano (Rhodes): warm sine/triangle with smooth attack
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(voiceIndex === 0 ? 900 : 2800, start);

        osc.type = voiceIndex === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.linearRampToValueAtTime(noteGainAmount, start + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(noteGainAmount * 0.7, start + durationSec * 0.6);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);
      }

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGainNode);

      osc.start(start);
      osc.stop(start + durationSec + 0.05);
    });
  }

  private schedule() {
    if (!this.ctx || !this.isPlaying) return;

    const secondsPerUnit = 60 / this.bpm / 4;

    while (this.nextTickTime < this.ctx.currentTime + this.scheduleAheadSec) {
      const tick = this.currentTick;
      const triggers = this.eventTimeline.get(tick);

      if (triggers) {
        for (const trig of triggers) {
          this.triggerPercussion(trig.channel, this.nextTickTime, trig.isAccented);
        }
      }

      const targetTime = this.nextTickTime;
      const currentTickValue = tick;
      const total = this.totalTicks;
      const delayMs = Math.max(0, (targetTime - this.ctx.currentTime) * 1000);

      window.setTimeout(() => {
        if (this.isPlaying && this.onPlayheadUpdate) {
          this.onPlayheadUpdate(currentTickValue, currentTickValue / total);
        }
      }, delayMs);

      this.nextTickTime += secondsPerUnit;
      this.currentTick = (this.currentTick + 1) % this.totalTicks;
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    if (this.ctx) {
      this.nextTickTime = this.ctx.currentTime + 0.05;
    }

    this.timerId = window.setInterval(() => {
      this.schedule();
    }, this.lookaheadMs);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public stop() {
    this.pause();
    this.currentTick = 0;
    if (this.onPlayheadUpdate) {
      this.onPlayheadUpdate(0, 0);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioService = new SchillingerAudioEngine();
