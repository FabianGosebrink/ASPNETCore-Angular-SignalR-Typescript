import {Component, Input} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';

@Component({
    selector: 'food-list',
    templateUrl: 'app/food/foodList.component.html'
})
export class FoodList {
    @Input() foodItems: IFoodItem[];
}