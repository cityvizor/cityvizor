import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Profile } from 'app/schema';
import { NgForm } from '@angular/forms';
import { DataService } from 'app/services/data.service';
import { AdminService } from 'app/services/admin.service';

@Component({
  selector: 'create-year-modal',
  templateUrl: './create-year-modal.component.html',
  styleUrls: ['./create-year-modal.component.scss']
})
export class CreateYearModalComponent implements OnInit {

  @Input() profileId: number;

  @Output() close = new EventEmitter<boolean>();

  currentYear: number;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.currentYear = (new Date()).getFullYear() + 1;
  }

  async createYear(form: NgForm): Promise<void> {
    await this.adminService.createProfileYear(this.profileId, form.value.year, {})
    this.close.emit(true);
  }

}
