import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {  

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }
              
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getFeedbacks(): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedback/')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  submitFeedback(feedback: Feedback): Observable<Feedback> {

    return this.http.post<Feedback>(baseURL + 'feedback/', feedback, this.httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }

}
