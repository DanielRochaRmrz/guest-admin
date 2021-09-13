import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminUsersGuestPage } from '../admin-users-guest/admin-users-guest';
import { AdminUserUserPage } from '../admin-user-user/admin-user-user';
import { AdminHomePage } from '../admin-home/admin-home';

@IonicPage()
@Component({
  selector: 'page-admin-users-list',
  templateUrl: 'admin-users-list.html',
})
export class AdminUsersListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminUsersListPage');
  }
  
  goEmpleados(usuario){
    console.log('aqui el tipo de usuario', usuario);
    this.navCtrl.push(AdminUsersGuestPage, {usuario:usuario});
  }
  goUsers(){
    this.navCtrl.push(AdminUserUserPage);
  }

  behind(){
    this.navCtrl.setRoot(AdminHomePage);
  }
}
