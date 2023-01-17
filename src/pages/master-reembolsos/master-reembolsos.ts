import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { ReembolsosProvider } from '../../providers/reembolsos/reembolsos';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { ReembolsosPage } from '../reembolsos/reembolsos';

@IonicPage()
@Component({
  selector: 'page-master-reembolsos',
  templateUrl: 'master-reembolsos.html',
})
export class MasterReembolsosPage {

  folio: string = 'R';
  reservaciones: any;
  folios: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PaginationService, private modalctrl: ModalController, public alerCtrl: AlertController, private proReem: ReembolsosProvider, ) {

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

  goDetalleReserva(idx, total) {

    const reem = "Reembolso"

    let modal = this.modalctrl.create(AdminReservacionDetallePage, { idReservacion: idx, reem: reem, totalReem: total });
    modal.present();

  }

  scrollHandler(e) {

    console.log(e);

    if (e === 'bottom') {
      this.page.moreReservacionesReembolsar();
    }
  }

  functionReembolsar(idPlayerUser, idReservacion, reembolsar) {

    let confirm = this.alerCtrl.create({
      title: '¿Vas a reembolsar esta reservación?',
      message: 'Cambiaras el estatus de la reservación a Reembolsado',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            // Actions
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            
            this.proReem.reembolsarReservacion(idPlayerUser, idReservacion);
            this.navCtrl.push(MasterReembolsosPage);
          }
        }
      ]
    });
    confirm.present()

  }
  behind(){

    this.navCtrl.setRoot(AdminMenuReservacionPage);

  }

  initializeItems(): void {
    
    this.reservaciones = this.page.data;
  }


  getItems(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.reservaciones = this.reservaciones.filter(reservacion => {
      if (reservacion.folio && searchTerm) {
        if (reservacion.folio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
}
