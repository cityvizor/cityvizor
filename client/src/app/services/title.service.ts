import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfig, IAppConfig } from 'config/config';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(
    private title: Title,
    @Inject(AppConfig) private config: IAppConfig
  ) { }

  setTitle(title: string | null) {
    if (title) this.title.setTitle(title + " :: " + this.config.title);
    else this.title.setTitle(this.config.title);
  }
}
