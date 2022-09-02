import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminReservacionDetallePage } from '../admin-reservacion-detalle/admin-reservacion-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { PaginationService } from '../../app/pagination.service';


@IonicPage()
@Component({
  selector: 'page-admin-historial-reservaciones',
  templateUrl: 'admin-historial-reservaciones.html',
})
export class AdminHistorialReservacionesPage implements OnInit {
  reservaciones: any = [];
  sucursales: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider,
    public page: PaginationService,
  ) {

    this.page.reset();
  }

  ngOnInit() {

    this.page.initHistorial('reservaciones', 'fechaR', { reverse: true, prepend: false }, localStorage.getItem('uidSucursal'));

  }

  ionViewDidLoad() {

    this.getAllReservacione();

  }
  getAllReservacione() {
    // const id = localStorage.getItem('uidSucursal');
    // const query = firestore.collection("fruits");
    // const snapshot = await query.get();
    // const count = snapshot.size;

    // const query = this.afs.collection('reservaciones');
    // const sna = await query.get();
    // const count = sna.size;



    //Cuando es un usuario se saca el id de la sucursal ala que pertenece
    // this.afs.collection('users', ref => ref.where('uid', '==', id)).valueChanges().subscribe(data => {

    //   this.sucursales = data;

    //   this.sucursales.forEach(element => {

    //     const uidSucursal = element.uidSucursal;

    //     this.monRes.getReservacionesPagando(uidSucursal).subscribe(reser => {

    //       this.reservaciones = reser;

    //       console.log('reservaciones', reser);
    //     })
    //   });
    // });

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

}
