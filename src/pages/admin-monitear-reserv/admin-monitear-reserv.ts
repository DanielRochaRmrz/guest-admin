import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AdminLeeQrPage } from '../admin-lee-qr/admin-lee-qr';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { AdminHomePage } from '../admin-home/admin-home';
import { PaginationService } from '../../app/pagination.service';
import { DeviceProvider } from '../../providers/device/device';

@IonicPage()
@Component({
  selector: 'page-admin-monitear-reserv',
  templateUrl: 'admin-monitear-reserv.html',
})
export class AdminMonitearReservPage {
  options: BarcodeScannerOptions;
  encodText: string = '';
  encodeData: any = {};
  scannedData: any = {};

  reservaciones: any = [];
  infoEvento: any = [];
  datosQr: any;
  menu: any;
  formatoFecha: any;
  sucursales: any;
  reservacionesAcep: any;
  noReservaciones: any;
  uidSucursal: any;
  fechaActual: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider,
    private barcodeScanner: BarcodeScanner,
    public page: PaginationService,
    private sendNoti: DeviceProvider
  ) {

    this.page.reset();
    
    //recibe parametro de la reservacion
    this.menu = this.navParams.get("menu");

    this.getNoReservaciones();

    this.uidSucursal = localStorage.getItem('uidSucursal');
    

  }

  ionViewDidLoad() {

    console.log("admin-monitear-reserv.html");    
    this.fechaActual = new Date().toJSON().split("T")[0];

    // this.getAllReservacione();
    this.page.initMonitorReservaciones('reservaciones', 'fechaR', { reverse: true, prepend: false }, this.uidSucursal);

    this.getEvento();


  }


  goDetalle(idReservacion) {

    this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion });

  }

  getEvento() {
    
    const uidSucursal = localStorage.getItem('uidSucursal');  

    this.monRes.getEventosSucucursal(uidSucursal).subscribe(data12 => {

      this.infoEvento = data12;      

      // console.log("this.infoEvento ", this.infoEvento);
      

  })
}

  scan() {

    this.options = {

      prompt: 'Procesando Reservación'

    };

    this.barcodeScanner.scan(this.options).then((data) => {

      this.scannedData = data;

      this.datosQr = data.text;

      const datosQr = this.datosQr;

      this.navCtrl.push(AdminLeeQrPage, { datosQr: datosQr });

    }, (err) => {
      
      console.log('Error', err);

      const datosQr = [{ "idReservacion": "i5nxQeQS3rQqeGOpH4Ux"}, {"idCompartir": "undefined"}];

      this.navCtrl.push(AdminLeeQrPage, { datosQr: datosQr });
    })
  }

  behind(){

    if (this.menu != null || this.menu != undefined || localStorage.getItem("type") == "capitan_mesero" ) {
      this.navCtrl.setRoot(AdminHomePage);

    }else{
      
      this.navCtrl.push(AdminMenuReservacionPage);
    }

  }

  getNoReservaciones(){

    this.afs.collection('reservaciones', ref => ref
    .where("estatus", 'in', ["Aceptado", "AceptadoCompartida"])).valueChanges().subscribe(values => 
      
      this.noReservaciones = values.length      
      
    );
  }

  scrollHandler(e) {

    console.log(e);    

    if (e === 'bottom') {
      this.page.moreMonitorReservaciones(this.uidSucursal);
    }
  }

  cancelReserva(reservaID: string, usuarioID: string){
    
    let info = {
      motivo: 'La reservación no fue pagada',
      status: 'Cancelado',
      otro: "xxx",
    };
    this.monRes.cancelarStatus(reservaID, info).then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
      });
    
    // ELIMINAMOS EL REGSITRO DEL CODIGO USADO POR EL USUARIO PARA QUE PUEDA VOLVER A USARLO

    this.monRes.borrarRegistroUsuarioCodigoRP(reservaID);

    this.page.reset();

    this.page.initMonitorReservaciones('reservaciones', 'fechaR', { reverse: true, prepend: false }, this.uidSucursal);

    this.getUsersPushCancelar(usuarioID) 
    
  }

  getUsersPushCancelar(usuarioID: string) {

    this.monRes.getMyUser(usuarioID).subscribe((users) => {
  
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
