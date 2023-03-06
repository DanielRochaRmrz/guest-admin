import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';


@IonicPage()
@Component({
  selector: 'page-master-ver-reservaciones',
  templateUrl: 'master-ver-reservaciones.html',
})
export class MasterVerReservacionesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PaginationService) {

    this.page.reset();
  }

  ionViewDidLoad() {

    this.page.initReservacionesGrals('reservaciones', 'fechaR', { reverse: true, prepend: false });
  }

  scrollHandler(e) {

    console.log(e);

    if (e === 'bottom') {
      this.page.moreReservacionesGrals();
    }
  }

  goDetalle(idReservacion) {

    const page = MasterVerReservacionesPage;

    this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion, page });

  }

  behind(){

    this.navCtrl.setRoot(AdminMenuReservacionPage);
  }

}
