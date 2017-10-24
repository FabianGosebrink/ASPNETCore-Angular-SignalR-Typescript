import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FoodItem } from '../../models/foodItem.model';
import { CONFIGURATION } from '../../shared/app.constants';

@Injectable()
export class FoodDataService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: HttpClient) {

        this.actionUrl = CONFIGURATION.baseUrls.server +
            CONFIGURATION.baseUrls.apiUrl +
            'foodItems/';
    }

    public getAllFood = (): Observable<FoodItem[]> => {
        return this._http.get<FoodItem[]>(this.actionUrl)
            .catch(this.handleError);
    }


    public getSingleFood = (id: number): Observable<FoodItem> => {
        return this._http.get<FoodItem[]>(this.actionUrl + id)
            .catch(this.handleError);
    }

    public addFood = (foodName: string): Observable<FoodItem> => {
        const toAdd: string = JSON.stringify({ ItemName: foodName });

        return this._http.post(this.actionUrl, toAdd)
            .catch(this.handleError);
    }

    public updateFood = (id: number, foodToUpdate: FoodItem): Observable<FoodItem> => {
        return this._http.put<FoodItem>(this.actionUrl + id, JSON.stringify(foodToUpdate))
            .catch(this.handleError);
    }

    public deleteFood = (id: number): Observable<Object> => {
        return this._http.delete(this.actionUrl + id)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }
}

@Injectable()
export class MyFirstInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(JSON.stringify(req));

        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return next.handle(req);
    }
}
