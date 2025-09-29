import { Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import { CollapseDirective } from "ngx-bootstrap/collapse";

@Component({
    selector: "header-menu",
    templateUrl: "header-menu.component.html",
    styleUrls: ["header-menu.component.scss"],
    standalone: true,
    imports: [NgIf, CollapseDirective],
})
export class HeaderMenuComponent {
  @Input() title: string;
  @Input() backLink: string;

  public isMenuCollapsed: boolean = true;

  constructor() {}
}
