import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ChecklistPage } from '../checklist/checklist';

@IonicPage()
@Component({
  selector: 'page-checklist-new',
  templateUrl: 'checklist-new.html',
})
export class ChecklistNewPage {

  checklistForm: FormGroup = this.fb.group({
    'actividad': new FormControl('Escaleras Principales')
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChecklistNewPage');
  }

  toBack() {
    this.navCtrl.setRoot(ChecklistPage);
  }

}
