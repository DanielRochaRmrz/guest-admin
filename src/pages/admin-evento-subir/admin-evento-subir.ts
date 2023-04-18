import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
//import { Camera, CameraOptions } from '@ionic-native/camera';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo"
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { DeviceProvider } from '../../providers/device/device';

@Component({
  selector: 'page-admin-evento-subir',
  templateUrl: 'admin-evento-subir.html',
})
export class AdminEventoSubirPage {

  titulo: string = "";
  cover: any;
  fecha: string = "";
  hora: string = "";
  hora_fin: string = "";
  categoria: string = "";
  lugar: string = "";
  obs: string = "";
  imagenPreview: string = "";
  imagen64: string = "";
  uid: any;
  sucursal: any;
  users: any;
  sucursales: any;
  sucursales2: any;
  ciudadSucursal: any;


  constructor(private viewCtrl: ViewController,
    public _cap: CargaArchivoProvider,
    public firebase: AngularFireAuth,
    public afs: AngularFirestore,
    public platform: Platform,
    public _provderUser: UserProvider,
    private camera: Camera,
    private sendNoti: DeviceProvider
  ) {
    // ricibiendo parametro del uid de la sucursal
    this.sucursal = this.firebase.auth.currentUser;
    if (this.sucursal != null) {
      this.uid = this.sucursal.uid;
      //Cuando es un usuario se saca el id de la sucursal ala que pertenece
      this.afs.collection('users', ref => ref.where('uid', '==', this.sucursal.uid)).valueChanges().subscribe(data => {
        this.sucursales = data;
        this.sucursales.forEach(element => {
          const tipoUser = element.type;
          const uidSucursal = element.uidSucursal;
          if (tipoUser == 'coordinacion' || tipoUser == 'rp' || tipoUser == 'capitan_mesero') {
            this.uid = uidSucursal;
            //Cuando es un usuario se saca el id de la sucursal ala que pertenece
            this.afs.collection('sucursales', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data2 => {
              this.sucursales2 = data2;
              this.sucursales2.forEach(element2 => {
                this.ciudadSucursal = element2.ciudad;
                console.log('ciudad sucursal', this.ciudadSucursal);
              });
            });
          }
        });
      });
    }
    //obtener la ciudad de la sucursal para insertarla en el Evento
    this.afs.collection('sucursales', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data2 => {
      this.sucursales2 = data2;
      this.sucursales2.forEach(element2 => {
        this.ciudadSucursal = element2.ciudad;
        console.log('ciudad sucursal', this.ciudadSucursal);
      });
    });

  }

  ionViewDidLoad() {

  }
  cerrar_modal() {
    this.viewCtrl.dismiss();
  }

  seleccionarFoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: 2,
      saveToPhotoAlbum: false,
    }
    this.camera.getPicture(options).then((imageData) => {

      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;

    }, (err) => {
      console.log("error en selector", JSON.stringify(err));
    });
  }

  crear_post(ciudad) {
    let archivo = {
      img: this.imagen64,
      titulo: this.titulo,
      cover: this.cover,
      fecha: this.fecha,
      hora: this.hora,
      hora_fin: this.hora_fin,
      categoria: this.categoria,
      lugar: this.lugar,
      obs: this.obs,
      uidSucursal: this.uid,
      ciudad: ciudad
    }
    // CARGA DE IMAGEN
    this._cap.cargar_imagen_firebase(archivo)
      .then(() => {
        //  this.getUsersPusEvento();
        this.cerrar_modal();

      });

    // ENVIO DE NOTIFICVCION
    this.getUsersPushEvento(archivo.titulo, archivo.lugar);
  }

  getUsersPushEvento(titulo, lugar) {

    this._provderUser.getAllUsers().subscribe(users => {

      this.users = users;
      console.log('Esusuarios: ', this.users);
      this.users.forEach((users) => {

        if (users.playerID != undefined) {

          if (this.platform.is("cordova")) {

            const data = {
              topic: users.playerID,
              title: "Nuevo evento en " + lugar,
              body: "Para más información visita la app Guest y busca en la sección de eventos llamado " + titulo + " para más información.",
            };
            this.sendNoti.sendPushNoti(data).then((resp: any) => {
              console.log('Respuesta noti fcm', resp);
            });

          } else {
            console.log("Solo funciona en dispositivos");
          }

        }


      })

    });

  }


}
