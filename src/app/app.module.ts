import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './component/daschboard/dashboard.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChevronPipe } from './pipe/chevron.pipe';
import {RouterModule, Routes} from '@angular/router';
import { FormComponent } from './component/form/form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ControlMesagesComponent } from './utils/control-mesages/control-mesages.component';
import {DpDatePickerModule} from 'ng2-date-picker';

export function translateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'form', component: FormComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    ChevronPipe,
    FormComponent,
    ControlMesagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoader,
        deps: [HttpClient]
      }
    }),
    NgMultiSelectDropDownModule.forRoot(),
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ChevronPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
