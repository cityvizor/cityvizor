import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

import { CollapseDirective } from "ngx-bootstrap/collapse";

@Component({
  selector: "header-menu",
  templateUrl: "header-menu.component.html",
  styleUrls: ["header-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CollapseDirective],
})
export class HeaderMenuComponent {
  @Input() title: string;
  @Input() backLink: string;

  isCollapsed = true;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  collapse(): void {
    this.isCollapsed = true;
  }
}
