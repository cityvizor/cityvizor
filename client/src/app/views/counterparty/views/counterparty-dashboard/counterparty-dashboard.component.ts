import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "counterparty-dashboard",
  templateUrl: "./counterparty-dashboard.component.html",
  styleUrls: ["./counterparty-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class CounterpartyDashboardComponent {
  constructor() {}
}
