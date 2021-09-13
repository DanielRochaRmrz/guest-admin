import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Nav, ViewController, Platform } from 'ionic-angular';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProvider } from '../../providers/user/user';
import { AdminSucursalListPage } from '../admin-sucursal-list/admin-sucursal-list';
@IonicPage()

@Component({
  selector: 'page-admin-sucursal-subir',
  templateUrl: 'admin-sucursal-subir.html',
})
export class AdminSucursalSubirPage {
  @ViewChild(Nav) nav: Nav;
  ciudades: any;
  users: any;
  credentials: any = {
    sucursal: '',
    nombrecontacto: '',
    direccion: '',
    email: '',
    password: '',
    status: 'activo',
    tipo: '',
    ciudad: '',
    telefono: ''

  }
  sucursal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private viewCtrl: ViewController,
    public platform: Platform,
    public _provderUser: UserProvider,
    public ProSuc: SucursalAltaProvider,
    public afs: AngularFirestore
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminSucursalSubirPage');
    this.cargarCiudades();

    this.sucursal = localStorage.getItem('uid');
    console.log("este es el uid de la sucursal", this.sucursal);
  }

  //funcion cargar info de las sucursales
  cargarCiudades() {
    this.afs.collection('ciudades').valueChanges().subscribe(ciu => {
      this.ciudades = ciu;
    });
  }

  registrar() {
    console.log("pasa a la funcion");

    console.log('datos ciudad', this.credentials);
    var toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    if (this.credentials.email == '' || this.credentials.password == '' || this.credentials.name == '' || this.credentials.sucursal == '' || this.credentials.direccion == '' || this.credentials.tipo == '' || this.credentials.ciudad == '') {
      toaster.setMessage('Todos los campos son requeridos');
      toaster.present();
    } else if (this.credentials.password.length < 7) {
      toaster.setMessage('La contraseña no es sufucientemente larga, intenta con más de 7 caracteres');
      toaster.present();
    } else {
        let loader = this.loadingCtrl.create({
            content: 'Por favor, espere'
        });
        // loader.present();
        this.getUsersPusSucursal();      
       this.ProSuc.newRegisters(this.credentials, this.sucursal);

      this.cerrar_modal();
    }
  }
  cerrar_modal() {
    // this.viewCtrl.dismiss();
    const usertipo = 'master';
    this.navCtrl.setRoot(AdminSucursalListPage, { usertipo: usertipo });
    this.sucursal = localStorage.getItem('uid');
    console.log("este es el uid de la sucursal", this.sucursal);
  }


  getUsersPusSucursal() {
    let data = [];
    let data2 = this.users;
    this._provderUser.getAllUsers().subscribe(users => {


      this.users = users;
      console.log('Esusuarios: ', this.users);
      this.users.forEach(function (value) {

        data.push(value.playerID);
        console.log('playe', value.playerID);

      });


      let result = data.filter((item, index) => { return data.indexOf(item) === index; })

      console.log("result: ", result);

      for (var i = 0; i < result.length; i++) {
        console.log("resullll", result[i]);


        if (this.platform.is("cordova")) {

          let noti = {
            app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
            include_player_ids: result,
            data: { foo: "bar" },
            contents: {
              en: " Nueva Sucursal "
            }
          };
          console.log('notificacion');
          window["plugins"].OneSignal.postNotification(
            noti,
            function (successResponse) {
              console.log(
                "Notification Post Success:",
                successResponse
              );
            },
            function (failedResponse: any) {
              console.log("Notification Post Failed: ", failedResponse);
            }
          );
        } else {
          console.log("Solo funciona en dispositivos");
        }
      }
    });

  }

}
