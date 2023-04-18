import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, ActionSheetController } from 'ionic-angular';
import { AdminEventoSubirPage } from "../admin-evento-subir/admin-evento-subir";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
import { ArchivoSubir } from "../../providers/carga-archivo/ArchivoSubir";
import { ToastProvider } from '../../providers/toast/toast';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AdminEventoEditPage } from '../../pages/admin-evento-edit/admin-evento-edit';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdminHomePage } from '../admin-home/admin-home';

@Component({
  selector: 'page-admin-evento-home',
  templateUrl: 'admin-evento-home.html',
})
export class AdminEventoHomePage {
  //hayMas:boolean= true;
  // eventos: Observable<any[]>
  eventos: any;
  eventoss: any;
  @ViewChild('myNav') nav: NavController;
  sucursal: any;
  uid: string;
  sucursales: any;
  uidSucursal: string;

  constructor(private modalctrl: ModalController,
    public navCtrl: NavController,
    private actionSheet: ActionSheetController,
    private toastCtrl: ToastProvider,
    public _cap: CargaArchivoProvider,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    public firebase: AngularFireAuth,
  ) {

    // this.sucursal = this.firebase.auth.currentUser;

    this.uidSucursal = localStorage.getItem("uidSucursal");

    this.afs.collection('evento', ref => ref.where('uidSucursal', '==', this.uidSucursal)).valueChanges().subscribe(data => {
      this.eventos = data;
    });


    // if (this.sucursal != null) {

    //   this.uid = this.sucursal.uid;

    //   console.log("this.sucursal.this.uid =>>", this.uid);


    //Cuando es un usuario se saca el id de la sucursala ala que pertenece

    //   this.afs.collection('users', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data => {

    //     this.sucursales = data;

    //     this.sucursales.forEach(element => {

    //       const uidSucursal = element.uidSucursal;

    //       this.afs.collection('evento', ref => ref.where('uidSucursal', '==', uidSucursal)).valueChanges().subscribe(data => {
    //         this.eventos = data;
    //       });

    //     });
    //   });

    //   this.afs.collection('evento', ref => ref.where('uidSucursal', '==', this.uid)).valueChanges().subscribe(data => {
    //     this.eventoss = data;
    //   });

    // }

  }
  // doInfinite(infiniteScroll) {
  //   console.log('Begin async operation');
  //   this._cap.cargar_imagenes().then(
  //     (hayMas:boolean)=>{
  //       console.log(hayMas);
  //       this.hayMas = hayMas;
  //       infiniteScroll.complete();
  //     }
  //   );
  // }
  mostrar_modal() {
    let modal = this.modalctrl.create(AdminEventoSubirPage);
    modal.present();
  }
  selectEventoItem(eventoItem: ArchivoSubir) {
    /* Display an action that gives the user the following options
      1.Edit
      2. Delete
      3. Cancel
    */
    this.actionSheet.create({
      title: `${eventoItem.titulo}`,
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.navCtrl.push(AdminEventoEditPage, this._cap.selectedEventoItem = Object.assign({}, eventoItem));
            console.log(eventoItem);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            //Delete the currente CartaItem
            if (confirm('¿Estás seguro de eliminar este registro?')) {
              this._cap.deleteEvento(eventoItem.key, eventoItem.img, eventoItem.uid);
              this.toastCtrl.show(`${eventoItem.titulo} deleted`);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("El usuario cancelo.");
          }
        }
      ]
    }).present();

  }
  behind() {
    this.navCtrl.setRoot(AdminHomePage);
  }
}
