import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
// import { AngularFirestore } from '@angular/fire/firestore';
import { ReservacionesPage } from '../reservaciones/reservaciones';
@IonicPage()
@Component({
  selector: "page-evento-detalle",
  templateUrl: "evento-detalle.html"
})
export class EventoDetallePage {
  evento: any = {};
  key: null;
  sucursalID: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _cap: CargaArchivoProvider
  ) {
    this.evento.uid = this.navParams.get("uid");
    this.sucursalID = this.navParams.get("sucursalID");
    console.log("key", this.evento.uid);
    console.log("SucursalID", this.sucursalID);

    // _cap.getEvento(this.evento.key)
    //     .valueChanges().subscribe(evento=>{
    //       this.evento = evento;
    //     });

    // this.getDetails(this.evento.key);
  }

  ionViewDidLoad() {
    this.getDetails();
    console.log("ionViewDidLoad EventoDetallePage");
  }
  getDetails() {
    this._cap.getEvento(this.evento.uid).then(e => {
      this.evento = e;
      console.log("evento", e);
    });
  }

  Reservar(uid,idSucursal) {
    console.log(idSucursal);
    
    this.navCtrl.push(ReservacionesPage, {
      uid: uid,
      idSucursal: idSucursal
    });
  }
}
