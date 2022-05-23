import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AdminLeeQrPage } from '../admin-lee-qr/admin-lee-qr';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';


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
  datosQr: any;
  menu: any;
  formatoFecha: any;
  sucursales: any;
  reservacionesAcep: any;
  infoEvento: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider,
    private barcodeScanner: BarcodeScanner
  ) {
    //recibe parametro de la reservacion
    this.menu = this.navParams.get("menu");
    console.log(this.menu);
  }

  ionViewDidLoad() {

    this.getAllReservacione();

    this.getEvento();

  }

  getAllReservacione() {

    var dateObj = new Date()

    var anio = dateObj.getFullYear().toString();

    var mes = dateObj.getMonth().toString();

    var dia = dateObj.getDate();

    var mesArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    if (dia >= 1 && dia <= 9) {

      var diaCero = '0' + dia;

      this.formatoFecha = anio + '-' + mesArray[mes] + '-' + diaCero;

    } else {

      this.formatoFecha = anio + '-' + mesArray[mes] + '-' + dia;

    }

    console.log("fecha actual", this.formatoFecha);
    
    const id = localStorage.getItem('uidSucursal');
    
    //Cuando es un usuario se saca el id de la sucursal ala que pertenece
    this.afs.collection('users', ref => ref.where('uid', '==', id)).valueChanges().subscribe(data => {

      this.sucursales = data;

      this.sucursales.forEach(element => {

        const uidSucursal = element.uidSucursal;

        this.monRes.getReservaciones(uidSucursal, this.formatoFecha).subscribe(reser => {

          this.reservaciones = reser;

          console.log('reservaciones1', reser);
          
        })
        
        // TRAE LAS RESERVACIONES COMPARTIDAS
        this.monRes.getReservacionesAcepCom(uidSucursal, this.formatoFecha).subscribe(reser => {

          this.reservacionesAcep = reser;

          console.log('reservaciones2', reser);

        })
      });
    });

  }

  goDetalle(idReservacion) {

    this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion });

  }

  getEvento() {

    this.afs.collection("evento").valueChanges().subscribe(data12 => {
        this.infoEvento = data12;
        console.log("evento", this.infoEvento);
    });

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
    })
  }

  behind(){

    this.navCtrl.setRoot(AdminMenuReservacionPage);

  }

}
