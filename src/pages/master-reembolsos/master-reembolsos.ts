import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { ReembolsosPage } from '../reembolsos/reembolsos';


@IonicPage()
@Component({
  selector: 'page-master-reembolsos',
  templateUrl: 'master-reembolsos.html',
})
export class MasterReembolsosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,  public page: PaginationService, private modalctrl: ModalController,) {

    this.page.reset();

  }

  ionViewDidLoad() {

    this.page.initReservacionesReembolsar('reservaciones', 'fechaR', { reverse: true, prepend: false });
    
  }

  goHistorialReembolsados() {

    // let modal = this.modalctrl.create(ReembolsosPage);
    // modal.present();
    this.navCtrl.push(ReembolsosPage);

  }

  goDetalleReserva(idx){

    const reem = "Reembolso"

    let modal = this.modalctrl.create(AdminReservacionDetallePage, {idReservacion: idx, reem: reem});
    modal.present();

  }

  scrollHandler(e) {

    console.log(e);

    if (e === 'bottom') {
      this.page.moreReservacionesReembolsar();
    }
  }
}
