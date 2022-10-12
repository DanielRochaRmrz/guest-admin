import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicPageModule } from 'ionic-angular';
 
import { ChecklistNewPage } from './checklist-new';

@NgModule({
  declarations: [],
  imports: [
    IonicPageModule.forChild(ChecklistNewPage),
    ReactiveFormsModule
  ],
})
export class ChecklistNewPageModule {}
