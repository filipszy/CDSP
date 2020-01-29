import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chevron'
})
export class ChevronPipe implements PipeTransform {

  transform(key?: string, direct?: string, selected?: string): any {
    if (key && selected && key === selected) {
      if (direct === 'asc') {
        return `⌃`;
      } else if (direct === 'desc') {
        return '⌄';
      }
    }
    return '';
  }

}
