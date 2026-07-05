import type { Command } from "./CommandList";

interface CommandSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: Command[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onRun: (command: Command) => void;
}

export function CommandSearch({
  query,
  onQueryChange,
  results,
  activeIndex,
  onActiveIndexChange,
  onRun,
}: CommandSearchProps) {
  const grouped = results.reduce<Record<string, Command[]>>((acc, command) => {
    (acc[command.group] ??= []).push(command);
    return acc;
  }, {});

  let runningIndex = -1;

  return (
    <div>
      <input
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Type a command or search..."
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          border: "none",
          borderBottom: "1px solid var(--win-border, #333)",
          background: "transparent",
          color: "inherit",
          outline: "none",
        }}
      />
      <div style={{ maxHeight: 320, overflowY: "auto", padding: 4 }}>
        {results.length === 0 && (
          <p style={{ padding: 12, fontSize: 13, color: "var(--win-text-dim, #888)" }}>
            No matching commands.
          </p>
        )}
        {Object.entries(grouped).map(([group, commands]) => (
          <div key={group}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.05em",
                color: "var(--win-text-dim, #888)",
                padding: "6px 10px 2px",
              }}
            >
              {group.toUpperCase()}
            </p>
            {commands.map((command) => {
              runningIndex += 1;
              const isActive = runningIndex === activeIndex;
              return (
                <div
                  key={command.id}
                  onMouseEnter={() => onActiveIndexChange(runningIndex)}
                  onClick={() => onRun(command)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 4,
                    fontSize: 13,
                    cursor: "pointer",
                    background: isActive ? "var(--win-accent, #4fd1ae)" : "transparent",
                    color: isActive ? "#06110d" : "inherit",
                  }}
                >
                  <span>{command.label}</span>
                  {command.hint && (
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{command.hint}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
