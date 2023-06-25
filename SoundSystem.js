export class SoundSystem {
  constructor(path, preloads = []) {
    this.path = path;
    this.audios = [];
    for (const name of preloads) {
      const a = new Audio(this.path + name + ".mp3");
      this.audios[name] = a;
    }
  }
  play(name) {
    const a = this.audios[name];
    if (a.currentTime != 0) {
      if (!a.ended) {
        a.currentTime = 0;
      } else {
        a.play();
      }
    } else {
      a.play();
    }
    //a.addEventListener("canplaythrough", () => a.play());
  }
}
