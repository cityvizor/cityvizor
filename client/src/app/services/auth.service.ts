import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { JwtHelperService } from "@auth0/angular-jwt";

import { UserToken } from "app/schema/user";
import { Credentials } from "app/schema/credentials";

import { environment } from "environments/environment";

/**
 * Service to save user information and communicate user data with server
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  public readonly ROLE_FULL_ADMIN: string = "admin";
  public readonly ROLE_PROFILE_ADMIN: string = "profile-admin";

  public onLogin = new Subject<any>();
  public onLogout = new Subject<void>();

  // boolean if user is logged
  logged: boolean = false;

  // current token
  token: String | null = null;

  // current user (use blank user as default)
  user: UserToken;

  root = environment.api_root + "/account";

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    // refresh user data to match token
    this.refreshState();

    // periodically check token validity; once per minute
    setInterval(() => this.refreshState(), 60 * 1000);

    // periodically renew token; once per 30 minutes
    setInterval(() => this.renewToken(), 30 * 60 * 1000);
  }

  saveToken(token) {
    return window.localStorage.setItem("id_token", token);
  }

  getToken() {
    return window.localStorage.getItem("id_token");
  }

  deleteToken() {
    return window.localStorage.removeItem("id_token");
  }

  // get the token by credentials
  login(credentials: Credentials): Promise<any> {
    return new Promise((resolve, reject) => {
      // query the web api to get the token
      return this.http
        .post(this.root + "/login", credentials, { responseType: "text" })
        .toPromise()

        .then(token => {
          //save the token to storage
          this.saveToken(token);

          // update state to match token from storage
          this.refreshState();

          // if user is not logged at this step, token was invalid
          if (this.logged) resolve(this.user);
          else reject(new Error("Invalid token"));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Tokens have limited time validity to avoid misuses, however, we do not want user to be "logged out" while working with the application. Therefore we have to renew this token from time to time.
   */
  renewToken(): void {
    // if we dont have token, there is nothing to renew
    if (!this.token) return;

    // get the new token. as an authorization, we use current token
    this.http
      .get(this.root + "/login/renew", { responseType: "text" })
      .toPromise()

      .then(token => {
        //save the token to storage
        this.saveToken(token);

        // update state to match token from storage
        this.refreshState();
      });
  }

  /*
   * lookup token in storage and check if it is valid. if yes, update state
   */
  refreshState(): void {
    // get token from storage
    const token = this.getToken();

    // check if token valid
    try {
      if (token != null && !this.jwtHelper.isTokenExpired(token)) {
        // save the token
        this.token = token;

        // set user
        this.setUser(this.jwtHelper.decodeToken(token));

        // announce login to subscribers if applicable
        if (!this.logged) this.onLogin.next(this.user);

        this.logged = true;
        return;
      }
    } catch {
      console.log("Invalid token. Please refresh the page.");
    }

    // announce logout to subscribers if applicable
    if (this.logged) this.onLogout.next();

    // token invalid or missing, so set empty token and user
    this.token = null;
    this.logged = false;
    this.setUser(null);
    this.deleteToken();
  }

  /*
   * log out user
   */
  logout(): boolean {
    // delete token from storage
    this.deleteToken();

    // update user data
    this.refreshState();

    return !this.logged;
  }

  setUser(userData: any) {
    this.user = userData || { role: "guest", managedProfiles: [] };
  }

  userHasRole(role: string): boolean {
    if (!this.logged || !this.user || !this.user.roles) {
      return false;
    }
    return this.user.roles.includes(role);
  }

  userManagesProfile(profileId: number): boolean {
    return (
      this.userHasRole(this.ROLE_FULL_ADMIN) ||
      (this.userHasRole(this.ROLE_PROFILE_ADMIN) &&
        this.user.managedProfiles.includes(profileId))
    );
  }
}
