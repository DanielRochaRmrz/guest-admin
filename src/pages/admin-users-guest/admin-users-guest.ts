import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AdminUsersPage } from '../admin-users/admin-users';
import { UserProvider } from '../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { AdminHomePage } from '../admin-home/admin-home';
import { AdminUserDetailPage } from '../admin-user-detail/admin-user-detail';


@IonicPage()
@Component({
  selector: 'page-admin-users-guest',
  templateUrl: 'admin-users-guest.html',
})
export class AdminUsersGuestPage {

  admins: any[];
  admins2: any[];
  uid: any;
  sucursal: any;
  user: string = 'empleado';
  empleados: any[];
  empleados2: any[];
  usuario: any;
  sucursales: any;

  adminsU: any[];
  empleadosU: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public DB: AngularFireDatabase,
    public modalCtrl: ModalController,
    public actionSheet: ActionSheetController,
    public _up: UserProvider,
    public afs: AngularFirestore,
    public firebase: AngularFireAuth,

  ) {
    this.usuario = this.navParams.get("usuario");
    console.log("tipo de usuario", this.usuario);
    this.sucursal = this.firebase.auth.currentUser;
    if (this.sucursal != null) {
      this.uid = this.sucursal.uid;
      //Cuando es un usuario se saca el id de la sucursal a la que pertenece
      this.afs.collection('users', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data => {
        this.sucursales = data;
        this.sucursales.forEach(element => {
          const uidSucursal = element.uidSucursal;
          this.afs.collection('users', ref => ref.where('uidSucursal', '==', uidSucursal))
            .valueChanges().subscribe(u => {
              this.admins = u;
              this.empleados = u;
              console.log('admins', this.admins);
            })
        });
      });
      this.afs.collection('users', ref => ref.where('uidSucursal', '==', this.uid))
        .valueChanges().subscribe(u => {
          this.admins = u;
          this.empleados = u;
          console.log('admins', this.admins);
        })


      //Lista de empleados

      this.afs.collection('users', ref => ref.where('type', '==', 'u'))
        .valueChanges().subscribe(u => {
          this.adminsU = u;
          this.empleadosU = u;
          console.log("Usuarios en la aplicación", this.adminsU);
          
        });

    }

    // if (this.home == 'home') {
    //   this.afs.collection('users', ref => ref.where('type', '==', 'e'))
    //     .valueChanges().subscribe(u2 => {
    //       this.admins2 = u2;
    //       this.empleados2 = u2;
    //     })
    // }

    // this.admins = this.DB.list('users').valueChanges();
    //var admins = firebase.database().ref('/users').orderByChild('type').equalTo('a');

  }
  // Esto es para el buscador
  initializeItems2(): void {
    this.admins2 = this.empleados2;
  }
  getItems2(evt) {
    this.initializeItems2();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.admins2 = this.admins2.filter(admin2 => {
      if (admin2.displayName && searchTerm) {
        if (admin2.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
  // Esto es para el buscador
  initializeItems(): void {
    this.admins = this.empleados;
  }
  getItems(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.admins = this.admins.filter(admin => {
      if (admin.displayName && searchTerm) {
        if (admin.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItemsU(): void {
    this.adminsU = this.empleadosU;
  }
  getItemsU(evt) {
    this.initializeItemsU();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.adminsU = this.adminsU.filter(admin => {
      if (admin.displayName && searchTerm) {
        if (admin.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  //Termina. Esto es para el buscador


  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminUsersGuestPage');
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(AdminUsersPage);
    modal.present();
  }

  selectUsuario(uid, active) {
    this.actionSheet.create({
      title: 'Acciones',
      buttons: [
        // {
        //   text: 'Editar',
        //   handler:()=>{
        //     //Aqui va el codigo
        //   }
        // },
        {

          text: 'Inhabilitar/hablitar cuenta',
          role: 'destructive',
          handler: () => {
            const coma = active == 'true' ? 'Inhabilitado' : 'Habilitado';
            if (confirm('Cambiara el estado a ' + coma + ' de este usuario')) {
              // Si el usuario está activo y se quiere inhablitar entra a esta función
              if (active == 'true') {
                this._up.inhabilitar_user(uid);
                console.log('Se inhablito cuenta');
                // Si el usuario está desactivo y se quiere hablitar entra a esta función
              } else if (active == 'false') {
                this._up.habilitar_user(uid);
                console.log('Se hablito cuenta');
              }
            }
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (confirm('¿Estas seguro de eliminar este usuario?')) {
              this._up.delete_user(uid);
              console.log('Se elimino');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancelo");

          }
        }
      ]
    }).present();
  }


  selectUsuarioU(uid, home){
    this.actionSheet.create({
      title: 'Acciones',
      buttons:[
        {
          text: 'Ver más',
          handler:()=>{
            this.navCtrl.push(AdminUserDetailPage, {uid: uid, home: home});
          }
        },
        // {          
        //   text:'Inhabilitar cuenta',
        //   role: 'destructive',
        //   handler:()=>{
        //     if(confirm('¿Estas seguro de desactivar a este usuario?')){
        //       this._up.inhabilitar(uid);
        //       console.log('uid usuario', uid);
              
        //       console.log('Se inhabilito');
        //   } 
        // }
        // },
        {
          text:'Cancel',
          role:'cancel',
          handler:()=>{
            console.log("Cancelo");
            
          }
        }
      ]
    }).present();
  }

  behind(){
    this.navCtrl.setRoot(AdminHomePage);
  }

}
