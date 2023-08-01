import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'counterparty-detail-modal',
  templateUrl: './counterparty-detail-modal.component.html',
  styleUrls: ['./counterparty-detail-modal.component.scss']
})
export class CounterpartyDetailModalComponent implements OnInit {

  profileId: string;
  counterpartyId: number;
  year: number;
  month: number;

  constructor(public modalRef: BsModalRef) { }
  ngOnInit() { }
}
