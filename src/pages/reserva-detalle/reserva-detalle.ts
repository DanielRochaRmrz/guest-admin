import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,ViewController, Platform } from 'ionic-angular';
import { GestionReservacionesProvider } from '../../providers/gestion-reservaciones/gestion-reservaciones';
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the ReservaDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reserva-detalle',
  templateUrl: 'reserva-detalle.html',
})
export class ReservaDetallePage {

  idRers:any;
  sucursales: any;
  usuarios: any;
  area: any = {};
  zona: any = {};
  zonas:any;
    reserv: any = {};
  estatus: boolean = true;
  estatus2: boolean = true;
  mesas: any[];
  historial:any;
  res: boolean = false;
  productos: any[];
  totalReserv: any;
  estatusReser: any;
  users:any;

  constructor(public navCtrl: NavController,       public _provderUser: UserProvider, public platform:Platform,  public viewCtrl: ViewController,   private modalCtrl: ModalController, public _providerReserva: ReservacionProvider, public navParams: NavParams, public _gestionReser: GestionReservacionesProvider) {
    this.idRers = this.navParams.get('idReser');
    var idR = this.idRers.idReservacion;
   console.log("id",idR);
  }

  ionViewDidLoad() {
    this.getUsuarios();
    console.log('ionViewDidLoad ReservaDetallePage');


    this._gestionReser.getReservacion(this.idRers).subscribe(res=>{
      this.reserv = res;
        console.log("Esta es la reservación: ",this.reserv);
  
        let idArea = this.reserv.idArea;
        this._gestionReser.getArea(idArea).subscribe(area=> {
          this.area = area;
          console.log("Estos son las areas: ", this.area);
        });
  
        let idZona = this.reserv.idZona;
        this._gestionReser.getZona(idZona).subscribe(zona => {
          this.zona = zona;
          console.log("Estos son las zonas: ", this.zona);
        });
  
        this.getMesas(idZona);
  
        this.consultaHistorial(this.reserv.idUsuario);
        this.getProductos( this.idRers);
      });
  }



  getMesas(idZona) {
    this._gestionReser.getMesas(idZona).subscribe(mesas => {
      this.mesas = mesas;
      console.log("mesas JAJA: ", this.mesas);
    });
  }

  consultaHistorial(idUsuario){
    this._gestionReser.getHistorial(idUsuario).subscribe(history => {
      this.historial = history;
      if (this.historial.length!=0) {
        this.res = true;
      }else{
        this.res= false;
      }
      console.log("Estas son las reservaciones completas: ", this.historial);
    });

    this.consultaSucursales();
  }


  getProductos(idReserv) {
    let total=0;
    console.log("getProductos id reserva", idReserv);
     this._providerReserva.getProductos(idReserv).subscribe(productos => {
       console.log("productos: ", productos);
       this.productos = productos;

       productos.forEach(function (value) {
        console.log('foreachIonci' +value.total );
        total =total+value.total;
        
      });
      console.log('totalreserva1: '+total);
      this.totalReserv=total;
       
     });
  }
  consultaSucursales(){
    this._gestionReser.getSucursales().subscribe(sucursales => {
      this.sucursales = sucursales;
      console.log("Estas son las sucursales: ", this.sucursales);
    });
  }
  getUsuarios() {
    this._gestionReser.getUsuarios().subscribe(users => {
      this.usuarios = users;
      console.log("Estos son los usuarios: ", this.usuarios);
    });
  }

  closeModal() {
    let result ="se cerrro";
    this.viewCtrl.dismiss({result:result});
    // this.modalCtrl.dismiss();
  }
  modZonaMesa(idReserv, idSucursal, idArea, idZona){
    let modal = this.modalCtrl.create("ModiareazonaPage",{
      idReserv: idReserv,
      idSucursal: idSucursal,
      idArea: idArea,
      idZona: idZona
    });
    modal.present();
  }

  closeModal1() {
    this.navCtrl.pop();
}

modStatus_cancelacion(idReserv, idSucursal){
  this.getUsersPusCancelar();
  console.log("moStatus_cancelacion",idReserv);
  console.log(idSucursal);

  let modal = this.modalCtrl.create("Modalstatus_cancelacionPage",{  
    idReserv: idReserv,
    idSucursal: idSucursal,
  });
  
  modal.present(); 

}
Aceptar(idReserv){
  this.getUsersPusNoti();
  //console.log("Este es el id: ", idReserv);
  //this._gestionReser.aceptarReservacion(idReserv);
  //Obtener el estatus de la reservacion si es creada normal o CreadaCompartida
  this._gestionReser.getEstatusReser(idReserv).subscribe(reser => {
    this.estatusReser = reser;
      this.estatusReser.forEach(data => {
        if(data.estatus=='Creando'){
          console.log("Este es el id creada: ", idReserv);
          this._gestionReser.aceptarReservacion(idReserv);
        }
        if(data.estatus=='CreadaCompartida'){
          console.log("Este es el id compartida: ", idReserv);
            console.log("ejecutocompartida: ", idReserv);
          this._gestionReser.aceptarReservacionCompartida(idReserv);
        }

      });
  });


}



getUsersPusNoti(){

console.log( 'id rese',  this.reserv.idUsuario);

  this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe(users => {
    this.users = users;
    console.log('Estos es  usuarios: ', this.users);

      console.log("PlayerID: ", users.playerID);
      
      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
          include_player_ids: [users.playerID],
          data: { foo: "bar" },
          contents: {
            en: " Reservación aceptada "
          }
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function(successResponse) {
            console.log(
              "Notification Post Success:",
              successResponse
            );
          },
          function(failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
      }
   });
  }
  

getUsersPusCancelar(){

  console.log( 'id rese',  this.reserv.idUsuario);
  
    this._gestionReser.getMyUser(this.reserv.idUsuario).subscribe(users => {
      this.users = users;
      console.log('Estos es  usuarios: ', this.users);
  
        console.log("PlayerID: ", users.playerID);
        
        if (this.platform.is("cordova")) {
          let noti = {
            app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
            include_player_ids: [users.playerID],
            data: { foo: "bar" },
            contents: {
              en: " Reservación cancelada "
            }
          };
  
          window["plugins"].OneSignal.postNotification(
            noti,
            function(successResponse) {
              console.log(
                "Notification Post Success:",
                successResponse
              );
            },
            function(failedResponse: any) {
              console.log("Notification Post Failed: ", failedResponse);
            }
          );
        } else {
          console.log("Solo funciona en dispositivos");
        }
     });
    }

// Cancelar(idReserv){
//   console.log("Este es el id: ", idReserv);
//   this._gestionReser.cancelarReservacion(idReserv);
// }

modStatus(idReserv, idSucursal, numMesa, status){

  console.log("moStatus",idReserv);
  console.log(idSucursal);
  console.log('x',numMesa);
  console.log('x2',status);
  let modal = this.modalCtrl.create("ModalstatusPage",{
    idReserv: idReserv,
    idSucursal: idSucursal,
    numMesa: numMesa,
    status: status,
  });
  modal.present();
}

}


