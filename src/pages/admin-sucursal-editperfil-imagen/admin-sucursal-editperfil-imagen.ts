import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
// import { AdminSucursalListPage } from '../admin-sucursal-list/admin-sucursal-list';
// import { AdminSucursalEditperfilPage } from '../admin-sucursal-editperfil/admin-sucursal-editperfil';
import { AdminSucursalPerfilPage} from '../admin-sucursal-perfil/admin-sucursal-perfil';
import { Camera, CameraOptions } from '@ionic-native/camera';
@IonicPage()
@Component({
  selector: 'page-admin-sucursal-editperfil-imagen',
  templateUrl: 'admin-sucursal-editperfil-imagen.html',
})
export class AdminSucursalEditperfilImagenPage {

  imagenPreview: string = "";
  imagenPreview2: string = "";
  imagen64: string = "";
  sucursal = { uid: null }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sucProv: SucursalAltaProvider,
    private camera: Camera
  ) {
    this.sucursal.uid = navParams.get('uid');
    console.log("UID-"+this.sucursal.uid);
  }
  
  seleccionarFoto(){
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


  editarImagen(uid) {

    console.log("Editar Imagen");
    
    let archivo = {
      photoURL: this.imagen64,
      uid: uid,
    }
    this.sucProv.cargar_imagen_firebase(archivo)
      .then(() => this.navCtrl.pop());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminSucursalEditperfilImagenPage');
  }
  
    behind(){
      this.navCtrl.setRoot(AdminSucursalPerfilPage, { 'uid': this.sucursal.uid });
    }


}
