import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TitleService } from "app/services/title.service";
import { AuthService } from "../../services/auth.service";
import { HeaderMenuComponent } from "../../shared/components/header-menu/header-menu.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: "admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HeaderMenuComponent, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AdminComponent implements OnInit, OnDestroy {
  private titleService = inject(TitleService);
  authService = inject(AuthService);

  ngOnInit() {
    this.titleService.setTitle("Administrace");
  }

  ngOnDestroy() {
    this.titleService.setTitle(null);
  }
}
