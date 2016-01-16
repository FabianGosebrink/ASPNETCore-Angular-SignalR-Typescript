import { Injectable } from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';
import {IFoodItem} from '../models/IFoodItem';

@Injectable()
export class DataService {

    private actionUrl: string;
    private headers: string;

    constructor(private _http: Http) {
        this.actionUrl = 'http://localhost:5000/api/foodItems/';
    }

    GetAllFood(): Observable<Response> {
        return this._http.get(this.actionUrl).map(res => res.json());
    }

    GetSingleFood(id: number): Observable<Response> {
        return this._http.get(this.actionUrl + id).map(res => res.json());
    }

    AddFood(foodName: string): Observable<Response> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var toAdd = JSON.stringify({ ItemName: foodName });
        
        return this._http.post(this.actionUrl, toAdd, {
            headers: headers
        }).map(res => res.json());
            //.subscribe(data => {
            //    console.log(data)
            //}, err => console.log(err.json().message),
            //() => console.log('Authentication Complete'));
    }

    Update(id: number, foodToUpdate: any): Observable<Response> {
        return this._http.post(this.actionUrl + id, foodToUpdate).map(res => res.json());
    }

    DeleteFood(id: number): Observable<Response> {
        return this._http.delete(this.actionUrl + id);
    }
}
