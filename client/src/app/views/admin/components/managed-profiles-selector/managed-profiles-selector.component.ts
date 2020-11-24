import { Component, OnInit, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AdminService } from 'app/services/admin.service';
import { Profile } from 'app/schema';

@Component({
  selector: 'managed-profiles-selector',
  templateUrl: './managed-profiles-selector.component.html',
  styleUrls: ['./managed-profiles-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManagedProfilesSelectorComponent),
      multi: true
    }
  ]
})
export class ManagedProfilesSelectorComponent implements OnInit, ControlValueAccessor {

  managedProfiles: number[]

  profiles: Profile[];

  constructor(
    private adminService: AdminService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProfiles();
  }

  onChange: any = () => { };
  onTouch: any = () => { };

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouch = fn; }

  writeValue(managedProfiles: number[]) {
    this.managedProfiles = managedProfiles;
  }

  addProfile(profileId: number) {
    if (!this.hasProfile(profileId)) this.managedProfiles.push(profileId);
    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
  }

  removeProfile(profileId: number) {
    const i = this.managedProfiles.indexOf(profileId);
    if (i !== -1) this.managedProfiles.splice(i, 1);
    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
  }

  async loadProfiles() {
    this.profiles = await this.adminService.getProfiles();
    this.profiles.sort((a,b) => (Number(this.hasProfile(b.id)) - Number(this.hasProfile(a.id))) || (a.name.localeCompare(b.name)));
  }

  hasProfile(profileId: number): boolean {
    return this.managedProfiles.indexOf(profileId) !== -1;
  }

}
