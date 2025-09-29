import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnChanges,
} from "@angular/core";
import { BudgetGroup, Budget } from "app/schema";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from "ngx-bootstrap/dropdown";
import { NgIf, NgFor } from "@angular/common";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: "group-select",
    templateUrl: "./group-select.component.html",
    styleUrls: ["./group-select.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GroupSelectComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [
        BsDropdownDirective,
        BsDropdownToggleDirective,
        NgIf,
        BsDropdownMenuDirective,
        NgFor,
        MoneyPipe,
        TranslatePipe,
    ],
})
export class GroupSelectComponent implements OnChanges, ControlValueAccessor {
  @Input() groups: BudgetGroup[];

  @Input("hovered") hoveredGroupId: string | null;

  selectedGroup: BudgetGroup | null;

  onChange: any = () => {};
  onTouch: any = () => {};

  maxAmount: number;

  constructor() {}

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(group: BudgetGroup | null) {
    this.selectedGroup = group;
  }

  selectGroup(group: BudgetGroup) {
    this.selectedGroup = group;
    this.onTouch();
    this.onChange(group);
  }

  ngOnChanges() {
    this.updateMax();
  }

  updateMax() {
    if (!this.groups) return;
    this.maxAmount = this.groups.reduce(
      (acc, cur) => Math.max(acc, cur.amount, cur.budgetAmount),
      0
    );
  }
}
