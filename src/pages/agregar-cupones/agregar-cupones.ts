import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { SucursalAltaProvider } from "../../providers/sucursal-alta/sucursal-alta";
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { UserProvider } from '../../providers/user/user';
import { CuponesSucursalPage } from '../cupones-sucursal/cupones-sucursal';
import { DeviceProvider } from '../../providers/device/device';
@IonicPage()
@Component({
  selector: 'page-agregar-cupones',
  templateUrl: 'agregar-cupones.html',
})
export class AgregarCuponesPage {
    //declaracion de variables
    sucursales: any;
    myForm: FormGroup;
    sucursal: any;
    valorCupon: any;
    numCupones: any;
    condicion: any;
    fechaActual: any;
    fechaExp: any;
    users: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              public afs: AngularFirestore,
              public platform: Platform,
              public _provderUser: UserProvider,
              private sendNoti: DeviceProvider,
              public sucursalProv: SucursalAltaProvider) {

      //validar que los inputs del formulario no esten vacios
      this.myForm = this.fb.group({
        sucursal: ["", [Validators.required]],
        valorCupon: ["", [Validators.required]],
        numCupones: ["", [Validators.required]],
        // condicion: ["", [Validators.required]],
        fechaExp: ["", [Validators.required]]
      });
  }

  ionViewDidLoad() {
    //cargar fecha actual
    this.fechaActual = new Date().toJSON().split("T")[0];
    console.log('ionViewDidLoad AgregarCuponesPage',this.fechaActual);
    //ejecutar funcion para cargar info de las Sucursales en cuanto se cargue pagina
    this.cargarSucursales();
  }

  //funcion cargar info de las sucursales
  cargarSucursales(){
    this.afs.collection('sucursales').valueChanges().subscribe( s => {
      this.sucursales = s;
    });
  }

  //funcion para registrar nuevos cupones
  cuponAdd(){
    let a = '100000';
    const codigoCupon = Math.round(Math.random() * (999999 - 100000) + parseInt(a));
    //console.log("codigo",num);
    // this.sucursalProv.agregarCupon(codigoCupon,this.sucursal,this.valorCupon,this.numCupones,this.condicion,this.fechaExp,this.fechaActual);
    this.sucursalProv.agregarCupon(codigoCupon,this.sucursal.uid,this.valorCupon,this.numCupones,this.fechaExp,this.fechaActual);
    //this.navCtrl.setRoot(CuponesSucursalPage);
  //  this.getUsersPusCupones();
    // this.navCtrl.push(CuponesSucursalPage);
    this.navCtrl.setRoot(AdminMenuReservacionPage);
   
  }


  getUsersPusCupones() {
    this._provderUser.getAllUsers().subscribe(users => {

      const options = { style: 'currency', currency: 'MXN' };
      const numberFormat = new Intl.NumberFormat('es-MX', options);
      const valorcupon = numberFormat.format(this.valorCupon);
      // expected output: "$654,321.99"

      this.users = users;
      console.log('Esusuarios: ', this.users);
      this.users.forEach((users: any) => {

        if (users.playerID != undefined) {

          if (this.platform.is("cordova")) {
          
            const data = {
              topic: users.playerID,
              title: `Cupón de descuento de ${valorcupon}`,
              body: `Aprovecha el cupón para la sucursal **${this.sucursal.displayName}** utilizalo antes de ${this.fechaExp}`,
            };
            this.sendNoti.sendPushNoti(data).then((resp: any) => {
              console.log('Respuesta noti fcm', resp);
            });

          }else {
            console.log("Solo funciona en dispositivos");
          }

        }

      });
    });

  }

  behind(){
    this.navCtrl.setRoot(CuponesSucursalPage);
  }

}
