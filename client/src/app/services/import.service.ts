import { Injectable, Inject } from '@angular/core';
import { Profile } from 'app/schema';

import { environment } from "environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  root = environment.api_root + "/import";

  private generateRequest(profileId: Profile["id"], formData: FormData, endpoint: string, isAppend?: boolean) {
    if (isAppend) {
      return this.http.patch(`${this.root}/profiles/${profileId}/${endpoint}`, formData, {responseType: 'text'}).toPromise()
    } else {
      return this.http.post(`${this.root}/profiles/${profileId}/${endpoint}`, formData, {responseType: 'text'}).toPromise()
    }
  }
  constructor(private http: HttpClient) { }

  async importAccounting(profileId: Profile["id"], formData: FormData, isAppend?: boolean) {
    return this.generateRequest(profileId, formData, "accounting", isAppend)
  }

  async importPayments(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    return this.generateRequest(profileId, formData, "payments", isAppend)
  }

  async importEvents(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    return this.generateRequest(profileId, formData, "events", isAppend)
  }
  async importData(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    return this.generateRequest(profileId, formData, "data", isAppend)
  }

  async importExpectedPlan(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    return this.generateRequest(profileId, formData, "plans/expected", isAppend);
  }
  async importRealPlan(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    return this.generateRequest(profileId, formData, "plans/real", isAppend);
  }
}
