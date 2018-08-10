import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FoodItem } from '../../models/foodItem.model';
import { CONFIGURATION } from '../../shared/app.constants';

@Injectable()
export class FoodDataService {
  private actionUrl: string;

  constructor(private http: HttpClient) {
    this.actionUrl =
      CONFIGURATION.baseUrls.server +
      CONFIGURATION.baseUrls.apiUrl +
      'foodItems/';
  }

  public getAllFood(): Observable<FoodItem[]> {
    return this.http
      .get<FoodItem[]>(this.actionUrl)
      .pipe(catchError(this.handleError));
  }

  public getSingleFood(id: number): Observable<FoodItem> {
    return this.http
      .get<FoodItem>(this.actionUrl + id)
      .pipe(catchError(this.handleError));
  }

  public addFood(foodName: string): Observable<FoodItem> {
    const toAdd: string = JSON.stringify({ ItemName: foodName });

    return this.http
      .post<FoodItem>(this.actionUrl, toAdd)
      .pipe(catchError(this.handleError));
  }

  public updateFood(id: number, foodToUpdate: FoodItem): Observable<FoodItem> {
    return this.http
      .put<FoodItem>(this.actionUrl + id, JSON.stringify(foodToUpdate))
      .pipe(catchError(this.handleError));
  }

  public deleteFood(id: number): Observable<Object> {
    return this.http
      .delete(this.actionUrl + id)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    return throwError(error || 'Server error');
  }
}

@Injectable()
export class MyFirstInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req);
  }
}
