import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { AccountingService } from 'app/services/accounting.service';
import { BudgetGroup, Profile } from 'app/schema';
import { Router } from '@angular/router';
import { ChartBigbangData, ChartBigbangDataRow } from 'app/shared/charts/chart-bigbang/chart-bigbang.component';

@Component({
  selector: 'profile-expenditures-widget',
  templateUrl: './profile-expenditures-widget.component.html',
  styleUrls: ['./profile-expenditures-widget.component.scss']
})
export class ProfileExpendituresWidgetComponent implements OnChanges {

  @Input() profileId: number;
  @Input() year: number;

  @Output() openGroup = new EventEmitter<string>();

  chartData: ChartBigbangData | null;

  constructor(private dataService: DataService, private accountingService: AccountingService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.profileId && this.year) this.loadData(this.profileId, this.year);
    else this.chartData = null;
  }

  async loadData(profileId: number, year: number) {

    this.chartData = (await this.accountingService.getGroups(profileId, "exp", this.year))
      .map(group => ({
        id: group.id,
        innerAmount: group.amount,
        outerAmount: group.budgetAmount
      } as ChartBigbangDataRow));

  }
}
