import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import {  MenuController } from "ionic-angular";
import { AdminSucursalListPage } from "../admin-sucursal-list/admin-sucursal-list";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthProvider } from "../../providers/auth/auth";
import { AdministrarReservacionesPage } from "../administrar-reservaciones/administrar-reservaciones";
import { AdminMonitearReservPage } from "../admin-monitear-reserv/admin-monitear-reserv";
import { AdminHistorialReservacionesPage } from "../admin-historial-reservaciones/admin-historial-reservaciones";
import { CuponesSucursalPage } from "../cupones-sucursal/cupones-sucursal";
import { CiudadEstablecimientoPage } from "../ciudad-establecimiento/ciudad-establecimiento";
import { AdminLoginPage } from "../admin-login/admin-login";
import { CuentasPage } from "../cuentas/cuentas";
import { AdminHomePage } from "../admin-home/admin-home";
import { AdminRpCodigoPage } from "../admin-rp-codigo/admin-rp-codigo";

@IonicPage()
@Component({
  selector: "page-admin-menu-reservacion",
  templateUrl: "admin-menu-reservacion.html",
})
export class AdminMenuReservacionPage {
  email: string;
  displayName: string;
  uids: string;
  sucursal: any;
  _sucursal: any = {};
  _userAdmin: any = {};
  _sucursalEmpleado: any = {};
  usertipo: any;

  constructor(
    public navCtrl: NavController,
    public firebase: AngularFireAuth,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider
  ) {

    this.sucursal = localStorage.getItem("uidSucursal");
    this.uids = localStorage.getItem("uidUser");

    this.authProvider.getUserBd(this.sucursal).subscribe((s) => {
      this._sucursal = s;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AdminMenuReservacionPage");
    this.getUserAdmins();
  }

  getUserAdmins() {
    // Traemos el perfil del empleado de la tabla users
    this.authProvider.getUserAdmins(this.uids).subscribe((s) => {
      this._userAdmin = s;
      //this._userAdmin= 'a7btYItzhhhtUzRphc2EWuqGzE12';
      const uidSucursal = this.sucursal;
      console.log("_userAdmin", this._userAdmin);
      // Extraemos el uid de su sucursala
      console.log("sucursal empleado", uidSucursal);
      // Traemos la informacion de la sucursal del empleado
      this.authProvider.getUserBd(uidSucursal).subscribe((s) => {

        this._sucursalEmpleado = s;
      });
    });
  }

  

  behind() {
    this.navCtrl.setRoot(AdminHomePage);
  }

  behindMaster() {
    this.navCtrl.setRoot(AdministrarReservacionesPage);
  }

  adminReservaciones() {
    this.navCtrl.push(AdministrarReservacionesPage, {
      uidSucursal: this.sucursal,
    });
  }

  goMonitorear() {
    this.navCtrl.push(AdminMonitearReservPage);
  }

  goSucursal() {
    this.usertipo = "master";
    console.log(this.usertipo);
    this.navCtrl.push(AdminSucursalListPage, { usertipo: this.usertipo });
  }

  //ir a pagina de cupones
  goCupones() {
    this.navCtrl.push(CuponesSucursalPage);
  }

  //ir a pagina de ciudades
  goCiudades() {
    this.navCtrl.push(CiudadEstablecimientoPage);
  }

  //ir a pagina de historial
  goReservacionHistorial() {
    this.navCtrl.push(AdminHistorialReservacionesPage);
  }
  
  goConsumo() {
    console.log("consumo sucUID", this.sucursal);
    var obj = [{ uid: this.sucursal }];
    this.navCtrl.push(CuentasPage, { uidSucursal: this.sucursal });
  }

  // IR A PAGINA DE CODIGO RP

  goCodigoRp() {
    this.uids = localStorage.getItem("uidUser");

    console.log(this.uids);

    this.navCtrl.push(AdminRpCodigoPage, { uidRp: this.uids });
  }

  salir() {
    localStorage.setItem("isLogin", "false");
    this.navCtrl.setRoot(AdminLoginPage);
    this.menuCtrl.close();
  }
}
