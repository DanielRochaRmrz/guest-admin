import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminMonitearReservPage } from '../admin-monitear-reserv/admin-monitear-reserv';
import { SucursalAltaProvider} from "../../providers/sucursal-alta/sucursal-alta";

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public monRes: MonitoreoReservasProvider,
    public afs: AngularFirestore, public SucProv: SucursalAltaProvider) {

    //recibe parametro de la reservacion
    this.idReservacion = this.navParams.get("idReservacion");

    //Traer datos de la reservacion seleccionada
    this.afs.collection('reservaciones').doc(this.idReservacion).valueChanges().subscribe(reservacion => {
    
      this.reservaciones = reservacion;      

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

      if (this.uidCupon == undefined) {

        this.validarCupon = 'Noexiste';

        // total de general dependiendo los productos que tenga la reservacio
        this.monRes.getProductos(this.idReservacion).subscribe(productos => {

        this.productos_total = productos;        

        // ASIGANAMOS THIS.PRODUCTOS A LA CONSULTA Y PODER HACER EL RECORRIDO EN LA VISTA

        this.productos = productos;        

        this.total_final = this.productos_total.reduce((acc, obj) => acc + obj.total, 0);

        this.propinaRe2 = this.total_final * res2[0].propina;

        this.totalPropina = this.total_final + this.propinaRe2;


        });
      } else {   
        
        this.monRes.getProductos(this.idReservacion).subscribe(productos => {          
          
          this.productos = productos;
          
          this.validarCupon = 'Existe';

         const sucursal = localStorage.getItem('uid');

          this.monRes.getCupones(sucursal, this.uidCupon).subscribe(cupones => {

            this.cupones = cupones;           

        });
        
          this.propinaRe = res2[0].totalReservacion * res2[0].propina;

          const propinaCalculo = res2[0].totalReservacion * res2[0].propina;

          this.totalPropinaCupon = res2[0].totalReservacion + propinaCalculo;       

       });

      }

    });

  }

 
  behind(){
    this.navCtrl.setRoot(AdminMonitearReservPage);
  }


}
