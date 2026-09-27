export interface TrackMixerChannel {
  id: 'a' | 'b' | 'c' | 'resultant';
  name: string;
  muted: boolean;
  solo: boolean;
  volume: number; // 0.0 to 1.0
  frequency: number; // Base Hz
}

export type PlayheadCallback = (currentTick: number, progressRatio: number) => void;

class SchillingerAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private bpm: number = 120;
  private currentTick: number = 0;
  private totalTicks: number = 12;
  private nextTickTime: number = 0;
  private lookaheadMs: number = 25;
  private scheduleAheadSec: number = 0.1;
  private onPlayheadUpdate: PlayheadCallback | null = null;

  // Track channels configuration
  public channels: Record<'a' | 'b' | 'c' | 'resultant', TrackMixerChannel> = {
    a: { id: 'a', name: 'Generator a', muted: false, solo: false, volume: 0.8, frequency: 320 },
    b: { id: 'b', name: 'Generator b', muted: false, solo: false, volume: 0.8, frequency: 640 },
    c: { id: 'c', name: 'Generator c', muted: false, solo: false, volume: 0.8, frequency: 960 },
    resultant: { id: 'resultant', name: 'Resultant r', muted: false, solo: false, volume: 0.95, frequency: 1200 },
  };

  // Scheduled events map by tick index: tick -> Array of channel triggers
  private eventTimeline: Map<number, Array<{ channel: 'a' | 'b' | 'c' | 'resultant'; isAccented: boolean }>> = new Map();

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
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

  /**
   * Loads the sequence into the playback timeline
   */
  public loadSequence(
    totalTicks: number,
    events: Array<{ tick: number; channel: 'a' | 'b' | 'c' | 'resultant'; isAccented: boolean }>
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
   * Acoustic Percussion Synthesizer
   * Produces a warm, organic woodblock / clave / click transient
   */
  private triggerPercussion(
    channelId: 'a' | 'b' | 'c' | 'resultant',
    time: number,
    isAccented: boolean
  ) {
    if (!this.ctx) return;

    const ch = this.channels[channelId];
    if (!ch) return;

    // Solo logic: If any channel is soloed, play ONLY soloed channels
    const hasAnySolo = Object.values(this.channels).some((c) => c.solo);
    if (hasAnySolo && !ch.solo) return;
    if (!hasAnySolo && ch.muted) return;

    const velocity = isAccented ? 1.0 : 0.65;
    const finalGain = ch.volume * velocity;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Woodblock body resonance
    filter.type = 'bandpass';
    filter.Q.value = channelId === 'resultant' ? 6.0 : 4.0;
    const baseFreq = ch.frequency;
    filter.frequency.setValueAtTime(baseFreq, time);

    // Subtle pitch dip for resonant percussion thud
    osc.type = channelId === 'resultant' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq * (isAccented ? 1.6 : 1.4), time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.025);

    // Fast exponential decay envelope
    const decayDuration = channelId === 'resultant' ? 0.08 : 0.12;
    gainNode.gain.setValueAtTime(finalGain, time);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

    // Subtle transient click / noise crackle
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(baseFreq * 3, time);
    clickGain.gain.setValueAtTime(finalGain * 0.4, time);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.008);

    clickOsc.connect(filter);
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(this.ctx.destination);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);

    osc.start(time);
    clickOsc.start(time);
    osc.stop(time + decayDuration + 0.01);
    clickOsc.stop(time + 0.01);
  }

  /**
   * Main scheduler loop using Web Audio lookahead
   */
  private schedule() {
    if (!this.ctx || !this.isPlaying) return;

    // Time per single atomic pulse 't' in seconds
    // Assume 1 beat = quarter note = 4 time units (16th notes) by default
    // seconds per unit t = (60 / bpm) / 4
    const secondsPerUnit = 60 / this.bpm / 4;

    while (this.nextTickTime < this.ctx.currentTime + this.scheduleAheadSec) {
      const tick = this.currentTick;
      const triggers = this.eventTimeline.get(tick);

      if (triggers) {
        for (const trig of triggers) {
          this.triggerPercussion(trig.channel, this.nextTickTime, trig.isAccented);
        }
      }

      // Schedule visual update
      const targetTime = this.nextTickTime;
      const currentTickValue = tick;
      const total = this.totalTicks;
      const delayMs = Math.max(0, (targetTime - this.ctx.currentTime) * 1000);

      window.setTimeout(() => {
        if (this.isPlaying && this.onPlayheadUpdate) {
          this.onPlayheadUpdate(currentTickValue, currentTickValue / total);
        }
      }, delayMs);

      // Advance clock
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
