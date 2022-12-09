import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';

@IonicPage()
@Component({
  selector: 'page-corte-detalle-reservacion',
  templateUrl: 'corte-detalle-reservacion.html',
})
export class CorteDetalleReservacionPage {

  public idCorte: any;
  public corte: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _providerCorte: ReservacionProvider) {

    this.idCorte = this.navParams.get("idCorte");   
    
    this.getDetalleCorte();
    
  }

  async getDetalleCorte(){

    this.corte = await this._providerCorte.getDetalleCorte(this.idCorte);
    console.log("this.corte", this.corte);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CorteDetalleReservacionPage');
  }

}
