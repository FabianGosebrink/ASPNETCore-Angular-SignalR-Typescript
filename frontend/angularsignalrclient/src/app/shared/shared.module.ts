import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  exports: [NavigationComponent],
  declarations: [NavigationComponent],
  imports: [CommonModule]
})
export class SharedModule {}
