import { Routes } from "@angular/router";
import { ACLService } from "./services/acl.service";
import { LoginComponent } from "./views/login/login.component";
import { NotFoundPageComponent } from "./views/not-found-page/not-found-page.component";

export const AppRoutes: Routes = [
  /* FRONT PAGE */
  { path: "login", component: LoginComponent },

  /* NOT FOUND */
  { path: "not-found", component: NotFoundPageComponent },

  /* COUNTERPARTIES */
  {
    path: "dodavatele",
    loadChildren: () => import("./views/counterparty").then(mod => mod.CounterPartyRoutes),
  },

  /* ADMIN */
  {
    path: "admin",
    loadChildren: () => import("./views/admin").then(mod => mod.AdminRoutes),
    canActivate: [ACLService],
  },

  /* PROFILE */
  {
    path: ":profile",
    loadChildren: () => import("./views/profile").then(mod => mod.ProfileRoutes),
  },

  /* CATCH ALL */
  { path: "**", pathMatch: "full", redirectTo: "/not-found" },
];
