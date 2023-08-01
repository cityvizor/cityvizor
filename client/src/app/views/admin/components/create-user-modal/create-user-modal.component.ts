import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'app/services/admin.service';
import { ToastService } from 'app/services/toast.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnInit {

  @Output() close = new EventEmitter<boolean>();

  login = new Subject<string>();
  loginExists: boolean | null = null;

  constructor(private adminService: AdminService, private toastService: ToastService) { }

  ngOnInit() {
    this.login.subscribe(() => this.loginExists = null);
    this.login.pipe(debounceTime(500)).subscribe(login => this.checkLogin(login));
  }

  async checkLogin(login: string) {
    if (login) this.loginExists = await this.adminService.checkLogin(login);
    else this.loginExists = null;
  }

  async createUser(form: NgForm) {
    const data = form.value;
    await this.adminService.createUser(data);
    this.toastService.toast("Uživatel vytvořen.", "notice");
    this.close.emit(true);
  }

}
