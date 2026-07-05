import { DocumentationLink } from "./DocumentationLink";

export function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 0",
        borderTop: "1px solid var(--color-border)",
        fontSize: 12,
        color: "var(--color-text-faint)",
      }}
    >
      <span>ONYX Engineering Workstation</span>
      <DocumentationLink />
    </footer>
  );
}
