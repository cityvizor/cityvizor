import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
    selector: 'event-detail-modal',
    templateUrl: './event-detail-modal.component.html',
    styleUrls: ['./event-detail-modal.component.scss']
})
export class EventDetailModalComponent implements OnInit {

    openTab: string;

    profileId: number;
    eventId: number;
    year: number;

    constructor(public modalRef: BsModalRef) {
    }

    ngOnInit() {
    }

}
