import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "not-found-page",
  templateUrl: "not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class NotFoundPageComponent {}
