export function BootLogo() {
  return (
    <div style={{ fontFamily: "var(--win-font-mono, monospace)", lineHeight: 1.3 }}>
      <pre
        style={{
          margin: 0,
          fontSize: 10,
          color: "var(--win-accent, #33FF66)",
        }}
        aria-hidden
      >
{`  ____  _   ___   ____  __
 |    \\| \\ | \\ \\ / /\\ \\/ /
 |  O  |  \\| |\\ V /  \\  /
 |____/|_|\\__| \\_/    \\/`}
      </pre>
      <p style={{ fontSize: 13, marginTop: 8, color: "var(--win-text, #fff)" }}>
        ONYX ENGINEERING WORKSTATION v1.0.0
      </p>
    </div>
  );
}
