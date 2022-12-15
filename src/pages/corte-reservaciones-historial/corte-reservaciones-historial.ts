import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from "moment";
import { PaginationService } from '../../app/pagination.service';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';


@IonicPage()
@Component({
  selector: 'page-corte-reservaciones-historial',
  templateUrl: 'corte-reservaciones-historial.html',
})
export class CorteReservacionesHistorialPage implements OnInit {

  public idSucursal: any;
  public fechaI: any;
  public fechaF: any;
  public nombreSucursal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PaginationService, private modalctrl: ModalController,private viewCtrl: ViewController,) {

    this.page.reset();

    this.idSucursal = this.navParams.get("idSucursal");
    this.fechaI = this.navParams.get("fechaI");
    this.fechaF = this.navParams.get("fechaF");
    this.nombreSucursal = this.navParams.get("nombreSucursal");

  }

  ngOnInit() {

    const fechaI = moment(this.fechaI).format("x");
    const fechaF = moment(this.fechaF).format("x");

    this.page.initHistorialCorte('reservaciones', 'fechaR_', { reverse: true, prepend: false }, this.idSucursal, fechaI, fechaF);

  }

  ionViewDidLoad() {

  }

  scrollHandler(e) {



    if (e === 'bottom') {

      console.log(e);

      const fechaI = moment(this.fechaI).format("x");
      const fechaF = moment(this.fechaF).format("x");

      this.page.moreHistorialCorte(this.idSucursal, fechaI, fechaF)
    }
  }

  goDetalle(idReservacion) {

    const typeUser = 'masterAdmon';

    let modal = this.modalctrl.create(AdminReservacionDetallePage, {idReservacion: idReservacion, typeUser: typeUser});
    modal.present();
    // this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion, typeUser: typeUser });

  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

}
