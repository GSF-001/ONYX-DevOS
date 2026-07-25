/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

type SettingsModule = {
  key: string;
  default: any;
  validate?: (value: any) => boolean;
  apply: (value: any) => void;
};

const modules = new Map<string, SettingsModule>();

export const registerModule = (module: SettingsModule) => {
  modules.set(module.key, module);
};

export const getModules = () => modules;

export const getDefaults = () => {
  const defaults: Record<string, any> = {};
  modules.forEach((mod, key) => {
    defaults[key] = mod.default;
  });
  return defaults;
};

export const applyModule = (key: string, value: any) => {
  const mod = modules.get(key);
  if (!mod) return;

  if (mod.validate && !mod.validate(value)) return;

  mod.apply(value);
};

export const applyAllModules = (settings: Record<string, any>) => {
  modules.forEach((mod, key) => {
    const value = settings[key] ?? mod.default;
    applyModule(key, value);
  });
};
