import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Request} from '../model/request';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient: HttpClient) { }

  public getAllRequests(): Observable<Request[]> {
    return this.httpClient.get('/api/Requests').pipe(
      map(response => response as Request[])
    );
  }

  public sortLimitedRequests(page: number, limit: number, key: string, sort: string): Observable<Request[]> {
    return this.httpClient.get(`/api/Requests?_page=${page}&_limit=${limit}&_sort=${key}&_order=${sort}`).pipe(
      map(response => response as Request[])
    );
  }

  public searchLimitedRequests(page: number, limit: number, search: string): Observable<Request[]> {
    return this.httpClient.get(`/api/Requests?q=${search}&_page=${page}&_limit=${limit}`).pipe(
      map(response => response as Request[])
    );
  }

  public getRequestById(id: number): Observable<Request> {
    return this.httpClient.get(`/api/Requests?Id=${id}`).pipe(
      map(response => response as Request)
    );
  }

  public getLimitedRequests(page: number, limit: number): Observable<Request[]> {
    return this.httpClient.get(`/api/Requests?_page=${page}&_limit=${limit}`).pipe(
      map(response => response as Request[])
    );
  }

  public saveRequest(request: Request): Observable<any> {
    return this.httpClient.post('/api/Requests', request);
  }

  public updateRequest(request: Request): Observable<any> {
    return this.httpClient.put('/api/Requests/' + request.Id, request);
  }
}
