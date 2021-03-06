import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../service/request.service';
import {Request} from '../../model/request';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {SortParams} from '../../model/sort-params';
import {Router} from '@angular/router';
import {UsersService} from '../../service/users.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private requests: Request[];
  private numberRequests: number;
  private page: number;
  private pageChanged = new Subject<number>();
  private pages: number;
  private limitRequests: number;
  private searchText: string;
  private searchSub = new Subject<string>();
  private sortParams: SortParams;
  private users: User[];

  constructor(private requestService: RequestService, private router: Router, private usersService: UsersService) {
    this.sortParams = {key: '', order: ''};
    this.limitRequests = 10;
    this.pageChanged.pipe(
      debounceTime(300)
    ).subscribe(ev => {
      this.page = ev;
      this.getRequestsPagination(this.page);
    });

    this.searchSub.pipe(
      debounceTime(300)
    ).subscribe(ev => {
      this.requestService.searchLimitedRequests(this.page, this.limitRequests, ev).subscribe(response => {
        this.requests = response;
      });
    });
  }

  ngOnInit() {
    this.page = 1;
    this.getUsers();
    this.getRequestsPagination(this.page);
    this.loadData();
  }

  private getUsers() {
    this.usersService.getUsers().subscribe(response => this.users = response);
  }

  private requestor(id: number) {
    const user = this.users.filter( f => {
      return f.Id === id;
    })[0];

    return user.DisplayName;
  }

  private navigate(id: number) {
    this.router.navigate([`/form/${id}`]);
  }

  private sortData(key: string, order?: string) {
    if (!order) {
      this.sortParams.order = (this.sortParams.order === 'asc') ? 'desc' : 'asc';
    }
    this.sortParams.key = key;
    this.getSortRequests(this.sortParams);
  }

  private getSortRequests(params: SortParams) {
    this.requestService.sortLimitedRequests(this.page, this.limitRequests, params.key, params.order).subscribe(res => {
      this.requests = res;
    });
  }

  private search(search: string) {
    this.searchSub.next(search);
  }

  private changePage($event) {
    this.pageChanged.next($event);
  }

  private loadData() {
    this.requestService.getAllRequests().subscribe(req => {
      this.numberRequests = req.length;
      this.pages = Math.ceil(this.numberRequests / this.limitRequests);
    });
  }

  private getRequestsPagination(page: number) {
    this.requestService.getLimitedRequests(page, this.limitRequests).subscribe(response => {
      this.requests = response;
    });
  }
}
