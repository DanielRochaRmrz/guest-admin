import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdministrarReservacionesPage } from '../administrar-reservaciones/administrar-reservaciones';
import { AdminHomePage } from '../admin-home/admin-home';

@IonicPage()
@Component({
  selector: 'page-admin-reservaciones-curso',
  templateUrl: 'admin-reservaciones-curso.html',
})
export class AdminReservacionesCursoPage {
  reservaciones: any = [];
  formatoFecha: any;
  sucursales: any;
  infoEvento: any;
  home: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider) {

    this.home = this.navParams.get("home");
    console.log(this.home);
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
    

    const id = localStorage.getItem('uidSucursal');
    const uidSu = localStorage.getItem('uid');
    
     this.monRes.getReservacionesCursoSuc(uidSu, this.formatoFecha).subscribe(reser => {

     this.reservaciones = reser;

      // console.log('reservaciones', reser);
    })
  }


  goDetalle(idReservacion) {
    this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion });
  }

  getEvento() {
    
    const uidSucursal = localStorage.getItem('uidSucursal');  

    this.monRes.getEventosSucucursal(uidSucursal).subscribe(data12 => {

      this.infoEvento = data12;  
    })
  }

  behind() {
    if (this.home != null || this.home != undefined) {
      this.navCtrl.setRoot(AdminHomePage);
    }else {
      this.navCtrl.setRoot(AdministrarReservacionesPage);
    }
  }
}
