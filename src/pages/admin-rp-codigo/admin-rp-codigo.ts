import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';

@IonicPage()
@Component({
  selector: 'page-admin-rp-codigo',
  templateUrl: 'admin-rp-codigo.html',
})
export class AdminRpCodigoPage {

  uidRp: any;
  codigos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore) {
  }

  ionViewDidLoad() {

    // console.log('ionViewDidLoad AdminRpCodigoPage');

    this.uidRp = this.navParams.get("uidRp");

    this.getCodigoRp(this.uidRp);

    // console.log(this.uidRp);
    
  }

  getCodigoRp(uidRP){

    this.afs.collection('users', ref => ref.where('uid', '==', uidRP)).valueChanges().subscribe(data =>{

      this.codigos = data;

      // console.log("RP", this.codigos);
      
    })

  }



}
