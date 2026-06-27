import { Component, inject } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Profile } from "app/schema/profile";
import { EventDetailComponent } from "../event-detail/event-detail.component";
@Component({
  selector: "event-detail-modal",
  templateUrl: "./event-detail-modal.component.html",
  styleUrls: ["./event-detail-modal.component.scss"],
  imports: [EventDetailComponent],
})
export class EventDetailModalComponent {
  modalRef = inject(BsModalRef);

  openTab: string;

  profile: Profile;
  eventId: number;
  year: number;
}
