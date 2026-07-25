// Templates/TemplateCategories.ts

export interface TemplateCategory {
  id: string;
  label: string;
  icon: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "all", label: "All templates", icon: "▦" },
  { id: "brainstorm", label: "Brainstorming", icon: "💡" },
  { id: "planning", label: "Planning", icon: "🗂" },
  { id: "diagrams", label: "Diagrams", icon: "🔀" },
  { id: "retrospective", label: "Retrospectives", icon: "🔁" },
  { id: "mapping", label: "Mind maps", icon: "🧠" },
  { id: "workshop", label: "Workshops", icon: "🛠" },
];

export function getCategoryLabel(id: string): string {
  return TEMPLATE_CATEGORIES.find((c) => c.id === id)?.label ?? "Uncategorized";
}

export function isValidCategory(id: string): boolean {
  return TEMPLATE_CATEGORIES.some((c) => c.id === id);
}
