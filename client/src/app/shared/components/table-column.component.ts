import { Component, input, signal } from "@angular/core";
import { Column, RowData } from "@tanstack/angular-table";
import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { adminTableFeatures, TextFilter } from "../admin-table";

@Component({
  selector: "th[appTableColumn]",
  imports: [
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
  ],
  host: {
    "[attr.aria-sort]":
      "filterOnly() ? null : column().getIsSorted() === 'asc' ? 'ascending' : column().getIsSorted() === 'desc' ? 'descending' : 'none'",
  },
  template: `
    @if (!filterOnly()) {
      <button
        type="button"
        class="btn btn-link text-body text-decoration-none text-start fw-semibold p-0"
        [attr.aria-label]="'Seřadit podle: ' + label()"
        (click)="column().toggleSorting()"
      >
        {{ label() }}
        <i
          aria-hidden="true"
          [class]="
            'fa-solid ms-1 ' +
            (column().getIsSorted() === 'asc'
              ? 'fa-sort-up'
              : column().getIsSorted() === 'desc'
                ? 'fa-sort-down'
                : 'fa-sort')
          "
        ></i>
      </button>
    } @else if (options().length) {
      <select
        #selection
        class="form-select"
        [attr.aria-label]="'Filtrovat: ' + label()"
        [value]="column().getFilterValue() ?? ''"
        (change)="column().setFilterValue(selection.value || undefined)"
      >
        <option value="">Všechny</option>
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    } @else {
      <div class="d-flex align-items-center gap-1" dropdown>
        <input
          #text
          type="text"
          class="form-control"
          [attr.aria-label]="'Filtrovat: ' + label()"
          [value]="filter()?.text ?? ''"
          (input)="setFilter(text.value)"
        />
        <button
          type="button"
          dropdownToggle
          class="btn btn-link text-secondary p-1"
          [attr.aria-label]="'Možnosti filtru: ' + label()"
        >
          <i class="fa-solid fa-filter" aria-hidden="true"></i>
        </button>
        <ul
          *dropdownMenu
          class="dropdown-menu"
          role="menu"
          [attr.aria-label]="'Porovnání: ' + label()"
        >
          @for (option of modes; track option.value) {
            <li role="none">
              <button
                type="button"
                class="dropdown-item"
                role="menuitemradio"
                [class.active]="mode() === option.value"
                [attr.aria-checked]="mode() === option.value"
                (click)="
                  mode.set(option.value); setFilter(filter()?.text ?? '')
                "
              >
                {{ option.label }}
              </button>
            </li>
          }
          <li role="none"><hr class="dropdown-divider" /></li>
          <li role="none">
            <button
              type="button"
              class="dropdown-item"
              role="menuitem"
              (click)="setFilter('')"
            >
              No Filter
            </button>
          </li>
        </ul>
      </div>
    }
  `,
})
export class TableColumnComponent<T extends RowData> {
  readonly column = input.required<Column<typeof adminTableFeatures, T>>();
  readonly label = input.required<string>();
  readonly filterOnly = input(false);
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly mode = signal<TextFilter["mode"]>("contains");
  readonly modes = [
    { value: "startsWith", label: "Starts with" },
    { value: "contains", label: "Contains" },
    { value: "notContains", label: "Not contains" },
    { value: "endsWith", label: "Ends with" },
    { value: "equals", label: "Equals" },
    { value: "notEquals", label: "Not equals" },
  ] as const;

  filter(): TextFilter | undefined {
    return this.column().getFilterValue() as TextFilter | undefined;
  }

  setFilter(text: string): void {
    this.column().setFilterValue(
      text ? { text, mode: this.mode() } : undefined,
    );
  }
}
