import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { MasterReembolsosPage } from '../master-reembolsos/master-reembolsos';

@IonicPage()
@Component({
  selector: 'page-reembolsos',
  templateUrl: 'reembolsos.html',
})
export class ReembolsosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public page: PaginationService, private modalctrl: ModalController,) {

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

  goDetalleReserva(idx) {

    let modal = this.modalctrl.create(AdminReservacionDetallePage, { idReservacion: idx });
    modal.present();

  }

}
