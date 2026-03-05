// hooks/useSounds.js
// Custom hook to play game sound effects using Web Audio API

export function useSounds() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Water splash sound (for misses)
  const playWater = () => {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
  };

  // Short cheer sound (for hits)
  const playHit = () => {
    const now = audioContext.currentTime;
    
    // Play a quick ascending tone
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
    
    // Quick secondary tone
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    osc2.frequency.setValueAtTime(600, now + 0.12);
    osc2.frequency.linearRampToValueAtTime(800, now + 0.22);
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    
    osc2.start(now + 0.12);
    osc2.stop(now + 0.22);
  };

  // Victory fanfare (for game over/win)
  const playVictory = () => {
    const now = audioContext.currentTime;
    const notes = [
      { freq: 523, duration: 0.2 },  // C5
      { freq: 659, duration: 0.2 },  // E5
      { freq: 784, duration: 0.3 },  // G5
      { freq: 1047, duration: 0.5 }, // C6
    ];
    
    let time = now;
    notes.forEach(note => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(note.freq, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
      
      osc.start(time);
      osc.stop(time + note.duration);
      
      time += note.duration;
    });
  };

  // Disappointment sound (for loss)
  const playDisappointment = () => {
    const now = audioContext.currentTime;
    const notes = [
      { freq: 523, duration: 0.2 },  // C5
      { freq: 440, duration: 0.2 },  // A4
      { freq: 392, duration: 0.3 },  // G4
      { freq: 330, duration: 0.5 },  // E4
    ];
    
    let time = now;
    notes.forEach(note => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(note.freq, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
      
      osc.start(time);
      osc.stop(time + note.duration);
      
      time += note.duration;
    });
  };

  return {
    playWater,
    playHit,
    playVictory,
    playDisappointment,
  };
}
