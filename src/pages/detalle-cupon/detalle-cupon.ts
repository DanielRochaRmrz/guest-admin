import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminSucursalPerfilPage } from '../admin-sucursal-perfil/admin-sucursal-perfil';
import { CuponesSucursalPage } from '../cupones-sucursal/cupones-sucursal';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
/**
 * Generated class for the DetalleCuponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-cupon',
  templateUrl: 'detalle-cupon.html',
})
export class DetalleCuponPage {

  //declarar variables
  idSucursal: any;
  cupones: any;
  sucursales: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afs: AngularFirestore, public provReser: ReservacionProvider) {
                //recibe parametro de la reservacion
                this.idSucursal = this.navParams.get("idSucursal");
              //obtener los cupones de la  sucursal seleccionada
                this.afs.collection('cupones', ref => ref.where('idSucursal', '==', this.idSucursal)).valueChanges().subscribe( c => {
                  this.cupones = c;
                });
                //info de las sucrsales
                this.afs.collection('sucursales').valueChanges().subscribe( s => {
                  this.sucursales = s;
                });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleCuponPage');
  }

  behind(){
    this.navCtrl.setRoot(CuponesSucursalPage);
  }

  updateStatus(status, cuponUid){
    
    console.log('uidCupon'+cuponUid);

    if(status=="Activo"){
      status="Inactivo";
    }else{
      status="Activo";
    }
    
    console.log('actualizar status'+status);

    let info = {
      status: status
    };
    this.provReser
      .updateCuponStatus(cuponUid, info)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
      });

  }


}
