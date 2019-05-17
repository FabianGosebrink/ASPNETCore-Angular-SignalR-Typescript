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
    this.form.patchValue({ foodName: foodItem.itemName, id: foodItem.id });
  }
}
