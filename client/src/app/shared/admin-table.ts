import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/angular-table";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export const adminTableFeatures = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export function sortText(
  a: { getValue: (id: string) => unknown },
  b: { getValue: (id: string) => unknown },
  id: string,
): number {
  return collator.compare(
    String(a.getValue(id) ?? ""),
    String(b.getValue(id) ?? ""),
  );
}

export interface TextFilter {
  text: string;
  mode:
    | "contains"
    | "notContains"
    | "startsWith"
    | "endsWith"
    | "equals"
    | "notEquals";
}

export function filterText(
  row: { getValue: (id: string) => unknown },
  id: string,
  filter: TextFilter,
): boolean {
  const normalize = (value: unknown) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLocaleLowerCase();
  const value = normalize(row.getValue(id));
  const text = normalize(filter.text);
  switch (filter.mode) {
    case "contains":
      return value.includes(text);
    case "notContains":
      return !value.includes(text);
    case "startsWith":
      return value.startsWith(text);
    case "endsWith":
      return value.endsWith(text);
    case "equals":
      return value === text;
    case "notEquals":
      return value !== text;
  }
}
