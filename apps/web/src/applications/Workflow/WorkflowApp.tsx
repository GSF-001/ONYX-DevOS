/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// WorkflowApp.tsx — top-level component composing toolbar, library, canvas, inspector, console

import React, { useEffect, useState } from "react";
import "./WorkflowStyles.css";
import { InfiniteCanvas } from "./Canvas/InfiniteCanvas";
import { NodeLibrary } from "./Panels/NodeLibrary";
import { Inspector } from "./Panels/Inspector";
import { Console } from "./Panels/Console";
import { Variables } from "./Panels/Variables";
import { Search } from "./Panels/Search";
import { Layers } from "./Panels/Layers";
import { useWorkflowState, useWorkflowActions } from "./WorkflowHooks";
import { WorkflowAPI } from "./WorkflowAPI";
import { downloadJSON, importJSON } from "./Export/JSON";
import { downloadPNG } from "./Export/PNG";
import { downloadSVG } from "./Export/SVG";
import { undo, bindUndoShortcut } from "./Timeline/Undo";
import { redo, bindRedoShortcut } from "./Timeline/Redo";
import { historyManager } from "./Timeline/History";
import { workflowDebugger } from "./Simulation/Debugger";

type SidePanelTab = "library" | "search" | "layers" | "variables";

export function WorkflowApp() {
  const state = useWorkflowState();
  const { renameDocument } = useWorkflowActions();
  const [tab, setTab] = useState<SidePanelTab>("library");
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    const unbindUndo = bindUndoShortcut();
    const unbindRedo = bindRedoShortcut();
    return () => {
      unbindUndo();
      unbindRedo();
    };
  }, []);

  useEffect(() => {
    historyManager.record("initial");
  }, []);

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { errors } = importJSON(String(reader.result));
      if (errors.length) errors.forEach((err) => console.warn(err));
    };
    reader.readAsText(file);
    setFileInputKey((k) => k + 1);
  };

  const runValidation = () => {
    const errors = WorkflowAPI.validate(state.doc);
    if (errors.length === 0) {
      window.alert("Workflow is valid: single Start node, End node present, all nodes reachable.");
    } else {
      window.alert(`Validation issues:\n- ${errors.join("\n- ")}`);
    }
  };

  return (
    <div className="wf-app">
      <div className="wf-toolbar">
        <input
          className="wf-input"
          style={{ width: 160 }}
          value={state.doc.name}
          onChange={(e) => renameDocument(e.target.value)}
        />
        <button className="wf-btn-bevel" onClick={() => WorkflowAPI.save()}>
          Save
        </button>
        <button className="wf-btn-bevel" onClick={undo} disabled={!historyManager.canUndo()}>
          Undo
        </button>
        <button className="wf-btn-bevel" onClick={redo} disabled={!historyManager.canRedo()}>
          Redo
        </button>
        <button className="wf-btn-bevel" onClick={runValidation}>
          Validate
        </button>
        <span style={{ width: 8 }} />
        <button className="wf-btn-bevel" onClick={() => downloadJSON()}>
          Export JSON
        </button>
        <button className="wf-btn-bevel" onClick={() => downloadSVG()}>
          Export SVG
        </button>
        <button className="wf-btn-bevel" onClick={() => downloadPNG()}>
          Export PNG
        </button>
        <label className="wf-btn-bevel" style={{ cursor: "pointer" }}>
          Import
          <input key={fileInputKey} type="file" accept="application/json" style={{ display: "none" }} onChange={onImportFile} />
        </label>
        <span style={{ width: 8 }} />
        <button className="wf-btn-bevel" onClick={() => workflowDebugger.start()}>
          ▶ Run
        </button>
        <button className="wf-btn-bevel" onClick={() => workflowDebugger.step()}>
          ⏭ Step
        </button>
        <button className="wf-btn-bevel" onClick={() => workflowDebugger.resume()}>
          ⏸→▶ Resume
        </button>
        <button className="wf-btn-bevel" onClick={() => workflowDebugger.stop()}>
          ■ Stop
        </button>
        <span style={{ marginLeft: "auto", fontSize: 11 }}>Status: {state.executionStatus}</span>
      </div>

      <div className="wf-node-library" style={{ gridArea: "library", display: "flex", flexDirection: "column" }}>
        <div className="wf-toolbar" style={{ padding: 2 }}>
          {(["library", "search", "layers", "variables"] as SidePanelTab[]).map((t) => (
            <button
              key={t}
              className="wf-btn-bevel"
              style={{ fontWeight: tab === t ? "bold" : "normal" }}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "library" && <NodeLibrary />}
        {tab === "search" && <Search />}
        {tab === "layers" && <Layers />}
        {tab === "variables" && <Variables />}
      </div>

      <InfiniteCanvas />
      <Console />
      <Inspector />
    </div>
  );
}
