import { Component, OnInit, Input, inject } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterLink } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { DataService } from "app/services/data.service";
import { ProfileService } from "app/services/profile.service";
import { Profile } from "app/schema";

import {
  BsDropdownDirective,
  BsDropdownToggleDirective,
  BsDropdownMenuDirective,
} from "ngx-bootstrap/dropdown";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "date-picker",
  templateUrl: "date-picker.component.html",
  styleUrls: ["date-picker.component.scss"],
  imports: [
    BsDropdownDirective,
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    RouterLink,
    TranslatePipe,
  ],
})
export class DatePickerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private profileService = inject(ProfileService);

  @Input()
  showEntireYear: boolean = true;

  monthNames: string[] = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];

  params: Observable<Params>;
  profile: Observable<Profile>;

  months: { [year: number]: number[] } = {};
  years: number[] = [];

  currentYear?: number;
  currentMonth?: number;

  async ngOnInit() {
    this.profile = this.profileService.profile;
    this.params = this.route.params;
    combineLatest(this.profile, this.params).subscribe(
      async ([profile, params]) => {
        if (!profile) return;
        this.currentYear = params["rok"] ? Number(params["rok"]) : undefined;
        this.currentMonth = params["mesic"]
          ? Number(params["mesic"])
          : undefined;
        await this.updateDates(profile.id);
      },
    );
  }

  selectYear(year: number): void {
    this.router.navigate(this.getMonthLink(year, 1), {
      relativeTo: this.route,
      replaceUrl: !this.currentYear || !this.currentMonth,
    });
  }
  selectMonth(year: number, month: number): void {
    this.router.navigate(this.getMonthLink(year, month), {
      relativeTo: this.route,
      replaceUrl: !this.currentYear || !this.currentMonth,
    });
  }

  getYearLink(year: number): any {
    return ["./", { rok: year }];
  }
  getMonthLink(year: number, month: number): any {
    return ["./", { rok: year, mesic: month }];
  }

  isMonthDisabled(year: number, month: number) {
    if (!this.months[year]) return true;
    if (this.months[year].indexOf(month) === -1) return true;
    return false;
  }

  async updateDates(profileId) {
    const months = await this.dataService.getProfilePaymentsMonths(profileId);
    this.months = {};

    months.forEach(month => {
      if (!month.month || !month.year) return;
      if (!this.months[month.year]) this.months[month.year] = [];
      this.months[month.year].push(month.month);
    });

    this.years = Object.keys(this.months).map(year => Number(year));
    this.years.sort((a, b) => b - a);

    if (!this.currentYear && this.years.length > 0) {
      this.selectMonth(this.years[0], Math.max(...this.months[this.years[0]]));
    }
  }
}
