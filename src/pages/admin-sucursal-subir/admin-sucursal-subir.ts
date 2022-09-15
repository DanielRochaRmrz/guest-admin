import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Nav, ViewController, Platform } from 'ionic-angular';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProvider } from '../../providers/user/user';
import { AdminSucursalListPage } from '../admin-sucursal-list/admin-sucursal-list';
import { DeviceProvider } from '../../providers/device/device';
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
    public afs: AngularFirestore,
    public cdRef: ChangeDetectorRef,
    private sendNoti: DeviceProvider
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
      this.getUsersPusSucursal(this.credentials.sucursal);
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


  getUsersPusSucursal(nombreSucursal) {

    this._provderUser.getAllUsers().subscribe(users => {

      this.users = users;

      this.users.forEach((users) => {

        if (users.playerID != undefined) {

          if (this.platform.is("cordova")) {
          
            const data = {
              topic: users.playerID,
              title: "¡Nueva sucursal abierta!",
              body: "Para más información visita la app Guest y busca "+ nombreSucursal + " para más información.",
            };
            this.sendNoti.sendPushNoti(data).then((resp: any) => {
              console.log('Respuesta noti fcm', resp);
            });

          }else {
            console.log("Solo funciona en dispositivos");
          }

        }

      })

    });

  }

  change(value) {

    this.cdRef.detectChanges();
    this.credentials.telefono = value.length > 10 ? value.substring(0, 10) : value;
  }

}
