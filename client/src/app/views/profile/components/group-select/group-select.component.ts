import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges } from '@angular/core';
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

  @Input("hovered") hoveredGroup: BudgetGroup;

  selectedGroup: BudgetGroup;

  onChange: any = () => { };
  onTouch: any = () => { };

  maxAmount: number;

  constructor() { }

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouch = fn; }

  writeValue(group: BudgetGroup) {
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
    if(!this.groups) return;
    this.maxAmount = this.groups.reduce((acc, cur) => Math.max(acc, cur.amount, cur.budgetAmount), 0);
  }

}
