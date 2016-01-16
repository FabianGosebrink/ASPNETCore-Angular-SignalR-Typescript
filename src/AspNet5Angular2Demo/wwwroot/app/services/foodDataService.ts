import { Injectable } from 'angular2/core';
import {Http, Response} from 'angular2/http';
import 'rxjs/add/operator/map'

@Injectable()
export class DataService {
    
    private actionUrl: string;
    
    constructor(private _http: Http) {
        this.actionUrl = 'http://localhost:5000/api/foodItems/';
    }

    GetAllFood(): Observable<Response> {
        return this._http.get(this.actionUrl).map(res => res.json());
    }
    
    GetSingleFood(id: number): Observable<Response> {
        return this._http.get(this.actionUrl + id).map(res => res.json());
    }

    AddFood(FoodToAdd: any): Observable<Response> {
        return this._http.post(this.actionUrl, FoodToAdd).map(res => res.json());
    }

    Update(id: number, foodToUpdate: any): Observable<Response> {
        return this._http.post(this.actionUrl + id, foodToUpdate).map(res => res.json());
    }

    DeleteFood(id: number): Observable<Response> {
        return this._http.delete(this.actionUrl + id);
    }
}
