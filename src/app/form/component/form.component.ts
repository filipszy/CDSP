import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {User} from '../../model/user';
import {UsersService} from '../service/users.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private requestForm: any;
  private wantedCharacters: string[];
  private wantedSettings: IDropdownSettings;
  private requestorSettings: IDropdownSettings;
  private users: User[];

  constructor(private formBuilder: FormBuilder, private usersService: UsersService) {
    this.wantedCharacters = [];
    this.wantedCharactersOption();

  }

  ngOnInit() {
    this.getUsers();
    this.createRequestForm();
    this.dropdownSettings();
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
    this.usersService.getUsers().subscribe(response => this.users = response);
  }

  private createRequestForm() {
    this.requestForm = this.formBuilder.group({
      requestName: ['', [Validators.required, Validators.maxLength(255)]],
      requestor: ['', [Validators.required]],
      goodEnding: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(255)]],
      needStoryteller: ['', [Validators.required]],
      storyteller: ['', [Validators.required]],
      wantedCharacters: [''],
      deadline: [''],
      budget: ['', [Validators.required, Validators.min(250000)]],
      status: ['']
    });
  }

  private wantedCharactersOption() {
    for (let i = 1; i <= 100; i++ ) {
      this.wantedCharacters.push('Option' + i);
    }
  }
}
