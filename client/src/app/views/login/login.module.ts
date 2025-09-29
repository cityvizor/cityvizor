import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared/shared.module";
import { LoginComponent } from "./login.component";

@NgModule({
    imports: [CommonModule, RouterModule, SharedModule, LoginComponent],
})
export class LoginModule {}
