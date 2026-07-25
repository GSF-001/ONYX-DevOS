/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Templates/TemplateLoader.ts

import { Layer, Template, WhiteboardObject, makeId } from "../WhiteboardTypes";

function stickyAt(
  x: number,
  y: number,
  text: string,
  color: string,
  layerId: string,
  zIndex: number
): WhiteboardObject {
  const now = Date.now();
  return {
    id: makeId("sticky"),
    type: "sticky",
    x,
    y,
    width: 180,
    height: 140,
    rotation: 0,
    layerId,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    createdAt: now,
    updatedAt: now,
    text,
    color,
    fontSize: 14,
  };
}

function frameAt(
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  layerId: string,
  zIndex: number
): WhiteboardObject {
  const now = Date.now();
  return {
    id: makeId("frame"),
    type: "frame",
    x,
    y,
    width,
    height,
    rotation: 0,
    layerId,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    createdAt: now,
    updatedAt: now,
    name,
    fill: "#fbfbfc",
    childIds: [],
  };
}

function textAt(
  x: number,
  y: number,
  text: string,
  layerId: string,
  zIndex: number,
  fontSize = 20
): WhiteboardObject {
  const now = Date.now();
  return {
    id: makeId("text"),
    type: "text",
    x,
    y,
    width: 260,
    height: 36,
    rotation: 0,
    layerId,
    zIndex,
    locked: false,
    visible: true,
    opacity: 1,
    createdAt: now,
    updatedAt: now,
    text,
    fontSize,
    fontFamily: "Inter, sans-serif",
    color: "#1c1f26",
    align: "left",
    bold: true,
    italic: false,
  };
}

function makeLayer(name: string): Layer {
  return {
    id: makeId("layer"),
    name,
    visible: true,
    locked: false,
    order: 0,
    parentId: null,
    collapsed: false,
  };
}

export function buildRetrospectiveTemplate(): Template {
  const layer = makeLayer("Retro board");
  const objects: WhiteboardObject[] = [
    textAt(60, 20, "Sprint Retrospective", layer.id, 0),
    frameAt(60, 80, 280, 480, "Went well", layer.id, 1),
    frameAt(370, 80, 280, 480, "Went wrong", layer.id, 2),
    frameAt(680, 80, 280, 480, "Action items", layer.id, 3),
    stickyAt(80, 120, "Fast deploys this sprint", "#fff3b0", layer.id, 4),
    stickyAt(80, 280, "Good pairing sessions", "#fff3b0", layer.id, 5),
    stickyAt(390, 120, "Flaky CI pipeline", "#ffc9c9", layer.id, 6),
    stickyAt(700, 120, "Add CI retry logic", "#b2f2bb", layer.id, 7),
  ];
  return {
    id: makeId("template"),
    name: "Sprint Retrospective",
    category: "retrospective",
    thumbnail: "🔁",
    objects,
    layers: [layer],
  };
}

export function buildBrainstormTemplate(): Template {
  const layer = makeLayer("Brainstorm");
  const objects: WhiteboardObject[] = [
    textAt(60, 20, "Brainstorm Session", layer.id, 0),
    stickyAt(80, 100, "Idea one", "#a5d8ff", layer.id, 1),
    stickyAt(280, 100, "Idea two", "#b2f2bb", layer.id, 2),
    stickyAt(480, 100, "Idea three", "#ffec99", layer.id, 3),
    stickyAt(80, 280, "Idea four", "#eebefa", layer.id, 4),
    stickyAt(280, 280, "Idea five", "#ffc9c9", layer.id, 5),
  ];
  return {
    id: makeId("template"),
    name: "Brainstorm Grid",
    category: "brainstorm",
    thumbnail: "💡",
    objects,
    layers: [layer],
  };
}

export function buildKanbanTemplate(): Template {
  const layer = makeLayer("Kanban");
  const objects: WhiteboardObject[] = [
    textAt(60, 20, "Kanban Board", layer.id, 0),
    frameAt(60, 80, 260, 500, "To do", layer.id, 1),
    frameAt(340, 80, 260, 500, "In progress", layer.id, 2),
    frameAt(620, 80, 260, 500, "Done", layer.id, 3),
    stickyAt(80, 120, "Write spec", "#a5d8ff", layer.id, 4),
    stickyAt(360, 120, "Build API", "#ffec99", layer.id, 5),
    stickyAt(640, 120, "Ship v1", "#b2f2bb", layer.id, 6),
  ];
  return {
    id: makeId("template"),
    name: "Kanban Board",
    category: "planning",
    thumbnail: "🗂",
    objects,
    layers: [layer],
  };
}

export function getBuiltInTemplates(): Template[] {
  return [buildRetrospectiveTemplate(), buildBrainstormTemplate(), buildKanbanTemplate()];
}

/**
 * Clones a template's objects/layers with freshly generated ids so multiple
 * instances of the same template can coexist on one board.
 */
export function instantiateTemplate(template: Template): { objects: WhiteboardObject[]; layers: Layer[] } {
  const layerIdMap: Record<string, string> = {};
  const layers = template.layers.map((l) => {
    const newId = makeId("layer");
    layerIdMap[l.id] = newId;
    return { ...l, id: newId };
  });

  const objects = template.objects.map((o) => ({
    ...o,
    id: makeId(o.type),
    layerId: layerIdMap[o.layerId] ?? o.layerId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

  return { objects, layers };
}
