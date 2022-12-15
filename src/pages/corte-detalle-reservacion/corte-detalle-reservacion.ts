import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { CorteReservacionesHistorialPage } from '../corte-reservaciones-historial/corte-reservaciones-historial';

@IonicPage()
@Component({
  selector: 'page-corte-detalle-reservacion',
  templateUrl: 'corte-detalle-reservacion.html',
})
export class CorteDetalleReservacionPage {

  public idCorte: any;
  public corte: any;
  public tabla: any;
  public campo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _providerCorte: ReservacionProvider, private viewCtrl: ViewController, private modalctrl: ModalController,) {

    this.idCorte = this.navParams.get("idCorte");   
    this.tabla = this.navParams.get("tabla");
    this.campo = this.navParams.get("campo");
    
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CorteDetalleReservacionPage');
    this.getDetalleCorte();
  }
  
  async getDetalleCorte(){
  
    this.corte = await this._providerCorte.getDetalleCorte(this.idCorte, this.tabla, this.campo);
    console.log("this.corte", this.corte.subTotal);
    
  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

  goHistorial(idSucursal: any, fechaI:any, fechaF:any, nombreSucursal:any){

    // let modal = this.modalctrl.create(AdminHistorialReservacionesPage, {pageCorte: true});
    // modal.present();

    let modal = this.modalctrl.create(CorteReservacionesHistorialPage, {idSucursal: idSucursal, fechaI: fechaI, fechaF:fechaF, nombreSucursal:nombreSucursal});

    modal.present();
    // this.navCtrl.push(CorteReservacionesHistorialPage, {idSucursal: idSucursal, fechaI: fechaI, fechaF:fechaF, nombreSucursal:nombreSucursal});

    // this.navCtrl.push(AdminHistorialReservacionesPage);
    
  }
}
