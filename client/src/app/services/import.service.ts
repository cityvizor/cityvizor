import { Injectable, Inject } from '@angular/core';
import { Profile } from 'app/schema';

import { environment } from "environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  root = environment.api_root + "/import";

  constructor(private http: HttpClient) { }

  async importAccounting(profileId: Profile["id"], formData: FormData, isAppend?: boolean) {
    if (isAppend) {
      return this.http.patch(this.root + "/profiles/" + profileId + "/accounting", formData, { responseType: 'text' }).toPromise();
    } else {
      return this.http.post(this.root + "/profiles/" + profileId + "/accounting", formData, { responseType: 'text' }).toPromise();
    }
  }

  async importPayments(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    if (isAppend) {
      return this.http.patch(this.root + "/profiles/" + profileId + "/payments", formData, { responseType: 'text' }).toPromise();
    } else {
      return this.http.post(this.root + "/profiles/" + profileId + "/payments", formData, { responseType: 'text' }).toPromise();
    }
  }

  async importEvents(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    if (isAppend) {
      return this.http.patch(this.root + "/profiles/" + profileId + "/events", formData, { responseType: 'text' }).toPromise();
    } else {
      return this.http.post(this.root + "/profiles/" + profileId + "/events", formData, { responseType: 'text' }).toPromise();
    }
  }
  async importData(profileId: Profile["id"], formData: FormData, isAppend: boolean) {
    if (isAppend) {
      return this.http.patch(this.root + "/profiles/" + profileId + "/data", formData, { responseType: 'text' }).toPromise();
    } else {
      return this.http.post(this.root + "/profiles/" + profileId + "/data", formData, { responseType: 'text' }).toPromise();
    }
  }
}
