import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodItem } from '@app/models/foodItem.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent {
  @Input() foodItems = [];
  @Input() connectionEstablished = false;

  @Output() foodSaved = new EventEmitter();
  @Output() foodDeleted = new EventEmitter();

  form: FormGroup;

  constructor(formbuilder: FormBuilder) {
    this.form = formbuilder.group({
      id: null,
      itemName: ['', Validators.required]
    });
  }

  saveFood() {
    this.foodSaved.emit(this.form.value);
    this.form.reset();
  }

  setFoodItemToEdit(foodItem: FoodItem) {
    const { itemName, id } = foodItem;
    this.form.patchValue({ itemName, id });
  }

  deleteFoodItem(foodItem: FoodItem) {
    this.foodDeleted.emit(foodItem);
  }
}
