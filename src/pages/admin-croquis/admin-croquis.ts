import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AdminHomePage } from "../admin-home/admin-home";
import { CargaCroquisProvider } from '../../providers/carga-croquis/carga-croquis';

@IonicPage()
@Component({
  selector: "page-admin-croquis",
  templateUrl: "admin-croquis.html",
})
export class AdminCroquisPage {
  idSucursal: string = "";
  imgCroquis: string = "./assets/imgs/croquis.png";
  imgCroquisUpdate: string = "";
  croquis: any = [];
  imagen64: any;
  cargaImagen: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public croquisProvider: CargaCroquisProvider,
    public camera: Camera,
    public _croquisProvider: CargaCroquisProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AdminCroquisPage");
    this.idSucursal = localStorage.getItem("uidSucursal");
    this.getCroquis(this.idSucursal);
  }

  irHome() {
    this.navCtrl.setRoot(AdminHomePage);
  }

  getCroquis(idSucursal: string) {
    this.croquisProvider.getCroquis(idSucursal).subscribe((croquis: any) => {
      this.croquis = croquis;
      console.log('Croquis -->', this.croquis);
      
    });
  }

  seleccionarFoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: 2,
      saveToPhotoAlbum: false,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.imgCroquis = "data:image/jpeg;base64," + imageData;
        this.cargaImagen = 1;
        this.imagen64 = imageData;
      },
      (err) => {
        console.log("error en selector", JSON.stringify(err));
      }
    );
  }

  updateFoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: 2,
      saveToPhotoAlbum: false,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.imgCroquisUpdate = "data:image/jpeg;base64," + imageData;
        this.cargaImagen = 1;
        this.imagen64 = imageData;
      },
      (err) => {
        console.log("error en selector", JSON.stringify(err));
      }
    );
  }

  guardarFoto() {
    let imagen = {
      idSucursal: this.idSucursal,
      imagenes: this.imagen64,
    };
    this._croquisProvider.saveCroquis(imagen);
  }

  modificarFoto(key: string) {
    let imagen = {
      idSucursal: this.idSucursal,
      imagenes: this.imagen64,
    };
    this._croquisProvider.updateCroquis(key, imagen);
  }

}
