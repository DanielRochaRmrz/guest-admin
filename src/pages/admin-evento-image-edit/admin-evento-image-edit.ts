import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';
// import { AdminEventoSubirPage } from '../admin-evento-subir/admin-evento-subir';



@IonicPage()
@Component({
  selector: 'page-admin-evento-image-edit',
  templateUrl: 'admin-evento-image-edit.html',
})
export class AdminEventoImageEditPage {
imagenPreview: string = "";
imagen64: string = "";
evento = { key: null } 
eventoUid: any;
eventoKey: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private sucProv: CargaArchivoProvider) {
    this.eventoKey = navParams.get('key');
    console.log('key', this.evento.key);    
    this.eventoUid = navParams.get('uid');
    console.log('uid',this.eventoUid);  
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminEventoImageEditPage');
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
  
  editarImagen(){
    let data={
      img: this.imagen64
    }
    this.sucProv.cargar_imagen_firebase_evento(data, this.eventoKey, this.eventoUid )
      .then(()=>this.navCtrl.pop);
      console.log('data', data);
      
  }

}
