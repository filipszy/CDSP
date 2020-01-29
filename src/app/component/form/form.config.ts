import {ECalendarValue, IDatePickerConfig} from 'ng2-date-picker';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FormConfig {
  public wantedSettings(): IDropdownSettings {
    return {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  public requestorSettings(): IDropdownSettings {
    return {
      singleSelection: true,
      idField: 'Id',
      textField: 'DisplayName',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  public configCalendar(): IDatePickerConfig {
    return {
      firstDayOfWeek: 'su',
      monthFormat: 'MMM, YYYY',
      disableKeypress: false,
      allowMultiSelect: false,
      closeOnSelect: undefined,
      closeOnSelectDelay: 100,
      openOnFocus: true,
      openOnClick: true,
      onOpenDelay: 0,
      weekDayFormat: 'ddd',
      appendTo: document.body,
      showNearMonthDays: true,
      showWeekNumbers: false,
      enableMonthSelector: true,
      yearFormat: 'YYYY',
      showGoToCurrent: true,
      dayBtnFormat: 'DD',
      monthBtnFormat: 'MMM',
      hours12Format: 'hh',
      hours24Format: 'HH',
      meridiemFormat: 'A',
      minutesFormat: 'mm',
      minutesInterval: 1,
      secondsFormat: 'ss',
      secondsInterval: 1,
      showSeconds: false,
      showTwentyFourHours: false,
      timeSeparator: ':',
      multipleYearsNavigateBy: 10,
      showMultipleYearsNavigation: false,
      hideInputContainer: false,
      returnedValueType: ECalendarValue.String,
      unSelectOnClick: true,
      hideOnOutsideClick: true
    };
  }
}
