import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { FoodItem } from '../models/foodItem.model';

@Injectable({ providedIn: 'root' })
export class FoodDataService {
  private readonly http = inject(HttpClient);

  private actionUrl =
    environment.baseUrls.server + environment.baseUrls.apiUrl + 'foodItems/';

  getAllFood() {
    return this.http.get<FoodItem[]>(this.actionUrl);
  }

  getSingleFood(id: number) {
    return this.http.get<FoodItem>(this.actionUrl + id);
  }

  addFood(itemName: string) {
    return this.http.post<FoodItem>(this.actionUrl, { itemName });
  }

  updateFood(foodToUpdate: FoodItem) {
    return this.http.put<FoodItem>(
      this.actionUrl + foodToUpdate.id,
      foodToUpdate
    );
  }

  deleteFood(id: number) {
    return this.http.delete(this.actionUrl + id);
  }
}
