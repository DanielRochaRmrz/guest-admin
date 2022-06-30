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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    public viewCtrl: ViewController,
    public _gestionReser: GestionReservacionesProvider
  ) {}

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

          this.getReservaciones();

        break;

    }

  }


 async clearReservas(uid: string) {
    const clearReserva = await this._providerReserva.cleanReserva(uid);
    console.log('Repsueta exito -->', clearReserva);
  }

  getCompartidas(idR) {

    this._gestionReser.getCompartidas(idR).subscribe((reserv) => {
    this.compartidas = reserv;

    });

  }

  getReservaciones() {

    this.uidSucursal = localStorage.getItem("uidSucursal");

    const date = moment().format("YYYY-MM-DD");

    const fecha = moment(date).format("x");

    this._gestionReser
      .getReservaciones(this.uidSucursal, fecha)
      .subscribe((reserv) => {

        this.reservaciones = reserv;
        
        console.log('RESERVACIONES', this.reservaciones);
        

      });
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

}
