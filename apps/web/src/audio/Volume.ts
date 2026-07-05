const STORAGE_KEY = "onyx.volume";
let volume = typeof localStorage !== "undefined" ? Number(localStorage.getItem(STORAGE_KEY) ?? 0.5) : 0.5;
let muted = typeof localStorage !== "undefined" ? localStorage.getItem("onyx.muted") === "true" : false;

export function getVolume(): number {
  return muted ? 0 : volume;
}

export function setVolume(value: number): void {
  volume = Math.max(0, Math.min(1, value));
  localStorage.setItem(STORAGE_KEY, String(volume));
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem("onyx.muted", String(value));
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}
