import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CargaArchivoCartaProvider } from '../../providers/carga-archivo-carta/carga-archivo';
import { AdminCartaHomePage } from '../admin-carta-home/admin-carta-home';


@IonicPage()
@Component({
  selector: 'page-admin-carta-image-edit',
  templateUrl: 'admin-carta-image-edit.html',
})
export class AdminCartaImageEditPage {
  imagenPreview: string = "";
  imagen64: string = "";
  carta = { key: null } 
  cartaKey: null;
  cartaUid: null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public caPr: CargaArchivoCartaProvider ) {
    this.carta.key = navParams.get('key');   
    this.cartaUid = navParams.get('uid');   

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminCartaImageEditPage');
    console.log('KEY:',this.carta.key);

  }

  seleccionar_foto(){
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

  editarImagen(key){
    let data={
      img: this.imagen64,
      key: key
    }
    this.caPr.cargar_imagen_firebase_carta(data, this.cartaUid)
      .then(()=>this.navCtrl.pop);
  }

}
