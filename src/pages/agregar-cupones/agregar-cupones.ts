import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { SucursalAltaProvider } from "../../providers/sucursal-alta/sucursal-alta";
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { UserProvider } from '../../providers/user/user';
import { CuponesSucursalPage } from '../cupones-sucursal/cupones-sucursal';
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
    this.sucursalProv.agregarCupon(codigoCupon,this.sucursal,this.valorCupon,this.numCupones,this.fechaExp,this.fechaActual);
    //this.navCtrl.setRoot(CuponesSucursalPage);
   this.getUsersPusCupones();
    // this.navCtrl.push(CuponesSucursalPage);
    this.navCtrl.setRoot(AdminMenuReservacionPage);
   
  }


  getUsersPusCupones() {
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
              en: " Nuevo Cupón "
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

  behind(){
    this.navCtrl.setRoot(CuponesSucursalPage);
  }

}
