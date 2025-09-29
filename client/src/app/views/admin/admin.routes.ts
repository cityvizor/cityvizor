import { Routes } from "@angular/router";

export const AdminRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: "profily/:profile",
        loadComponent: () => import('./views/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent),
        children: [
          { path: "data", loadComponent: () => import('./views/admin-profile/admin-profile-data/admin-profile-data.component').then(m => m.AdminProfileDataComponent) },
          { path: "api", loadComponent: () => import('./views/admin-profile/admin-profile-api/admin-profile-api.component').then(m => m.AdminProfileApiComponent) },
          { path: "logy", loadComponent: () => import('./views/admin-profile/admin-profile-logs/admin-profile-logs.component').then(m => m.AdminProfileLogsComponent) },
          { path: "nastaveni", loadComponent: () => import('./views/admin-profile/admin-profile-settings/admin-profile-settings.component').then(m => m.AdminProfileSettingsComponent) },
          { path: "podprofily", loadComponent: () => import('./views/admin-profile/admin-profile-subprofiles/admin-profile-subprofiles.component').then(m => m.AdminProfileSubprofilesComponent) },
          { path: "", redirectTo: "data", pathMatch: "full" },
          { path: "**", pathMatch: "full", redirectTo: "/not-found" },
        ],
      },
      { path: "profily", loadComponent: () => import('./views/admin-profile-list/admin-profile-list.component').then(m => m.AdminProfileListComponent) },

      { path: "spravci/:user", loadComponent: () => import('./views/admin-user/admin-user.component').then(m => m.AdminUserComponent) },
      { path: "spravci", loadComponent: () => import('./views/admin-user-list/admin-user-list.component').then(m => m.AdminUserListComponent) },

      { path: "", redirectTo: "profily", pathMatch: "full" },
      { path: "**", pathMatch: "full", redirectTo: "/not-found" },
    ],
  },
];
