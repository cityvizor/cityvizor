import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from 'app/services/title.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(private titleService: TitleService, public authService: AuthService) { }

  ngOnInit() {
    this.titleService.setTitle("Administrace");
  }

  ngOnDestroy() {
    this.titleService.setTitle(null);
  }

}
