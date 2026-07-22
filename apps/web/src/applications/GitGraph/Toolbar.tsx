// Toolbar.tsx
import { useGitGraphState } from "./GitGraphHooks";
import { setFilterQuery, setZoom, resetViewport, clearSelection } from "./GitGraphCommands";

export default function Toolbar() {
  const { filterQuery, viewport } = useGitGraphState();

  return (
    <div className="git-graph-toolbar">
      <input
        className="git-graph-toolbar-search"
        type="search"
        placeholder="Filter by message, author, hash, branch…"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        aria-label="Filter commits"
      />
      <div className="git-graph-toolbar-zoom">
        <button onClick={() => setZoom(viewport.zoom - 0.1)} aria-label="Zoom out">
          −
        </button>
        <span className="git-graph-toolbar-zoom-value">{Math.round(viewport.zoom * 100)}%</span>
        <button onClick={() => setZoom(viewport.zoom + 0.1)} aria-label="Zoom in">
          +
        </button>
        <button className="git-graph-toolbar-reset" onClick={resetViewport}>
          Reset view
        </button>
      </div>
      <button className="git-graph-toolbar-clear" onClick={clearSelection}>
        Clear selection
      </button>
    </div>
  );
}
