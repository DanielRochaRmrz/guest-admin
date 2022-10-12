import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdminHomePage } from '../admin-home/admin-home';
import { ChecklistPage } from '../checklist/checklist';

@IonicPage()
@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html',
})
export class ToolsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToolsPage');
  }

  goToChecklist() {
    this.navCtrl.setRoot(ChecklistPage);
  }

  toBack() {
    this.navCtrl.setRoot(AdminHomePage);
  }

}
