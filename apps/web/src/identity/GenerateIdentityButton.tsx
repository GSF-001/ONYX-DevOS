interface GenerateIdentityButtonProps {
  onGenerate: () => void;
  loading: boolean;
}

export function GenerateIdentityButton({ onGenerate, loading }: GenerateIdentityButtonProps) {
  return (
    <button className="win-button" style={{ width: "auto", padding: "6px 14px" }} onClick={onGenerate} disabled={loading}>
      {loading ? "Generating..." : "Generate Again"}
    </button>
  );
}
