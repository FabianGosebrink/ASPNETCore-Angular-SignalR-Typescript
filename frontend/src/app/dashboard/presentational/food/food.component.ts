import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodItem } from '../../../models/foodItem.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
})
export class FoodComponent {
  private readonly formbuilder = inject(FormBuilder);
  @Input() foodItems = [];
  @Input() connectionEstablished = false;

  @Output() foodSaved = new EventEmitter();
  @Output() foodDeleted = new EventEmitter<FoodItem>();

  form = this.formbuilder.group({
    id: null,
    itemName: ['', Validators.required],
  });

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
