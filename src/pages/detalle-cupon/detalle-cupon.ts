import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
} from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";

import { CuponesSucursalPage } from "../cupones-sucursal/cupones-sucursal";

import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { ToolsProvider } from './../../providers/tools/tools';

@IonicPage()
@Component({
  selector: "page-detalle-cupon",
  templateUrl: "detalle-cupon.html",
})
export class DetalleCuponPage {
  //declarar variables
  idSucursal: any;
  cupones: any;
  sucursales: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public afs: AngularFirestore,
    public provReser: ReservacionProvider,
    public toolsProvider: ToolsProvider
  ) {
    //recibe parametro de la reservacion
    this.idSucursal = this.navParams.get("idSucursal");
    //obtener los cupones de la  sucursal seleccionada
    this.afs
      .collection("cupones", (ref) =>
        ref.where("idSucursal", "==", this.idSucursal)
      )
      .valueChanges()
      .subscribe((c) => {
        this.cupones = c;
      });
    //info de las sucrsales
    this.afs
      .collection("sucursales")
      .valueChanges()
      .subscribe((s) => {
        this.sucursales = s;
      });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DetalleCuponPage");
    this.deleteCuponAuto();
  }

  behind() {
    this.navCtrl.setRoot(CuponesSucursalPage);
  }

  updateStatus(status, cuponUid) {
    console.log("uidCupon" + cuponUid);

    if (status == "Activo") {
      status = "Inactivo";
    } else {
      status = "Activo";
    }

    console.log("actualizar status" + status);

    let info = {
      status: status,
    };
    this.provReser.updateCuponStatus(cuponUid, info).then((respuesta: any) => {
      console.log("Respuesta: ", respuesta);
    });
  }

  async deleteCupon(cuponID: string) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando...",
    });
    loading.present();

    const checklist: any = await this.toolsProvider.deleteCupones(cuponID, 0);

    if (checklist.delete === "success") {
      loading.dismiss();
      this.showSuccessToast("Cupon eliminado con exito");
    }
  }

  async deleteCuponAuto() {
    const fechaActual = new Date().toJSON().split("T")[0];
    
    const cupones: any = await this.toolsProvider.getAllCupones();
    const cuponesData = cupones.data;
    cuponesData.forEach(async (c: any, index: number) => {
      if (c.numCupones === 0 || c.fechaExpiracion < fechaActual) {
        let loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: "Cargando...",
        });
        loading.present();
        const cuponesDelete: any = await this.toolsProvider.deleteCupones(c.uid, index);
        if (cuponesDelete.index === 0 ) {
          loading.dismiss();
          this.showSuccessToast("Cupones agotados y expirados eliminados con exito");  
        }
      }
    });
  }

  showSuccessToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: "bottom",
      cssClass: "toastSuccess",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

}
