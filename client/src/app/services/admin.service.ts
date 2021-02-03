import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { environment } from "environments/environment";
import { Profile, BudgetYear, User } from 'app/schema';
import { Import } from 'app/schema/import';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  root = environment.api_root + "/admin";

  constructor(private http: HttpClient) { }

  /* PROFILES */
  getProfiles() {
    return this.http.get<Profile[]>(this.root + "/profiles").toPromise();
  }

  getProfile(profileId: number | string) {
    return this.http.get<Profile>(this.root + "/profiles/" + profileId).toPromise();
  }

  async createProfile(profile: Profile) {
    const response = await this.http.post(this.root + "/profiles", profile, { observe: "response", responseType: "text" }).toPromise();
    return this.http.get<any>(this.root + response.headers.get("location")).toPromise();
  }

  saveProfile(profileId: number, profile: Partial<Profile>) {
    return this.http.patch<any>(this.root + "/profiles/" + profileId, profile).toPromise();
  }

  deleteProfile(profileId: number) {
    return this.http.delete<any>(this.root + "/profiles/" + profileId).toPromise();
  }

  /* PROFILE AVATAR */
  saveProfileAvatar(profileId: number, data: FormData) {
    return this.http.put(this.root + "/profiles/" + profileId + "/avatar", data, { responseType: 'text' }).toPromise();
  }
  saveProfileAvatarFromUrl(profileId: number, avatarUrl: string) {
    return this.http.put(this.root + "/profiles/" + profileId + "/avatar", {url: avatarUrl}, { responseType: 'text' }).toPromise();
  }
  deleteProfileAvatar(profileId: number) {
    return this.http.delete(this.root + "/profiles/" + profileId + "/avatar", { responseType: 'text' }).toPromise();
  }
  getProfileAvatarUrl(profile: Profile): string | null {
    if (profile.avatarType) return this.root + "/profiles/" + profile.id + "/avatar";
    else return null;
  }

  /* PROFILE BUDGET */

  getProfileYears(profileId: Profile["id"]) {
    return this.http.get<BudgetYear[]>(this.root + "/profiles/" + profileId + "/years").toPromise();
  }
  createProfileYear(profileId: Profile["id"], year: number, data: Partial<BudgetYear>): Promise<HttpResponse<string>> {
    return this.http.put(this.root + "/profiles/" + profileId + "/years/" + year, data, { observe: "response", responseType: "text" }).toPromise();
  }
  updateProfileYear(profileId: Profile["id"], year: number, data: Partial<BudgetYear>): Promise<HttpResponse<string>> {
    return this.http.patch(this.root + "/profiles/" + profileId + "/years/" + year, data, { observe: "response", responseType: "text" }).toPromise();
  }
  deleteProfileYear(profileId: Profile["id"], year: number): Promise<any> {
    return this.http.delete(this.root + "/profiles/" + profileId + "/years/" + year, { responseType: "text" }).toPromise();
  }

  /* IMPORTS */

  generateProfileImportToken(profileId: Profile["id"]) {
    return this.http.get(this.root + "/profiles/" + profileId + "/import-token", { responseType: "text" }).toPromise();
  }
  resetProfileImportToken(profileId: Profile["id"]) {
    return this.http.delete(this.root + "/profiles/" + profileId + "/import-token", { responseType: "text" }).toPromise();
  }

  /* IMPORT LOGS */

  getProfileImports(profileId: Profile["id"]) {
    return this.http.get<Import[]>(this.root + "/profiles/" + profileId + "/imports").toPromise();
  }

  /* USERS */
  getUsers() {
    return this.http.get<User[]>(this.root + "/users").toPromise();
  }
  getUser(userId: User["id"]) {
    return this.http.get<User>(this.root + "/users/" + userId).toPromise();
  }

  getUserProfiles(userId: User["id"]) {
    return this.http.get<Profile["id"][]>(this.root + "/users/" + userId + "/profiles").toPromise();
  }

  checkLogin(login: User["login"]) {
    return this.http.get<boolean>(this.root + "/users/check-login/" + login).toPromise();
  }
  async createUser(userData) {
    const response = await this.http.post(this.root + "/users", userData, { observe: "response", responseType: "text" }).toPromise();
    return this.http.get<any>(this.root + response.headers.get("location")).toPromise();
  }
  saveUser(userId: User["id"], userData: Partial<User>) {
    return this.http.patch<any>(this.root + "/users/" + userId, userData).toPromise();
  }
  saveUserProfiles(userId: User["id"], managedProfiles: Profile["id"][]) {
    return this.http.put<any>(this.root + "/users/" + userId + "/profiles", managedProfiles).toPromise();
  }
  deleteUser(userId: User["id"]) {
    return this.http.delete(this.root + "/users/" + userId, { responseType: 'text' }).toPromise();
  }
}
