import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// Import Modules
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";

// Charts
import { ChartBigbangComponent } from "./charts/chart-bigbang/chart-bigbang.component";
import { ChartDonutComponent } from "./charts/chart-donut/chart-donut.component";
import { ChartBudgetComponent } from "./charts/chart-budget/chart-budget.component";
import { ChartEventOverviewComponent } from "./charts/chart-event-overview/chart-event-overview.component";
import { ChartHistoryComponent } from "./charts/chart-history/chart-history.component";

// Components
import { EventDetailComponent } from "./components/event-detail/event-detail.component";
import { EventDetailModalComponent } from "./components/event-detail-modal/event-detail-modal.component";
import { CounterpartyDetailComponent } from "./components/counterparty-detail/counterparty-detail.component";
import { CounterpartyDetailModalComponent } from "./components/counterparty-detail-modal/counterparty-detail-modal.component";
import { HelpModalComponent } from "./components/help-modal/help-modal.component";
import { WordCloudComponent } from "./components/word-cloud/word-cloud.component";
import { HeaderMenuComponent } from "app/shared/components/header-menu/header-menu.component";
import { ProfileExpendituresWidgetComponent } from "./widgets/profile-expenditures-widget/profile-expenditures-widget.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";

// Pipes
import { MoneyPipe } from "./pipes/money.pipe";
import { AddressPipe, PostalCodePipe } from "./pipes/address.pipe";
import {
  IcoPipe,
  AbsPipe,
  ConcatPipe,
  ArrayChildrenPipe,
  ArrayPipe,
} from "./pipes/utils.pipe";
import { Gps2stringPipe } from "./pipes/gps2string.pipe";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TranslateModule,
  ],
  declarations: [
    /* Charts */
    ChartBigbangComponent,
    ChartDonutComponent,
    ChartBudgetComponent,
    ChartEventOverviewComponent,
    /* Components */
    EventDetailComponent,
    EventDetailModalComponent,
    CounterpartyDetailComponent,
    CounterpartyDetailModalComponent,
    HelpModalComponent,
    ChartHistoryComponent,
    WordCloudComponent,
    HeaderMenuComponent,
    DatePickerComponent,
    /* Widgets */
    ProfileExpendituresWidgetComponent,
    /* Pipes */
    MoneyPipe,
    IcoPipe,
    AbsPipe,
    ConcatPipe,
    ArrayChildrenPipe,
    AddressPipe,
    PostalCodePipe,
    ArrayPipe,
    Gps2stringPipe,
  ],
  exports: [
    /* Angular */
    DropdownModule,
    FormsModule,
    /* Bootstrap */
    ButtonsModule,
    CollapseModule,
    BsDropdownModule,
    TabsModule,
    ModalModule,
    /* Charts */
    ChartBigbangComponent,
    ChartDonutComponent,
    ChartBudgetComponent,
    ChartEventOverviewComponent,
    /* PrimeNG */
    TableModule,
    /* Components */
    EventDetailComponent,
    EventDetailModalComponent,
    HelpModalComponent,
    ChartHistoryComponent,
    WordCloudComponent,
    HeaderMenuComponent,
    DatePickerComponent,
    /* Widgets */
    ProfileExpendituresWidgetComponent,
    /* Pipes */
    MoneyPipe,
    IcoPipe,
    AbsPipe,
    ConcatPipe,
    ArrayChildrenPipe,
    AddressPipe,
    PostalCodePipe,
    ArrayPipe,
    Gps2stringPipe,
    /* ngx-translate */
    TranslateModule,
  ],
})
export class SharedModule {}
