import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { GestionReservacionesProvider } from "../../providers/gestion-reservaciones/gestion-reservaciones";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { AngularFirestore } from "@angular/fire/firestore";
import moment from "moment";
import { AdminMenuReservacionPage } from "../admin-menu-reservacion/admin-menu-reservacion";
import { ReservaDetallePage } from "../reserva-detalle/reserva-detalle";
import { PaginationService } from '../../app/pagination.service';

@IonicPage()
@Component({
  selector: "page-administrar-reservaciones",
  templateUrl: "administrar-reservaciones.html",
})
export class AdministrarReservacionesPage {
  fecha: Date = new Date();
  uidSucursal: any;
  reservaciones: any = [];
  compartidas: any;
  type: string = '';
  uidUser: string = '';
  public date = moment().format("YYYY-MM-DD");
  public noReservaciones;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    public viewCtrl: ViewController,
    public _gestionReser: GestionReservacionesProvider,
    public page: PaginationService,
  ) {

    this.page.reset();
    this.getNoReservaciones();

  }

  ionViewDidLoad() {
    this.uidSucursal = localStorage.getItem("uidSucursal");

    this.type = localStorage.getItem('type');

    this.uidUser = localStorage.getItem('uidUser');

    this.clearReservas(this.uidSucursal);

    switch (this.type) {

      case 'rp':

         this.codigoRP(this.uidUser);

        break;

        default:

          this.page.initGestionReservaciones('reservaciones', 'fechaR', { reverse: true, prepend: false }, this.uidSucursal);

        break;

    }

  }


 async clearReservas(uid: string) {
    const clearReserva = await this._providerReserva.cleanReserva(uid);
    console.log('Repsueta exito -->', clearReserva);
  }

  
  async codigoRP(uidUser: string) {

    const codigoRP = await this._providerReserva.getCodigoRP(uidUser);

    this.getReservacionesRP(codigoRP);

  }

  getReservacionesRP(codigoRP: any) {

    this.uidSucursal = localStorage.getItem("uidSucursal");

    this._gestionReser
      .getReservacionesRP(this.uidSucursal, codigoRP)
      .subscribe((reserv) => {

        this.reservaciones = reserv;

      });
  }


  consultaReservacion(idReser) {

    this.navCtrl.push(ReservaDetallePage, { idReser: idReser })

  }

  behind() {

    this.navCtrl.setRoot(AdminMenuReservacionPage);

  }

  scrollHandler(e) {
    
    if (e === 'bottom') {      
      this.page.moreGestionReservaciones(this.uidSucursal)
    }
  }

  getNoReservaciones(){

    this.afs.collection('reservaciones', ref => ref
    .where("estatus", 'in', ["Creando", "CreadaCompartida"])).valueChanges().subscribe(values => 
      
      this.noReservaciones = values.length      
      
    );
  }

}
