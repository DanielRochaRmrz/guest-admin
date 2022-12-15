import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from "moment";
import { PaginationService } from '../../app/pagination.service';

@IonicPage()
@Component({
  selector: 'page-cuentas-historial-list',
  templateUrl: 'cuentas-historial-list.html',
})
export class CuentasHistorialListPage {

  public fechaI: any;
  public fechaF: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PaginationService, private modalctrl: ModalController, private viewCtrl: ViewController,) {

    this.fechaI = this.navParams.get("fechaI");
    this.fechaF = this.navParams.get("fechaF");

  }

  ionViewDidLoad() {

    const fechaI = moment(this.fechaI).format("x");
    const fechaF = moment(this.fechaF).format("x");

    this.page.initHistorialConsumos('reservaciones', 'fechaR_', { reverse: true, prepend: false }, fechaI, fechaF);

  }

  scrollHandler(e) {

    if (e === 'bottom') {

      console.log(e);

      const fechaI = moment(this.fechaI).format("x");
      const fechaF = moment(this.fechaF).format("x");

      this.page.moreHistorialConsumos(fechaI, fechaF);
    }
  }

  cerrar_modal() {
    this.viewCtrl.dismiss();
  }

}
