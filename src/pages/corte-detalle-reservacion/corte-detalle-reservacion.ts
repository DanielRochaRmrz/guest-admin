import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AdminHistorialReservacionesPage } from '../admin-historial-reservaciones/admin-historial-reservaciones';

@IonicPage()
@Component({
  selector: 'page-corte-detalle-reservacion',
  templateUrl: 'corte-detalle-reservacion.html',
})
export class CorteDetalleReservacionPage {

  public idCorte: any;
  public corte: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _providerCorte: ReservacionProvider, private viewCtrl: ViewController, private modalctrl: ModalController,) {

    this.idCorte = this.navParams.get("idCorte");   
    
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CorteDetalleReservacionPage');
    this.getDetalleCorte();
  }
  
  async getDetalleCorte(){
  
    this.corte = await this._providerCorte.getDetalleCorte(this.idCorte);
    console.log("this.corte", this.corte.subTotal);
    
  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

  goHistorial(){

    let modal = this.modalctrl.create(AdminHistorialReservacionesPage, {pageCorte: true});
    modal.present();

    // this.navCtrl.push(AdminHistorialReservacionesPage);
    
  }
}
