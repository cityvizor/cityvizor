class HeaderLink {
  text:string;
  link:any[]; // https://angular.io/api/router/Router
  icon?:string;
};

export class HeaderConfig {
  title:HeaderLink = {
    text: "",
    link: ["../"]
  };
  
  titleRight:HeaderLink = {
    text: "Zavřít",
    link: ["/"],
    icon: "fa fa-times"
  };

  menu: HeaderLink[] = [];
}