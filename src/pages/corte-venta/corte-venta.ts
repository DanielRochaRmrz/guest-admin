import { Component, NgZone } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController
} from 'ionic-angular';
import { SucursalAltaProvider, Credenciales } from '../../providers/sucursal-alta/sucursal-alta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-corte-venta',
  templateUrl: 'corte-venta.html',
})
export class CorteVentaPage {
  sucursalItem: Credenciales = {};
  data: any = {};
  reservaciones: any[];
  myForm: FormGroup;
  fechaI: any;
  fechaF: any;
  contador: any;
  productos = [];
  sumatoria: number;
  comision1: number;
  comision2: number;
  propinaTotal: number;
  nombreSucursal: any;
  idSucursal: any;
  nuevoFolio: any;

  @ViewChild(Content) content: Content;


  constructor(

    public navCtrl: NavController,
    public navParams: NavParams,
    public sucProv: SucursalAltaProvider,
    public alertCtrl: AlertController,
    public _reservaciones: ReservacionProvider,
    public formBuilder: FormBuilder

  ) {

    this.myForm = this.createMyForm();

  }


  ionViewDidLoad() {

    this.nombreSucursal = this.sucProv.selectedSucursalItem.displayName;
    this.idSucursal = this.sucProv.selectedSucursalItem.uid;
    this.getIdLast(this.idSucursal);
    this.contador = 0;
    this.sumatoria = 0;
    //this.getReservaciones(this.sucProv.selectedSucursalItem.uid);
  }


  public ocultar1: boolean = false;
  accion1() {
    this.ocultar1 = !this.ocultar1;
  }

  private createMyForm() {
    return this.formBuilder.group({
      FechaInicio: ['', Validators.required],
      FechaFin: ['', Validators.required]
    });
  }
  saveData() {

    this.fechaI = this.myForm.value.FechaInicio;
    this.fechaF = this.myForm.value.FechaFin;

    this.getReservaciones(this.idSucursal, this.fechaI, this.fechaF);

  }

   getReservaciones(idx, fechaI, fechaF) {

    this._reservaciones.getReservaciones(idx, fechaI, fechaF).then((data: any) => {

      const idReservacionArray = [];

      data.forEach(element => {

        idReservacionArray.push(element.idReservacion);

      });
      this.getTotalesReservacion(idReservacionArray);

    })
  }
  async getTotalesReservacion(idReservacionArray:any[]){
    
    const totalesC = await this._reservaciones.getTotalesReservaciones(idReservacionArray);

    console.log('totalesC', totalesC);
    

  }

  getIdLast(idx) {
    let x = 0;
    this._reservaciones.getIdLast(idx).subscribe(res => {
      console.log("Este es el resultado de corte: ", res);
      res.forEach(function (value) {
        console.log('ultimo folio', value.folio);
        x = value.folio + 1;
      });
      this.nuevoFolio = x;
      console.log('nuevo folio: ', this.nuevoFolio);
    });

  }

  guardarCorte() {

    this._reservaciones.addCorte(this.fechaI, this.fechaF, this.comision1, this.comision2, this.sumatoria, this.idSucursal, this.propinaTotal, this.nuevoFolio);

    this.presentAlert();
  }

  suma(x) {
    //this.contador=this.contador+1;
    //console.log(this.contador);
    console.log('idReservacion funcion', x);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Corte guardado con exito',
      subTitle: '',
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
