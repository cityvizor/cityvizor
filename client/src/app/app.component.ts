import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { trigger, style, animate, transition } from "@angular/animations";
import { setTheme } from "ngx-bootstrap/utils";

import { ToastService } from "./services/toast.service";
import { AuthService } from "./services/auth.service";
import { ACLService } from "./services/acl.service";

import { ConfigService } from "config/config";

import { default as packageConfig } from "../../package.json";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "cityvizor-app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  animations: [
    trigger("toastsFadeOut", [
      transition(":leave", animate(250, style({ opacity: 0 }))), // * => void
    ]),
  ],
})
export class AppComponent implements OnInit {
  private viewContainerRef: ViewContainerRef; // ng2-bootstrap requirement

  // array to link toasts from toastService
  toasts: Array<any>;

  version = packageConfig.version;

  wrongPassword: boolean = false;

  alternativeFooterHtml: string;

  tracking: {
    html: string[];
    scripts: string[];
  };

  constructor(
    private toastService: ToastService,
    public authService: AuthService,
    public aclService: ACLService,
    private router: Router,
    public configService: ConfigService,
    translateService: TranslateService
  ) {
    // Explicitly configure ngx-bootstrap to use Bootstrap 3, otherwise newer version is used
    setTheme("bs3");

    this.toasts = this.toastService.toasts;
    this.alternativeFooterHtml =
      this.configService.config.alternativePageContent.footerHtml;
    this.tracking = this.configService.config.alternativePageContent.tracking;

    translateService.setDefaultLang("cs");
    translateService.use("cs");
  }

  ngOnInit() {
    this.tracking.scripts.forEach(script => {
      script = script.replace(/^<script>/, "").replace(/<\/script>$/, "");
      eval(script);
    });
  }

  logout() {
    this.router.navigate(["/login"]);
    this.authService.logout();
  }
}
