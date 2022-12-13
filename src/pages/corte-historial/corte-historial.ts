import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdminHomePage } from '../admin-home/admin-home';
import { async } from 'rxjs/internal/scheduler/async';
import { CorteDetalleReservacionPage } from '../corte-detalle-reservacion/corte-detalle-reservacion';

@IonicPage()
@Component({
  selector: 'page-corte-historial',
  templateUrl: 'corte-historial.html',
})
export class CorteHistorialPage {
  corteHistorico: any;
  uid: any;
  idSucursal: any;
  admin: any;
  type: any = 'n';
  user: any;
  public cortesList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sucProv: SucursalAltaProvider, public _providerCorte: ReservacionProvider, public authProvider: AuthProvider, public firebase: AngularFireAuth, private modalctrl: ModalController,) {


    this.user = this.firebase.auth.currentUser;
    // console.log("Esta es User: ", this.user.uid);
    // console.log('ionViewDidLoad CorteHistorialPage');
    // console.log('itemHistorialCorte', this.sucProv.selectedSucursalItem);
    this.idSucursal = this.sucProv.selectedSucursalItem.uid;

    if (this.idSucursal == undefined) {

      this.idSucursal = localStorage.getItem("uid");

    }
    //  this.type=this.sucProv.selectedSucursalItem.type;
    // console.log('idSucursal CorteHistorico', this.idSucursal);


    //si es sucursal no tare nada
    this.authProvider.getUserAdmins(this.user.uid).subscribe(s => {
      console.log('s', s);
      if (s != null) {
        this.type = s.type;
        // console.log('admin', this.admin);
        // console.log('type', this.type);
      }


    });

    // this.getCortes(this.idSucursal);

    this.getCortesHistorial(this.idSucursal);
  }

  ionViewDidLoad() {


  }

  getCortes(idx) {
    console.log("funcion cortes: ", idx);
    this._providerCorte.getCortes(idx).subscribe(res => {
      console.log("Este es el resultado de corte historico: ", res);
      this.corteHistorico = res;
    });
  }

  async getCortesHistorial(id) {

    let cortes = await this._providerCorte.getHistorialCorteSucursal(id);

    this.cortesList = cortes;

    console.log("CORTES =>>", this.cortesList);

  }

  deleteCorte(id) {
    console.log('corte eliminado: ' + id);
    this._providerCorte.delete_corte(id);

  }

  behind() {
    this.navCtrl.setRoot(AdminHomePage);
  }

  goDetalle(idCorte) {

    let modal = this.modalctrl.create(CorteDetalleReservacionPage, { idCorte: idCorte, tabla:"cortes", campo:"idCorte"});
    modal.present();

  }


}
