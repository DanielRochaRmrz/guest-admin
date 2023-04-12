import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController,
  Platform,
} from "ionic-angular";
import { GestionReservacionesProvider } from "../../providers/gestion-reservaciones/gestion-reservaciones";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { UserProvider } from "../../providers/user/user";
import { AlertController } from "ionic-angular";
import { DeviceProvider } from "../../providers/device/device";
import { AdministrarReservacionesPage } from "../administrar-reservaciones/administrar-reservaciones";

@IonicPage()
@Component({
  selector: "page-reserva-detalle",
  templateUrl: "reserva-detalle.html",
})
export class ReservaDetallePage {
  idRers: any;
  area: any = {};
  zona: any = {};
  zonas: any;
  reserv: any = {};
  estatus: boolean = true;
  estatus2: boolean = true;
  mesas: any[];
  historial: any;
  res: boolean = false;
  productos: any[];
  totalReserv: any;
  estatusReser: any;
  users: any;
  uidUsuarioReser: string;
  compartidas: any;
  valorCupon: number = 0;
  uidRp: string;
  infoCodigoRP: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public _provderUser: UserProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    public _providerReserva: ReservacionProvider,
    public navParams: NavParams,
    public _gestionReser: GestionReservacionesProvider,
    private sendNoti: DeviceProvider
  ) {
    this.idRers = this.navParams.get("idReser");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReservaDetallePage");

    this.getReservacion();

    this.getCompartidaCon(this.idRers);

  }

  async getReservacion() {
    this.reserv = await this._gestionReser.getReservacionDetalle(this.idRers);

    this.uidUsuarioReser = this.reserv.idUsuario;

    let idZona = this.reserv.idZona;

    this._gestionReser.getZona(idZona).subscribe((zona) => {
      this.zona = zona;
    });

    // INFO DEL CODIGO USADO

    this.getInfoCodigoRP(this.reserv.codigoRP, this.reserv.idReservacion);

    if(this.reserv.uidCupon) {
      this.getValorCupon(this.reserv.uidCupon);
    }
    
    this.getProductos(this.idRers);

    this.getMesas(idZona);

    this.consultaHistorial(this.reserv.idUsuario);
  }

  async getValorCupon(idCupon: string) {
    const valorCupon = await this._gestionReser.getValorCupon(idCupon);
    this.valorCupon = Number(valorCupon);
    console.log('Valor cupon -->', valorCupon);
  }

  async getInfoCodigoRP(codigoRP:string, idReservacion:string){

    this.infoCodigoRP = await this._gestionReser.getInfoContCodigosRP(codigoRP, idReservacion);

    this.uidRp = this.infoCodigoRP.uidRP;

    console.log('infoCodigoRP--->', this.infoCodigoRP.uidRP);    

  }

  getMesas(idZona) {
    this._gestionReser.getMesas(idZona).subscribe((mesas) => {
      this.mesas = mesas;
      console.log("mesas JAJA: ", this.mesas);
    });
  }

  consultaHistorial(idUsuario) {
    this._gestionReser.getHistorial(idUsuario).subscribe((history) => {
      this.historial = history;

      console.log(this.historial);

      if (this.historial.length != 0) {
        this.res = true;
      } else {
        this.res = false;
      }
    });
  }

  getProductos(idReserv) {
    let total = 0;

    this._providerReserva.getProductos(idReserv).subscribe((productos) => {
      this.productos = productos;

      productos.forEach(function (value) {
        total = total + value.total;
      });

      this.totalReserv = total;
    });
  }

  closeModal() {
    let result = "se cerrro";

    this.viewCtrl.dismiss({ result: result });
  }

  modStatus_cancelacion(idReserv, idSucursal) {
    let modal = this.modalCtrl.create("Modalstatus_cancelacionPage", {
      idReserv: idReserv,

      idSucursal: idSucursal,

      idUsuario: this.reserv.idUsuario,
    });

    modal.present();
  }

  Aceptar(idReserv) {
    if (this.reserv.numMesa != undefined) {
      this._gestionReser.getEstatusReser(idReserv).subscribe((reser) => {
        this.estatusReser = reser;

        this.estatusReser.forEach((data) => {
          if (data.estatus == "Creando") {
            this._gestionReser.aceptarReservacion(idReserv);
            this.navCtrl.setRoot(AdministrarReservacionesPage);
            // this.getUsersPushNotiAceptada();
          }
          if (data.estatus == "CreadaCompartida") {
            this._gestionReser.aceptarReservacionCompartida(idReserv);
            this.navCtrl.setRoot(AdministrarReservacionesPage);
            // this.getUsersPushNotiAceptada();
          }
        });
      });
    } else {
      const alert = this.alertCtrl.create({
        title: "No se ha asignado una mesa a esta reservación",
        buttons: ["Aceptar"],
      });

      alert.present();
    }
  }

  getUsersPushNotiAceptada() {
    console.log("id rese", this.reserv.idUsuario);

    this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe((users) => {
      this.users = users;

      if (users.playerID != undefined) {
        if (this.platform.is("cordova")) {
          const data = {
            topic: users.playerID,
            title: "Reservación aceptada",
            body: "Hola " + users.displayName + " tu reservación fue aceptada. ",
          };
          this.sendNoti.sendPushNoti(data).then((resp: any) => {
            console.log("Respuesta noti fcm", resp);
            // this.pushNotiTime();
          });
        } else {
          console.log("Solo funciona en dispositivos");
        }
      }
    });
  }

  pushNotiTime() {
    console.log("id rese", this.reserv.idUsuario);

    this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe((users) => {
      this.users = users;

      if (users.playerID != undefined) {
        if (this.platform.is("cordova")) {
          const data = {
            topic: users.playerID,
            title: `Reservación ${this.reserv.folio}`,
            body: "Evita perder tu reservación, tienes 24 hora(s) para pagar",
          };
          this.sendNoti.sendPushNoti(data).then((resp: any) => {
            console.log("Respuesta noti fcm", resp);
          });
        } else {
          console.log("Solo funciona en dispositivos");
        }
      }
    });
  }

  asignarMesa(idReserv: string, fechaR: string, idSucursal: string) {
    const prompt = this.alertCtrl.create({
      title: "Asignación de mesa",
      inputs: [
        {
          name: "mesa",
          type: "number",
          placeholder: "Número de mesa",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Guardar",
          handler: (data) => {
            console.log("Saved clicked", data);
            let mesa = data.mesa;
            this.validarMesa(idReserv, fechaR, idSucursal, mesa);
          },
        },
      ],
    });
    prompt.present();
  }

  async validarMesa(
    idReserv: string,
    fechaR: string,
    idSucursal: string,
    mesa: string
  ) {
    const mesas = await this._providerReserva.ValidarMesa(
      fechaR,
      idSucursal,
      mesa
    );
    console.log("Mesas ts -->", mesas);
    if (mesas == true) {
      this.updateMesaReserva(idReserv, mesa);
    } else {
      let alertMesaAsignada = this.alertCtrl.create({
        title: "Asignada",
        message: "La mesa elegida a sido ya asignada en otra reservación",
        buttons: ["Aceptar"],
      });
      alertMesaAsignada.present();
    }
  }

  updateMesaReserva(idReserv: string, mesa: string) {
    this._providerReserva
      .updateStatus(idReserv, mesa)
      .then((respuesta: any) => {
        this.getReservacion();
      });
  }

  getCompartidaCon(idReserv: string) {
    this._gestionReser.getCompartidas(idReserv).subscribe((res) => {
      this.compartidas = res;

      console.log(this.compartidas);
    });
  }
}
