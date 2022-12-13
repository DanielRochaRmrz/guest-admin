import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AdminHomePage } from '../admin-home/admin-home';
import { CorteDetalleReservacionPage } from '../corte-detalle-reservacion/corte-detalle-reservacion';
import { CuentasPage } from '../cuentas/cuentas';

@IonicPage()
@Component({
  selector: 'page-cuentas-list',
  templateUrl: 'cuentas-list.html',
})
export class CuentasListPage {

  sucursal: any;
  public consumos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _providerCorte: ReservacionProvider, private modalctrl: ModalController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CuentasListPage');

    this.getConsumosList();
  }

  goConsumo() {

    var obj = [{ uid: this.sucursal }];
    this.navCtrl.push(CuentasPage, { uidSucursal: this.sucursal });
  }

  async getConsumosList() {

    let consumos = await this._providerCorte.getHistorialConsumos();

    this.consumos = consumos;
  }

  goDetalle(idCorte) {

    let modal = this.modalctrl.create(CorteDetalleReservacionPage, { idCorte: idCorte, tabla:"consumos", campo:"idConsumo"});
    modal.present();

  }

  behind() {
    this.navCtrl.setRoot(AdminHomePage);
  }


}
