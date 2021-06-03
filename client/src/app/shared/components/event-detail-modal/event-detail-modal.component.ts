import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Profile} from "app/schema/profile"
@Component({
    selector: 'event-detail-modal',
    templateUrl: './event-detail-modal.component.html',
    styleUrls: ['./event-detail-modal.component.scss']
})
export class EventDetailModalComponent implements OnInit {

    openTab: string;

    profile: Profile;
    eventId: number;
    year: number;

    constructor(public modalRef: BsModalRef) {
    }

    ngOnInit() {
    }

}
