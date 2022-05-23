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
import { stringify } from "querystring";

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

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public _provderUser: UserProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    public _providerReserva: ReservacionProvider,
    public navParams: NavParams,
    public _gestionReser: GestionReservacionesProvider
  ) {

    this.idRers = this.navParams.get("idReser");

  }

  ionViewDidLoad() {

    console.log("ionViewDidLoad ReservaDetallePage");

    this._gestionReser.getReservacion(this.idRers).subscribe((res) => {

      this.reserv = res;

      // INICIA igualamos la variable string uidUsuarioReser a una constante por que no asiganaba un tipo de dato 
      
      const uidUsuarioReser  = this.reserv.idUsuario;
      
      this.uidUsuarioReser = uidUsuarioReser;
      
      // TERMINA igualamos la variable string uidUsuarioReser a una constante por que no asiganaba un tipo de dato 


      let idArea = this.reserv.idArea;

      this._gestionReser.getArea(idArea).subscribe((area) => {

        this.area = area;
        
      });

      let idZona = this.reserv.idZona;

      this._gestionReser.getZona(idZona).subscribe((zona) => {

        this.zona = zona;

      });

      this.consultaHistorial(this.reserv.idUsuario);

      this.getProductos(this.idRers);

    });
  }

    consultaHistorial(idUsuario) {

    this._gestionReser.getHistorial(idUsuario).subscribe((history) => {

      this.historial = history;

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

    this.getUsersPusCancelar();

      let modal = this.modalCtrl.create("Modalstatus_cancelacionPage", {

      idReserv: idReserv,

      idSucursal: idSucursal

    });

    modal.present();
    
  }

  Aceptar(idReserv) {

    if(this.reserv.numMesa != undefined ){

      this.getUsersPusNoti();

      this._gestionReser.getEstatusReser(idReserv).subscribe((reser) => {
        
        this.estatusReser = reser;

        this.estatusReser.forEach((data) => {

          if (data.estatus == "Creando") {

            this._gestionReser.aceptarReservacion(idReserv);
            
            this.closeModal();
  
          }
          if (data.estatus == "CreadaCompartida") {

            this._gestionReser.aceptarReservacionCompartida(idReserv);
  
            this.closeModal();
  
          }
        });
      });

    }else{

      const alert = this.alertCtrl.create({

        title: "No se ha asignado una mesa a esta reservación",
        buttons: ["Aceptar"]
        
      });

      alert.present();

    }
   
  }

  getUsersPusNoti() {
    console.log("id rese", this.reserv.idUsuario);

    this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe((users) => {
  
      this.users = users;  

      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
          include_player_ids: [users.playerID],
          data: { foo: "bar" },
          contents: {
            en: " Reservación aceptada ",
          },
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function (successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function (failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
      }
    });
  }

  getUsersPusCancelar() {

    this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe((users) => {

      this.users = users;

      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
          include_player_ids: [users.playerID],
          data: { foo: "bar" },
          contents: {
            en: " Reservación cancelada ",
          },
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function (successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function (failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
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
        console.log("Respuesta: ", respuesta);
      });
  }
}
