import { Routes } from "@angular/router";

export const ProfileRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./profile.component").then(m => m.ProfileComponent),
    children: [
      {
        path: "prehled",
        loadComponent: () =>
          import("./views/profile-dashboard/profile-dashboard.component").then(
            m => m.ProfileDashboardComponent,
          ),
      },
      {
        path: "hospodareni/:type",
        loadComponent: () =>
          import(
            "./views/profile-accounting/profile-accounting.component"
          ).then(m => m.ProfileAccountingComponent),
      },
      {
        path: "faktury",
        loadComponent: () =>
          import("./views/profile-invoices/profile-invoices.component").then(
            m => m.ProfileInvoicesComponent,
          ),
      },
      {
        path: "uredni-deska",
        loadComponent: () =>
          import(
            "./views/profile-noticeboard/profile-noticeboard.component"
          ).then(m => m.ProfileNoticeboardComponent),
      },
      {
        path: "registr-smluv",
        loadComponent: () =>
          import("./views/profile-contracts/profile-contracts.component").then(
            m => m.ProfileContractsComponent,
          ),
      },
      {
        path: "dodavatele",
        loadComponent: () =>
          import(
            "./views/profile-counterparties/profile-counterparties.component"
          ).then(m => m.ProfileCounterpartiesComponent),
      },
      { path: "", redirectTo: "prehled", pathMatch: "full" },
      { path: "**", pathMatch: "full", redirectTo: "/not-found" },
    ],
  },
];
