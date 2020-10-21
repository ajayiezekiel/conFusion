import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';

import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders/');
    // return of(LEADERS).pipe(delay(2000));
  }

  getLeader(id: string): Observable<Leader> {
    // return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leaders/' + id);
  }

  getFeaturedLeader(): Observable<Leader> {
    // return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
      .pipe(map(leaders => leaders[0]));
  }
  
}
