import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MenuController } from "ionic-angular";
import { AuthProvider } from '../../providers/auth/auth';
import { AdminEventoHomePage } from "../../pages/admin-evento-home/admin-evento-home";
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { AdminSucursalPerfilPage } from '../admin-sucursal-perfil/admin-sucursal-perfil';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminPerfilEmpleadoPage } from '../admin-perfil-empleado/admin-perfil-empleado';
import { AdminMonitearReservPage } from '../admin-monitear-reserv/admin-monitear-reserv';
import { AdminReservacionesCursoPage } from '../admin-reservaciones-curso/admin-reservaciones-curso';
import { AdminSucursalListPage } from '../admin-sucursal-list/admin-sucursal-list';
import { AdminLoginPage } from '../admin-login/admin-login';
import { AdminUsersGuestPage } from '../admin-users-guest/admin-users-guest';
import { CorteHistorialPage } from '../corte-historial/corte-historial';
import { AdminCroquisPage } from '../admin-croquis/admin-croquis';
import { DeviceProvider } from '../../providers/device/device';
import { AdminUsersListPage } from '../admin-users-list/admin-users-list';
import { ToolsPage } from '../tools/tools';
AdminUsersGuestPage

@IonicPage()
@Component({
  selector: "page-admin-home",
  templateUrl: "admin-home.html",
})
export class AdminHomePage {
  email: string;
  uid: string;
  uidSucursal: string;
  sucursal: any;
  sucursal2: any;
  _sucursal: any = {};
  _userEmpleado: any = {};
  reservaciones: string = "reserv";
  resSucursal: any;
  totalReservaciones: any;
  resSucursal2: any;
  totalReservaciones2: any;
  menu: any;
  formatoFecha: any;
  resultadoSucursales: any;
  totalSucursales: any;
  admins: any;
  totalEmpleados: any;
  usertipo: any;
  sucursales: any;
  resSucursalAcepCom: any;
  totalAcepCom: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public sucProv: SucursalAltaProvider,
    public firebase: AngularFireAuth,
    public _deviceProvider: DeviceProvider,
    public afs: AngularFirestore,
    public monRes: MonitoreoReservasProvider,
    public platform: Platform
  ) {
    this.sucursal2 = localStorage.getItem("uid");
    console.log("este es el uid logueado", this.sucursal2);

    //this.sucursal = this.firebase.auth.currentUser;
    console.log("Esta es la sucursal: ", this.sucursal);

      this.uid = localStorage.getItem("uid");

      this.uidSucursal = localStorage.getItem("uidSucursal");
      
      this.email = localStorage.getItem("emailUser");

      // Recibiendo información del usuario=sucursal
      this.authProvider.getUserBd(this.uid).subscribe(s => {
        
        this._sucursal = s;
    

      })

      // Traemos la información del empleado
      this.authProvider.getUserAdmins(this.uid).subscribe(s => {

        this._userEmpleado = s;
        console.log("_userEmpleado", s);
        
      })

      //obtener fecha actual
      var dateObj = new Date()

      var anio = dateObj.getFullYear().toString();

      var mes = dateObj.getMonth().toString();

      var dia = dateObj.getDate();

      var mesArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      if (dia >= 1 && dia <= 9) {

        var diaCero = '0' + dia;
        this.formatoFecha = anio + '-' + mesArray[mes] + '-' + diaCero;

      } else {

        this.formatoFecha = anio + '-' + mesArray[mes] + '-' + dia;

      }


      //reservaciones proximas estatus aceptado
      this.monRes.getReservaciones(this.uid, this.formatoFecha).subscribe(res => {

        this.resSucursal = res;

        //reservaciones  proximas estatus aceptadocompartida
        this.monRes.getReservacionesAcepCom(this.uid, this.formatoFecha).subscribe(res3 => {

          this.resSucursalAcepCom = res3;

          this.totalAcepCom = this.resSucursalAcepCom.length;

          this.totalReservaciones = this.resSucursal.length + this.totalAcepCom;

          console.log('total reservaciones acep', this.totalReservaciones);

        })

      })   
  }

  goMonitorear(menu) {

    this.navCtrl.push(AdminMonitearReservPage, { menu: menu });

  }

  goMonitorearCurso(home){

    this.navCtrl.push(AdminReservacionesCursoPage, { home: home });

  }

  ionViewDidLoad() {
    console.log('HOME PAGE');
    this.getIdSucural(this.uidSucursal);
    if (this.platform.is('cordova')) {
      this._deviceProvider.deviceInfo(this.uid, this.uidSucursal);
    }
  }
  
  async getIdSucural(uid: string) {
      const uidSucursal: any = await this.authProvider.getUserSuc(uid);
      console.log('Uid -->', uidSucursal);
  }

  goEventos(){

    this.navCtrl.push(AdminEventoHomePage);

  }

  goReservacion(){

    this.navCtrl.push(AdminMenuReservacionPage);

  }

  goPerfilEmpleado(uid) {

    this.navCtrl.push(AdminPerfilEmpleadoPage, { uid: uid });

  }

  goPerfilSucursal(uid) {

    const usuario = 'sucursal';
    this.navCtrl.push(AdminSucursalPerfilPage, { uid: uid, usuario: usuario });

  }

  goSucursal() {

    this.usertipo = 'master';
    this.navCtrl.push(AdminSucursalListPage, { usertipo: this.usertipo });

  }

  goListaUsuariosEmpleados(usuario) {
    
    this.navCtrl.push(AdminUsersGuestPage, { usuario: usuario });

    console.log(usuario);
    

  }

  goCorteHistorial(x) {
   
    if (x == null) {
      x = this.uid = localStorage.getItem("uid");
    }

    this.navCtrl.push(CorteHistorialPage, this.sucProv.selectedSucursalItem = Object.assign({}, x))
  }

  goCroquis() {
    this.navCtrl.push(AdminCroquisPage);
  }

  goTools() {
    this.navCtrl.push(ToolsPage);
  }



  salir() {

    localStorage.setItem("isLogin", 'false');

    this.navCtrl.setRoot(AdminLoginPage);

    this.menuCtrl.close();

  }


}
