class SoundManager {
  private audio: HTMLAudioElement | null = null;

  play(soundPath: string, volume: number = 0.5) {
    try {
      //* Create new audio instance each time for overlapping sounds
      this.audio = new Audio(soundPath);
      this.audio.volume = Math.max(0, Math.min(1, volume));
      
      //* Play the sound
      const playPromise = this.audio.play();
      
      //* Handle play errors
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing notification sound:', error);
        });
      }
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}

export const soundManager = new SoundManager();