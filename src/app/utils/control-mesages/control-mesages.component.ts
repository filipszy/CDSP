import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationService} from '../../service/validation.service';

@Component({
  selector: 'app-control-mesages',
  template: `<div *ngIf="errorMessage !== null" class="form-error">{{errorMessage}}</div>`,
})
export class ControlMesagesComponent {

  @Input() control: FormControl;
  constructor() {}

  get errorMessage(): string {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }

}
