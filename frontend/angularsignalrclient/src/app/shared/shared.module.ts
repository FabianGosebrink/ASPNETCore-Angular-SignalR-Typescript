import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterModule } from '@angular/router';

@NgModule({
  exports: [NavigationComponent],
  declarations: [NavigationComponent],
  imports: [CommonModule, RouterModule]
})
export class SharedModule {}
