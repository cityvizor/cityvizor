import { Routes } from "@angular/router";

export const CounterPartyRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./counterparty.component").then(m => m.CounterpartyComponent),
    children: [
      {
        path: "obce",
        loadComponent: () =>
          import(
            "./views/counterparty-profiles/counterparty-profiles.component"
          ).then(m => m.CounterpartyProfilesComponent),
      },
      {
        path: "faktury",
        loadComponent: () =>
          import(
            "./views/counterparty-payments/counterparty-payments.component"
          ).then(m => m.CounterpartyPaymentsComponent),
      },
      {
        path: "prehled",
        loadComponent: () =>
          import(
            "./views/counterparty-dashboard/counterparty-dashboard.component"
          ).then(m => m.CounterpartyDashboardComponent),
      },
      { path: "", redirectTo: "prehled", pathMatch: "full" },
      { path: "**", pathMatch: "full", redirectTo: "/not-found" },
    ],
  },
];
