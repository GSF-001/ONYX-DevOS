export interface TerminalContext {
  openApp: (appId: string) => void;
  closeApp: (appId: string) => void;
  listOpenApps: () => string[];
  navigate: (path: string) => void;
  clear: () => void;
  print: (lines: string[]) => void;
}

export type CommandHandler = (args: string[], ctx: TerminalContext) => void | Promise<void>;

/** Simple name -> handler map with alias support, mirroring the pattern
 * used by WINDOW_REGISTRY and webhook/dispatcher.ts on the backend. */
export class CommandRegistry {
  private handlers = new Map<string, CommandHandler>();

  register(names: string | string[], handler: CommandHandler): void {
    for (const name of Array.isArray(names) ? names : [names]) {
      this.handlers.set(name.toLowerCase(), handler);
    }
  }

  get(name: string): CommandHandler | undefined {
    return this.handlers.get(name.toLowerCase());
  }

  names(): string[] {
    return Array.from(this.handlers.keys());
  }
}
