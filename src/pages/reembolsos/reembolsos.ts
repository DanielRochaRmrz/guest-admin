import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { MasterReembolsosPage } from '../master-reembolsos/master-reembolsos';

@IonicPage()
@Component({
  selector: 'page-reembolsos',
  templateUrl: 'reembolsos.html',
})
export class ReembolsosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public page: PaginationService,) {

    this.page.reset();

  }

  ionViewDidLoad() {

    this.page.initReservacionesReembolsados('reservaciones', 'fechaR', { reverse: true, prepend: false });
    
  }

  // cerrar_modal() {
  //   this.viewCtrl.dismiss();
  // }

  goAtras(){

    this.navCtrl.setRoot(MasterReembolsosPage);

  }

  scrollHandler(e) {

    if (e === 'bottom') {

      console.log(e);      

      this.page.moreReservacionesReembolsado()
    }
  }

}
