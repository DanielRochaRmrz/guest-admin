import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { PaginationService } from '../../app/pagination.service';
import { snapshotChanges } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-admin-historial-reservaciones',
  templateUrl: 'admin-historial-reservaciones.html',
})
export class AdminHistorialReservacionesPage implements OnInit {
  reservaciones: any = [];
  sucursales: any;
  noReservaciones: any;
  pageCorte: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider,
    public page: PaginationService,
    private viewCtrl: ViewController,
  ) {
    this.pageCorte = this.navParams.get("pageCorte");
    this.page.reset();
    this.getAllReservaciones();
  }

  ngOnInit() {

    this.page.initHistorial('reservaciones', 'fechaR', { reverse: true, prepend: false }, localStorage.getItem('uidSucursal'));

  }

  getAllReservaciones() {

    this.noReservaciones = this.afs.collection('reservaciones').valueChanges().subscribe(values => console.log(values.length)
    );

  }

  goDetalle(idReservacion) {

    const page = AdminHistorialReservacionesPage;

    this.navCtrl.push(AdminReservacionDetallePage, { idReservacion: idReservacion, page });

  }

  behind() {

    this.navCtrl.setRoot(AdminMenuReservacionPage);

  }

  scrollHandler(e) {

    if (e === 'bottom') {

      // console.log(e);      

      this.page.moreHistorial(localStorage.getItem('uidSucursal'))
    }
  }
  
  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

}
