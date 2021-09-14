import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CargaCroquisProvider } from "../../providers/carga-croquis/carga-croquis";

@IonicPage()
@Component({
  selector: 'page-imagencroquis',
  templateUrl: 'imagencroquis.html',
})
export class ImagencroquisPage {

  imagenPreview : string ="";
  imagen64: string;
  idSucursal: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cap: CargaCroquisProvider,
              private camera: Camera
              ) {

                this.idSucursal = navParams.get('idSucursal');
  }


  seleccionaFoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: 2,
      saveToPhotoAlbum: false,
    }
    this.camera.getPicture(options).then((imageData) => {
 
       this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
       this.imagen64 =  imageData;       
 
    }, (err) => {
     console.log("error en selector", JSON.stringify(err) );
    });
  }

  subirFoto(){

    let archivo = {
      plano: this.imagen64,
      key: this.idSucursal

    }

    this.cap.cargarImagen(archivo);
    // this.cerrarModal();

  }

}
