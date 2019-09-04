export const aclConfig = {

  routes: [
    {
      route: "/admin/:cat",
      allowRoles: ["admin"]
    },
    {
      route: "/admin",
      allowRoles: ["admin"]
    },
    {
      route: "/ucet",
      allowRoles: ["admin", "user"]
    },
    {
      route: "/:url/admin/:cat",
      allowRoles: ["admin"],
      //allowCheck: (user,params) => console.log(user,params)
      allowCheck: (user, params) => user.managedProfiles.indexOf(params.profile) !== -1
    },
    {
      route: "/:url/admin",
      allowRoles: ["admin"],
      //allowCheck: (user,params) => console.log(user,params)
      allowCheck: (user, params) => user.managedProfiles.indexOf(params.profile) !== -1
    }
  ],
  
  default: {
    allow: true
  }

}