import {Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges} from '@angular/core';
import { BudgetGroup, Budget } from 'app/schema';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'group-select',
  templateUrl: './group-select.component.html',
  styleUrls: ['./group-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GroupSelectComponent),
      multi: true
    }
  ]
})
export class GroupSelectComponent implements OnChanges, ControlValueAccessor {

  @Input() groups: BudgetGroup[];

  @Input("hovered") hoveredGroupId: string | null;

  selectedGroup: BudgetGroup | null;

  onChange: any = () => { };
  onTouch: any = () => { };

  maxAmount: number;

  constructor() { }

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouch = fn; }

  writeValue(group: BudgetGroup | null) {
    this.selectedGroup = group;
  }

  selectGroup(group: BudgetGroup) {
    this.selectedGroup = group;
    this.onTouch();
    this.onChange(group);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.groupsReceivedFirstTime(changes)) {
      this.selectedGroup = this.groups[0]
    }
    this.updateMax();
  }

  updateMax() {
    if (!this.groups) return;
    this.maxAmount = this.groups.reduce((acc, cur) => Math.max(acc, cur.amount, cur.budgetAmount), 0);
  }

  // If this is true, async pipe returned groups for first time
  groupsReceivedFirstTime(changes: SimpleChanges): boolean {
    if (!changes.groups || !changes.groups.previousValue) {
      return false
    }
    return (changes.groups.previousValue.length === 0 && changes.groups.currentValue.length !== 0 && !changes.groups.firstChange)
  }

}
