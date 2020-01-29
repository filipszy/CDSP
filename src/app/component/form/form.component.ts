import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {User} from '../../model/user';
import {UsersService} from '../../service/users.service';
import {Subscription} from '../../model/subscription';
import {ECalendarValue, IDatePickerConfig} from 'ng2-date-picker';
import {Request} from '../../model/request';
import {Status} from '../../model/status.enum';
import {RequestService} from '../../service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormConfig} from './form.config';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {Moment} from 'moment';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  private requestForm: any;
  private wantedCharacters: string[];
  private users: User[];
  private subscription: Subscription[];
  private id: number;
  private selectedRequest: Request;
  private tmpData;
  private moment: Moment;
  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
              private requestService: RequestService,
              private route: ActivatedRoute,
              private router: Router,
              private formConfig: FormConfig) {
    this.subscription = [];
    this.wantedCharacters = [];
    this.wantedCharactersOption();
    this.id = null;
  }

  ngOnInit() {
    this.getUsers();
    this.createRequestForm();
    this.subscription.push({
      name: 'params', func: this.route.paramMap.subscribe(paramMap => {
        this.id = paramMap.get('id') as unknown as number;
        if (this.id) {
          this.getSelectedRequest(this.id);
        }
      })
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(item => {
      // @ts-ignore
      item.func.unsubscribe();
    });
  }

  private getSelectedRequest(id: number) {
    this.requestService.getRequestById(id).subscribe(req => {
      this.selectedRequest = req[0];
      this.setFormValues(req[0]);
    });
  }

  private setRequestor(id: number) {
    const user = this.users.filter( f => {
      return f.Id === id;
    })[0];

    return [{Id: user.Id, DisplayName: user.DisplayName}];
  }

  private getUsers() {
    this.subscription.push({name: 'users', func: this.usersService.getUsers().subscribe(response => this.users = response)});
  }

  private setFormValues(request: Request) {
      this.requestForm.setValue({
        RequestName: request.RequestName || '',
        Requestor: null,
        GoodEnding: request.GoodEnding || '',
        Description: request.Description || '',
        NeedStoryteller: request.NeedStoryteller.toString() || '',
        Storyteller: request.Storyteller.toString() || '',
        WantedCharacters: null,
        Deadline: null/*request.Deadline*/,
        Budget: request.Budget || '',
        Status: request.Status
      });

      this.requestForm.patchValue({
        Requestor: this.setRequestor(request.Requestor)
      });

      const time = moment(request.Deadline, 'x').format('DD-MM-YYYY');

      this.requestForm.patchValue({
        Deadline: time
      });
  }

  private createRequestForm(request?: any) {
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
    if ((control.value && control.value.length > 0) || (control.parent && control.parent.controls.NeedStoryteller.value === 'false')) {
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
    for (let i = 1; i <= 100; i++) {
      this.wantedCharacters.push('Option' + i);
    }
  }

  private dataToSave(id: number, status: Status): Request {
    const idGen: number = (id || this.randomId(2000, 50000));
    const dataToSave: Request = {
      Id: idGen,
      id: idGen,
      RequestName: this.requestForm.value.RequestName,
      Requestor: this.requestForm.value.Requestor ? this.requestForm.value.Requestor[0].Id : this.requestForm.value.Requestor,
      GoodEnding: this.requestForm.value.GoodEnding,
      Description: this.requestForm.value.Description,
      NeedStoryteller: this.requestForm.value.NeedStoryteller,
      Storyteller: this.requestForm.value.Storyteller,
      WantedCharacters: this.requestForm.value.WantedCharacters,
      Deadline: this.requestForm.value.Deadline ? moment(this.requestForm.value.Deadline, 'DD-MM-YYYY').format('x') : this.requestForm.value.Deadline,
      Budget: this.requestForm.value.Budget,
      Status: status
    };

    return dataToSave;
  }

  private updateRequest(data) {
    this.subscription.push({
      name: 'update', func: this.requestService.updateRequest(data).subscribe(r => {
        alert('Request updated!');
        this.router.navigate(['/dashboard']);
      })
    });
  }

  private saveAsDraft() {
    const data: Request = this.dataToSave(this.id, Status.Draft);

    if (this.id) {
      this.updateRequest(data);
    } else {
      this.subscription.push({
        name: 'draft', func: this.requestService.saveRequest(data).subscribe(r => {
          alert('New draft request save!');
          this.router.navigate(['/dashboard']);
        })
      });
    }
  }

  private submit() {
    this.markFormGroupTouched(this.requestForm);
    if (this.requestForm.dirty && this.requestForm.valid) {
      const data: Request = this.dataToSave(this.id, Status.New);

      if (this.id) {
        this.updateRequest(data);
      } else {
        this.subscription.push({
          name: 'submit', func: this.requestService.saveRequest(data).subscribe(r => {
            alert('New request save!');
            this.router.navigate(['/dashboard']);
          })
        });
      }
    }
  }

  private randomId(min, max) {
    min = parseInt(min, 10);
    max = parseInt(max, 10);

    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
