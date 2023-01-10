import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminMonitearReservPage } from '../admin-monitear-reserv/admin-monitear-reserv';
import { SucursalAltaProvider } from "../../providers/sucursal-alta/sucursal-alta";
import { AdminMenuReservacionPage } from '../admin-menu-reservacion/admin-menu-reservacion';
import { CorteReservacionesHistorialPage } from '../corte-reservaciones-historial/corte-reservaciones-historial';
import { GestionReservacionesProvider } from '../../providers/gestion-reservaciones/gestion-reservaciones';

@IonicPage()
@Component({
  selector: 'page-admin-reservacion-detalle',
  templateUrl: 'admin-reservacion-detalle.html',
})
export class AdminReservacionDetallePage {

  idReservacion: any;
  reservaciones: any = {};
  productos_total: any;
  total_final: any;
  cuentasCompartidas: any;
  infoReserCom: any;
  infoReserCom_num: any;
  infoReservacion: any;
  validarCupon: any;
  propinaRe: any;
  propinaRe2: any;
  totalPropinaCupon: any;
  totalPropina: any;
  productos: any;
  uidCupon: any;
  cupones: any;
  valorCupon: any;
  iva: any;
  comision: any;
  totalNeto: any;
  subTotal: any;
  usuarioMaster: any;
  uidRp: string;
  infoCodigoRP: any;
  reembolso: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public monRes: MonitoreoReservasProvider,
    public afs: AngularFirestore, public SucProv: SucursalAltaProvider, private viewCtrl: ViewController, public _gestionReser: GestionReservacionesProvider,) {

    //recibe parametro de la reservacion
    this.idReservacion = this.navParams.get("idReservacion");

    // recibe de la vista de reembolsos
    this.reembolso = this.navParams.get("reem");

    if(this.reembolso == "Reembolso"){

      this.reembolso = "Reem"

    }else{
      
      this.reembolso = "null";
    }


    if (this.navParams.get("typeUser")) {

      this.usuarioMaster = this.navParams.get("typeUser");

    } else {

      this.usuarioMaster = null;

    }

    //Traer datos de la reservacion seleccionada
    this.afs.collection('reservaciones').doc(this.idReservacion).valueChanges().subscribe(reservacion => {

      this.reservaciones = reservacion;

      this.getInfoCodigoRP(this.reservaciones.codigoRP, this.reservaciones.idReservacion);      

    });

    //ver si la reservacioon existe en las compartidas
    this.monRes.getReserCom(this.idReservacion).subscribe(res11 => {

      this.infoReserCom = res11;

      // ASIGANAMOS LA VARIABLE this.cuentasCompartidas A LA CONSULTA PARA LA VISTA

      this.cuentasCompartidas = res11;

      console.log("this.cuentasCompartidas -->", this.cuentasCompartidas);


      this.infoReserCom_num = this.infoReserCom.length;


    });

    //sacar totales con propina y cupon

    this.monRes.getInfo(this.idReservacion).subscribe(res2 => {

      this.infoReservacion = res2;

      this.uidCupon = res2[0].uidCupon;

      // console.log("TABLA CUPON", res2);


      if (this.uidCupon == undefined) {

        this.validarCupon = 'Noexiste';

        // total de general dependiendo los productos que tenga la reservacio
        this.monRes.getProductos(this.idReservacion).subscribe(productos => {

          this.productos_total = productos;

          // console.log("PRODUCTOS TABLA", this.productos_total);

          // ASIGANAMOS THIS.PRODUCTOS A LA CONSULTA Y PODER HACER EL RECORRIDO EN LA VISTA

          this.productos = productos;

          this.total_final = this.productos_total.reduce((acc, obj) => acc + obj.total, 0);

          this.comision = this.total_final * .059;

          this.subTotal = this.comision + this.total_final;

          this.iva = this.subTotal * .16;

          this.propinaRe2 = this.total_final * res2[0].propina;

          this.totalNeto = this.subTotal + this.iva + this.propinaRe2;

        });
      } else {

        this.monRes.getProductos(this.idReservacion).subscribe(productos => {

          this.productos = productos;

          this.validarCupon = 'Existe';

          const sucursal = localStorage.getItem('uid');

          this.monRes.getCupones(sucursal, this.uidCupon).subscribe(cupones => {

            this.cupones = cupones;

            this.valorCupon = this.cupones[0].valorCupon;

          });

          this.comision = res2[0].totalReservacion * .059;

          this.subTotal = this.comision + res2[0].totalReservacion;

          this.iva = this.subTotal * .16;

          this.propinaRe = this.subTotal * res2[0].propina;

          this.totalNeto = this.subTotal + this.iva + this.propinaRe;


        });

      }

    });

  }

  async getInfoCodigoRP(codigoRP:string, idReservacion:string){

    this.infoCodigoRP = await this._gestionReser.getInfoContCodigosRP(codigoRP, idReservacion);

    this.uidRp = this.infoCodigoRP.uidRP;

    console.log('infoCodigoRP--->', this.infoCodigoRP.uidRP);    

  }


  behind() {

    const goMenuHistorial = this.navParams.get("page");

    if (goMenuHistorial) {

      this.navCtrl.setRoot(goMenuHistorial);

    } else {

      this.navCtrl.setRoot(AdminMonitearReservPage);
    }
  }

  cerrar_modal() {
    this.viewCtrl.dismiss();
  }


}
