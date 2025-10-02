import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ConfigService } from "config/config";

@Injectable({
  providedIn: "root",
})
export class TitleService {
  private title = inject(Title);
  private configService = inject(ConfigService);


  setTitle(title: string | null) {
    if (title)
      this.title.setTitle(title + " :: " + this.configService.config.title);
    else this.title.setTitle(this.configService.config.title);
  }
}
