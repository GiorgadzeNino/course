import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorPickerRoutingModule } from './color-picker-routing.module';
import { ColorPickerComponent } from './color-picker.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [CommonModule, SharedModule, ColorPickerRoutingModule],
})
export class ColorPickerModule {}
