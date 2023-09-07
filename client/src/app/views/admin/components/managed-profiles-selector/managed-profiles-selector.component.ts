import { Component, OnInit, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AdminService } from 'app/services/admin.service';
import { Profile } from 'app/schema';

interface ProfileSelectionModel {
  profile: Profile;
  children: Profile[];
  isManaged: boolean;
  isAnyChildrenManaged: boolean;
}

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
  selectionModels: ProfileSelectionModel[];

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
    if (!this.userManagesProfile(profileId)) this.managedProfiles.push(profileId);
    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
    this.updateSelectionModels();
  }

  removeProfile(profileId: number) {
    const i = this.managedProfiles.indexOf(profileId);
    if (i !== -1) this.managedProfiles.splice(i, 1);
    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
    this.updateSelectionModels();
  }

  addChildren(model: ProfileSelectionModel) {
    model.children.forEach(child => {
      if (!this.userManagesProfile(child.id)) {
        this.managedProfiles.push(child.id);
      }
    });

    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
    this.updateSelectionModels();
  }

  removeChildren(model: ProfileSelectionModel) {
    model.children.forEach(child => {
      const i = this.managedProfiles.indexOf(child.id);

      if (i !== -1) {
        this.managedProfiles.splice(i, 1);
      }
    });

    this.onChange(this.managedProfiles);
    this.cdRef.markForCheck();
    this.updateSelectionModels();
  }

  async loadProfiles() {
    this.profiles = await this.adminService.getProfiles();
    this.profiles.sort((a, b) => (Number(this.userManagesProfile(b.id)) - Number(this.userManagesProfile(a.id))) || (a.name.localeCompare(b.name)));
    this.updateSelectionModels();
  }

  userManagesProfile(profileId: number): boolean {
    return this.managedProfiles.indexOf(profileId) !== -1;
  }

  private updateSelectionModels() {
    this.selectionModels = this.profiles.map(profile => {
      const isManaged = this.userManagesProfile(profile.id);
      const children = this.profiles.filter(otherProfile => otherProfile.parent === profile.id);
      const isAnyChildrenManaged = children.some(child => this.userManagesProfile(child.id))

      return { profile, children, isManaged, isAnyChildrenManaged };
    });

    console.log(this.selectionModels);
  }
}
