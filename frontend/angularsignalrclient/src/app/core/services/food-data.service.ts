import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FoodItem } from '../../models/foodItem.model';

@Injectable({ providedIn: 'root' })
export class FoodDataService {
  private actionUrl: string;

  constructor(private http: HttpClient) {
    this.actionUrl =
      environment.baseUrls.server + environment.baseUrls.apiUrl + 'foodItems/';
  }

  getAllFood() {
    return this.http
      .get<FoodItem[]>(this.actionUrl)
      .pipe(catchError(this.handleError));
  }

  getSingleFood(id: number) {
    return this.http
      .get<FoodItem>(this.actionUrl + id)
      .pipe(catchError(this.handleError));
  }

  addFood(itemName: string) {
    return this.http
      .post<FoodItem>(this.actionUrl, { itemName })
      .pipe(catchError(this.handleError));
  }

  updateFood(foodToUpdate: FoodItem) {
    return this.http
      .put<FoodItem>(this.actionUrl + foodToUpdate.id, foodToUpdate)
      .pipe(catchError(this.handleError));
  }

  deleteFood(id: number) {
    return this.http
      .delete(this.actionUrl + id)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    return throwError(error || 'Server error');
  }
}
