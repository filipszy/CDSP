import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {User} from '../../model/user';
import {UsersService} from '../../service/users.service';
import {Subscription} from '../../model/subscription';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  private requestForm: any;
  private wantedCharacters: string[];
  private wantedSettings: IDropdownSettings;
  private requestorSettings: IDropdownSettings;
  private users: User[];
  private subscription: Subscription[];

  constructor(private formBuilder: FormBuilder, private usersService: UsersService) {
    this.subscription = [];
    this.wantedCharacters = [];
    this.wantedCharactersOption();
  }

  ngOnInit() {
    this.getUsers();
    this.createRequestForm();
    this.dropdownSettings();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(item => {
      // @ts-ignore
      item.func.unsubscribe();
    });
  }

  private dropdownSettings() {
    this.wantedSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.requestorSettings = {
      singleSelection: true,
      idField: 'Id',
      textField: 'DisplayName',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  private getUsers() {
    this.subscription.push({name: 'users', func: this.usersService.getUsers().subscribe(response => this.users = response)});
  }

  private createRequestForm() {
    this.requestForm = this.formBuilder.group({
      RequestName: ['', [Validators.required, Validators.maxLength(255)]],
      Requestor: ['', [Validators.required]],
      GoodEnding: ['', [Validators.required]],
      Description: ['', [Validators.required, Validators.minLength(255)]],
      NeedStoryteller: ['', [Validators.required]],
      Storyteller: ['', [this.storytellerValidation]],
      WantedCharacters: [''],
      Deadline: [''],
      Budget: ['', [Validators.required, Validators.min(250000)]],
      Status: ['']
    });
  }

  private storytellerValidation(control: any) {
      if (control.value && control.value.length > 0 || (control.parent && control.parent.controls.NeedStoryteller.value === 'false')) {
        return null;
      } else {
        return {required: true};
      }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private wantedCharactersOption() {
    for (let i = 1; i <= 100; i++ ) {
      this.wantedCharacters.push('Option' + i);
    }
  }

  private saveAsDraft() {
    if (this.requestForm.dirty && this.requestForm.valid) {
      alert(
        `Name: ${this.requestForm.value.name} Email: ${this.requestForm.value.email}`
      );
    }
  }

  private submit() {
    this.markFormGroupTouched(this.requestForm);
    if (this.requestForm.dirty && this.requestForm.valid) {
      alert(
        `Name: ${this.requestForm.value.name} Email: ${this.requestForm.value.email}`
      );
    }
  }
}
