import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { AdministrarReservacionesPage } from '../administrar-reservaciones/administrar-reservaciones';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { GestionReservacionesProvider } from '../../providers/gestion-reservaciones/gestion-reservaciones';
import { DeviceProvider } from '../../providers/device/device';

@IonicPage()
@Component({
  selector: 'page-modalstatus_cancelacion',
  templateUrl: 'modalstatus_cancelacion.html',
})
export class Modalstatus_cancelacionPage {
  idReserv: any;
  idSucursal: any;
  myForm: FormGroup;
  data: any = {};
  mesas: any;
  users: any;
  idUsuario:any;


  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public fb: FormBuilder,
              public _providerReserva: ReservacionProvider,
              public navParams: NavParams, 
              public _gestionReser: GestionReservacionesProvider,
              public platform: Platform,
              private sendNoti: DeviceProvider) {
    this.idReserv = this.navParams.get("idReserv");
    console.log("Id Reserv: ", this.idReserv);
    
    this.idSucursal = this.navParams.get("idSucursal");
    console.log("Id Sucursal: ", this.idSucursal);

    this.idUsuario = this.navParams.get("idUsuario");
    console.log("idUsuario: ", this.idUsuario);


    this.myForm = this.fb.group({     
      motivo: ["", [Validators.required]],
      status: ["", [Validators.required]]
    });

     console.log("Motivo seleccionada: ", this.data.motivo);
     console.log("Estatus seleccionada: ", this.data.status);

  }

  ionViewDidLoad() {
    // this.getMesas(this.idSucursal);
  }

  saveData(){
    console.log(this.myForm.value);
    console.log('saveDataMotivo: ',this.data.motivo);
    console.log('saveDataStatus: ',this.data.status);
    let info = {
      motivo: this.data.motivo,
      status: 'Cancelado',
      otro: "xxx",
    };
    this._providerReserva.cancelarStatus(this.idReserv, info).then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
      });
    
    // ELIMINAMOS EL REGSITRO DEL CODIGO USADO POR EL USUARIO PARA QUE PUEDA VOLVER A USARLO

    this._providerReserva.borrarRegistroUsuarioCodigoRP(this.idReserv);

    this.getUsersPushCancelar() 

    this.closeModal();
    
  }

  closeModal() {
    const uidSucursal = localStorage.getItem("uidSucursal");

    this.navCtrl.push(AdministrarReservacionesPage, {
      uidSucursal: uidSucursal
    });
}

getUsersPushCancelar() {

  this._gestionReser.getMyUser(this.idUsuario).subscribe((users) => {

    this.users = users;

    if (users.playerID != undefined) {

      if (this.platform.is("cordova")) {

        const data = {
          topic: users.playerID,
          title: "Reservación cancelada",
          body: "Hola "+users.displayName+" tu reservación fue cancelada.",
        };
        this.sendNoti.sendPushNoti(data).then((resp: any) => {
          console.log('Respuesta noti fcm', resp);
        });

      } else {
        console.log("Solo funciona en dispositivos");
      }

    }
  });
}



}
