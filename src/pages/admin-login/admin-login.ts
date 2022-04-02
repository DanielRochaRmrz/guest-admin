import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AdminHomePage } from "../../pages/admin-home/admin-home";
import { AngularFirestore } from '@angular/fire/firestore';

@IonicPage()
@Component({
  selector: 'page-admin-login',
  templateUrl: 'admin-login.html',
})
export class AdminLoginPage {
  credentials: any = {
    email: '',
    password: ''
  }
  sucursalSesion: any;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public authProvider: AuthProvider,
    public afs: AngularFirestore) {
  }
  ionViewDidLoad() {
    // if (localStorage.getItem("isLogin") == "true") {
    //     this.navCtrl.setRoot(AdminHomePage);
    // }
  }
  
  login() {
    console.log("ESta es la funcion correcta?");

    this.authProvider.login(this.credentials).then((res: any) => {
      //     console.log(this.credentials.email);
      localStorage.setItem("emailUser", this.credentials.email);
      //     //obtener el uid de la sesion
      this.afs.collection('users', ref => ref.where('correo', '==', this.credentials.email)).valueChanges().subscribe(dataU => {
        this.sucursalSesion = dataU;
        console.log("Datos del usuario logueado", this.sucursalSesion);
        this.sucursalSesion.forEach(element => {
          localStorage.setItem("uidUser", element.uid);
          localStorage.setItem("uid", element.uid);
          localStorage.setItem("uidSucursal", element.uidSucursal);
          localStorage.getItem("isLogin") == "true"
          localStorage.setItem("type", element.type);
          console.log('id del user que inicio sesion', element.uid);
          this.navCtrl.setRoot(AdminHomePage);
        });
      })
      console.log('Res', res);
    }).catch((err) => {

      //     alert(err.message);
    });

  }

  // login() {
  //   this.authProvider.login(this.credentials).then((res: any) => {
  //     this.navCtrl.setRoot(AdminHomePage);
  //     console.log(this.credentials.email);
  //     localStorage.setItem("emailUser", this.credentials.email);
  //     //obtener el uid de la sesion
  //     this.afs.collection('users', ref => ref.where('email', '==', this.credentials.email)).valueChanges().subscribe(dataU => {
  //       this.sucursalSesion = dataU;
  //       this.sucursalSesion.forEach(element => {
  //         localStorage.setItem("uidUser", element.uid);
  //         console.log('id del user que inicio sesion', element.uid);
  //       });
  //     })
  //     console.log('Res', res);
  //   }).catch((err) => {

  //     alert(err.message);
  //   });

  // }

  // register() {
  //     this.navCtrl.push("RegisterPage")
  // }

}
