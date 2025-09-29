import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CounterpartyDetailComponent } from "../counterparty-detail/counterparty-detail.component";

@Component({
    selector: "counterparty-detail-modal",
    templateUrl: "./counterparty-detail-modal.component.html",
    styleUrls: ["./counterparty-detail-modal.component.scss"],
    standalone: true,
    imports: [CounterpartyDetailComponent],
})
export class CounterpartyDetailModalComponent {
  profileId: string;
  counterpartyId: number;
  year: number;
  month: number;

  constructor(public modalRef: BsModalRef) {}
}
