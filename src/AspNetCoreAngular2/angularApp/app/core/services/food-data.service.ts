import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FoodItem } from '../../models/foodItem.model';
import { CONFIGURATION } from '../../shared/app.constants';

@Injectable()
export class FoodDataService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {

        this.actionUrl = CONFIGURATION.baseUrls.server +
            CONFIGURATION.baseUrls.apiUrl +
            'foodItems/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public GetAllFood = (): Observable<FoodItem[]> => {
        return this._http.get(this.actionUrl)
            .map((response: Response) => <FoodItem[]>response.json())
            .catch(this.handleError);
    }


    public GetSingleFood = (id: number): Observable<FoodItem> => {
        return this._http.get(this.actionUrl + id)
            .map((response: Response) => <FoodItem>response.json())
            .catch(this.handleError);
    }

    public AddFood = (foodName: string): Observable<FoodItem> => {
        const toAdd: string = JSON.stringify({ ItemName: foodName });

        return this._http.post(this.actionUrl, toAdd, { headers: this.headers })
            .map((response: Response) => <FoodItem>response.json())
            .catch(this.handleError);
    }

    public Update = (id: number, foodToUpdate: FoodItem): Observable<FoodItem> => {
        return this._http.put(this.actionUrl + id, JSON.stringify(foodToUpdate), { headers: this.headers })
            .map((response: Response) => <FoodItem>response.json())
            .catch(this.handleError);
    }

    public DeleteFood = (id: number): Observable<Response> => {
        return this._http.delete(this.actionUrl + id)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }
}
