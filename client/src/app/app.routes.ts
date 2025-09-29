import { Routes } from "@angular/router";
import { ACLService } from "./services/acl.service";

export const AppRoutes: Routes = [
  /* FRONT PAGE */
  { path: "login", loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent) },

  /* NOT FOUND */
  { path: "not-found", loadComponent: () => import('./views/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent) },

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
