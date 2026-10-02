import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "environments/environment";

export const DASHBOARD_FINANCING_TOGGLE = "dashboard-financing-toggle";

@Injectable({ providedIn: "root" })
export class FeatureFlagsService {
  private http = new HttpClient(inject(HttpBackend));
  private flags: Record<string, boolean> = {};

  async load(): Promise<void> {
    this.flags =
      (await this.http
        .get<Record<string, boolean>>(environment.api_root + "/public/features")
        .toPromise()
        .catch(() => ({}))) ?? {};
  }

  isEnabled(name: string): boolean {
    return this.flags[name] === true;
  }
}
