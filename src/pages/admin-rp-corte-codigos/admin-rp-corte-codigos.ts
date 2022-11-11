import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from "rxjs/Observable";
import * as moment from "moment";
import { map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: 'page-admin-rp-corte-codigos',
  templateUrl: 'admin-rp-corte-codigos.html',
})
export class AdminRpCorteCodigosPage {

  myForm: FormGroup;

  usuarioRP: any;
  uidSucursal: any;

  rps: any;

  fechaI: any;
  fechaF:any;

  fechaIBd: any;
  fechaFBd: any;

  codigos:any;
  codigosUsers: any;
  nombresUsua: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,  public afs: AngularFirestore) {

    this.usuarioRP = this.navParams.get("uidRp");

    this.uidSucursal = this.navParams.get("uidSucursal");

    this.myForm = this.createMyForm();

  }

  private createMyForm(){

    return this.formBuilder.group({

      FechaInicio: ['', Validators.required],

      FechaFin: ['', Validators.required]

    });

  }

  ionViewDidLoad() {

    console.log("USUARIO", this.usuarioRP);    
    console.log("uidSucursal", this.uidSucursal);  
    
    this.getRp();
    
  }

  public getRp(){

    this.afs.collection('users', ref => ref.where('uid', '==', this.usuarioRP)).valueChanges().subscribe(data => {

      this.rps = data;

      console.log("RPS", this.rps);    

    });

  }

  saveData(){

    // console.log(this.myForm.value);

    // console.log('Fecha Inicio',this.myForm.value.FechaInicio);

    // console.log('Fecha Fin',this.myForm.value.FechaFin);

    this.fechaI = this.myForm.value.FechaInicio;

    this.fechaF = this.myForm.value.FechaFin;

    // const fech = moment(this.fechaI).format("x");
    // console.log(fech);

    this.getCodigosUsados(this.fechaI, this.fechaF, this.usuarioRP);

  }
  
  getCodigosUsados(fechaI, fechaF, userRp){
   
    this.fechaIBd = moment(fechaI).format("x");

    var fechaIBd2 = Number(this.fechaIBd );

    typeof(fechaIBd2);

    // console.log("FECHAI", fechaIBd2);    

    this.fechaFBd = moment(fechaF).format("x");

    var fechaFBd2 = Number(this.fechaFBd);

    typeof(fechaFBd2);

    // console.log("FECHAf", fechaFBd2);

    // console.log("userRP", userRp);

    // this.afs.collection('contCodigosRp', ref => ref.where('uidRP', '==', userRp).where('fecha', '>=', fechaIBd2).where('fecha', '<=', fechaFBd2).where('estatus', '==', 1)).valueChanges().subscribe(data =>{

      this.afs.collection('contCodigosRp', ref => ref.where('uidRP', '==', userRp).where('fecha', '>=', fechaIBd2).where('fecha', '<=', fechaFBd2)).valueChanges().subscribe(data =>{

      this.codigos = data;

      this.codigosUsers = data;

      // this.codigosUsers.forEach(element => {

        // console.log(element.uidUser);   
        
        // let uid =  element.uidUser
        
        // this.afs.collection('users', ref => ref.where('uid', '==', uid)).valueChanges().subscribe(data =>{

          this.nombresUsua = data;

          // console.log("Nombre", this.nombresUsua);
          

        // });
        
      // });

      // console.log("CODIGOS", this.codigos);

    });

  }

  public ocultar1: boolean = false;

      accion1(){

      this.ocultar1 = !this.ocultar1;

    }

}
