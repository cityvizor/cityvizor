import { Component, inject } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CounterpartyDetailComponent } from "../counterparty-detail/counterparty-detail.component";

@Component({
  selector: "counterparty-detail-modal",
  templateUrl: "./counterparty-detail-modal.component.html",
  styleUrls: ["./counterparty-detail-modal.component.scss"],
  imports: [CounterpartyDetailComponent],
})
export class CounterpartyDetailModalComponent {
  modalRef = inject(BsModalRef);

  profileId: string;
  counterpartyId: number;
  year: number;
  month: number;
}
