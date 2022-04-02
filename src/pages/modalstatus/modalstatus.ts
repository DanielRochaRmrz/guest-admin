import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";

@IonicPage()
@Component({
  selector: 'page-modalstatus',
  templateUrl: 'modalstatus.html',
})
export class ModalstatusPage {
  idReserv: any;
  idSucursal: any;
  // idArea: any;
  // idZona: any;
  myForm: FormGroup;
  data: any = {};
  // areas: any;
  // zonas: any;
  mesas: any;
  numMesa: any;
  status: any;
  getStatus: any;
  mesa: any;

  valCreando:any;
  valModificado:any;
  valCreadaCompartida:any;
  valCompartida:any;
  valPagando:any;
  valAceptado:any;
  valTerminado:any;


  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public fb: FormBuilder,
              public _providerReserva: ReservacionProvider,
              public navParams: NavParams) {
              
    this.idReserv = this.navParams.get("idReserv");
    console.log("Id Reserv: ", this.idReserv);
    
    this.idSucursal = this.navParams.get("idSucursal");
    console.log("Id Sucursal: ", this.idSucursal);

    this.numMesa = this.navParams.get("numMesa");
    this.getStatus = this.navParams.get("status");
  
    // this.idArea = this.navParams.get("idArea");
    // console.log("Area: ", this.idArea);

    // this.idZona = this.navParams.get("idZona");
    // console.log("Zona: ", this.idZona);

              
    this.valCreando=false;
    this.valCreadaCompartida=false;
    this.valModificado=false;
    this.valCompartida=false;
    this.valPagando=false;
    this.valAceptado=false;
    this.valTerminado=false;

    if(this.getStatus == "Creando"){this.valCreando=true; }
    if(this.getStatus == "CreadaCompartida"){this.valCreadaCompartida=true;}
    if(this.getStatus == "Modificado"){this.valModificado=true; }
    if(this.getStatus == "Compartida"){this.valCompartida=true;}
    if(this.getStatus == "Pagando"){this.valPagando=true;}
    if(this.getStatus == "valAceptado"){this.valAceptado=true;}
    if(this.getStatus == "Terminado"){this.valTerminado=true;}


     console.log("Mesa seleccionada: ", this.data.mesa);
     console.log("Estatus seleccionada: ", this.data.status);

  }

  ionViewDidLoad() {
    this.getMesas(this.idSucursal);
  }

  saveData(){
    let statu=this.status;
    
    
    if(this.status==''){
      console.log('vacio');
      //statu=this.getStatus;
    }else{
    console.log('no vacio',statu);
     }
    

    let info = {
      mesa: this.mesa,
      //status: statu,
    };
    // this._providerReserva
    //   .updateStatus(this.idReserv, info)
    //   .then((respuesta: any) => {
    //     console.log("Respuesta: ", respuesta);
    //   });
      this.navCtrl.pop();
  }

  getMesas(idx) {
    this._providerReserva.getMesas2(idx).subscribe(mesas => {
      console.log("Mesas2", mesas);
      this.mesas = mesas;
    });
  }

  // loadReservacion(idx) {
  // }

  // getAreas(idx) {
  //   this._providerReserva.getAreas(idx).subscribe(areas => {
  //     console.log("areas", areas);
  //     this.areas = areas;
  //   });
  // }

  // getZonas() {
  //   const idx = this.idSucursal;
  //   const area = this.data.area;
  //   this._providerReserva.getZonas(idx, area).subscribe(zonas => {
  //     console.log("zona", zonas);
  //     this.zonas = zonas;
  //   });
  // }

  // alertConsumo() {
  //   const zona = this.data.zona;
  //     let alertMesas = this.alertCtrl.create({
  //       message:
  //         "<div text-center> Esta zona cuenta con un consumo sugerido de " +
  //         "<br><br>" +
  //         "<b>" +
  //         150 +
  //         "</b>" +
  //         "</div>",
  //       buttons: [
  //         {
  //           text: "Aceptar",
  //           handler: () => {
  //             console.log("Buy clicked");
  //           }
  //         }
  //       ]
  //     });
  //     alertMesas.present();
  // }
  closeModal() {
    this.navCtrl.pop();
}

}
