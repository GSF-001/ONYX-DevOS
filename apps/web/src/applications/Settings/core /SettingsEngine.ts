/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

import {
  applyAllModules,
  applyModule,
  getDefaults,
  getModules,
} from "./SettingsRegistry";
import { loadSettings, saveSettings } from "./SettingsPersistence";

type Listener = (settings: Record<string, any>) => void;

let state: Record<string, any> = {};
const listeners = new Set<Listener>();

// INIT
export const initSettings = () => {
  const saved = loadSettings();
  const defaults = getDefaults();

  state = {
    ...defaults,
    ...saved,
  };

  applyAllModules(state);
};

// GET
export const getSettings = () => state;

// SET SINGLE
export const setSetting = (key: string, value: any) => {
  const mod = getModules().get(key);
  if (!mod) return;

  if (mod.validate && !mod.validate(value)) return;

  state = {
    ...state,
    [key]: value,
  };

  saveSettings(state);
  applyModule(key, value);
  notify();
};

// SET MULTIPLE
export const updateSettings = (partial: Record<string, any>) => {
  const modules = getModules();

  const nextState = { ...state };

  for (const [key, value] of Object.entries(partial)) {
    const mod = modules.get(key);
    if (!mod) continue;

    if (mod.validate && !mod.validate(value)) continue;

    nextState[key] = value;
  }

  state = nextState;

  saveSettings(state);
  applyAllModules(state);
  notify();
};

// SUBSCRIBE (reactive system)
export const subscribe = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const notify = () => {
  listeners.forEach((fn) => fn(state));
};
