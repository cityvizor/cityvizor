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

  async importAccounting(profileId: Profile["id"], formData: FormData) {
    return this.http.post(this.root + "/profiles/" + profileId + "/accounting", formData, { responseType: 'text' }).toPromise();
  }

}
