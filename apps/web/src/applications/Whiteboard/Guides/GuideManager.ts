// Guides/GuideManager.ts

import { GuideLineData, makeId } from "../WhiteboardTypes";

export class GuideManager {
  private guides: GuideLineData[] = [];
  private listeners: Set<(guides: GuideLineData[]) => void> = new Set();

  subscribe(listener: (guides: GuideLineData[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.guides));
  }

  addGuide(orientation: "horizontal" | "vertical", position: number): GuideLineData {
    const guide: GuideLineData = { id: makeId("guide"), orientation, position };
    this.guides = [...this.guides, guide];
    this.emit();
    return guide;
  }

  removeGuide(id: string) {
    this.guides = this.guides.filter((g) => g.id !== id);
    this.emit();
  }

  moveGuide(id: string, position: number) {
    this.guides = this.guides.map((g) => (g.id === id ? { ...g, position } : g));
    this.emit();
  }

  clearAll() {
    this.guides = [];
    this.emit();
  }

  getGuides(): GuideLineData[] {
    return [...this.guides];
  }

  getGuidesByOrientation(orientation: "horizontal" | "vertical"): GuideLineData[] {
    return this.guides.filter((g) => g.orientation === orientation);
  }
}

export const guideManager = new GuideManager();
