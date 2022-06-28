import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "ionic-angular";
import * as firebase from "firebase";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";

@Injectable()
export class CargaCroquisProvider {
  db = firebase.firestore();
  croquisCol: AngularFirestoreCollection<any[]>;
  croquisObs: Observable<any>;
  loadingImg: any;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public afDB: AngularFirestore
  ) {
    console.log("Hello CargaCroquisProvider Provider");
  }

  cargarImagen(archivo: ArchivoSubir) {
    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast("Cargando...");

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(`croquis/${nombreArchivo}`)
        .putString(archivo.plano, "base64", { contentType: "image/jpeg" });

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //Saber el % de Mbs se han subido
        (error) => {
          //Manejo de error
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          this.mostrarToast(JSON.stringify(error));
          reject();
        },
        () => {
          // TODO bien
          console.log("Archivo subido");
          this.mostrarToast("El croquis se agrego correctamente");

          //Inician mis pruebas

          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((urlImage) => {
              this.actualizaImagen(archivo.key, urlImage);
              // this.mostrarToast('URL:' + urlImage);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    });

    return promesa;
  }

  actualizaImagen(key, url: string) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("sucursales")
        .doc(key)
        .update({
          plano: url,
        })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  getCroquis(idSucursal: string) {
    console.log(idSucursal);
    this.croquisCol = this.afDB.collection<any>("croquis_img", (ref) =>
      ref.where("idSucursal", "==", idSucursal)
    );
    this.croquisObs = this.croquisCol.valueChanges();
    return (this.croquisObs = this.croquisCol.snapshotChanges().pipe(
      map((cambios) => {
        return cambios.map((data) => {
          const croquis = data.payload.doc.data() as any;
          return croquis;
        });
      })
    ));
  }

  saveCroquis(imagen: any) {
    new Promise((resolve, reject) => {
      this.loadImage();
      let storeRef = firebase.storage().ref();
      let photoURL: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(`croquis/${photoURL}.jpg`)
        .putString(imagen.imagenes, "base64", { contentType: "image/jpeg" });
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress + "% done");
        }, //saber el % cuantos se han subido
        (error) => {
          //manejo
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          reject();
        },
        () => {
          // TODO BIEN!
          console.log("Archivo subido");
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((urlImage) => {
              let idImage = imagen.idSucursal;
              let fileName = uploadTask.snapshot.ref.name;
              console.log('FileName -->', fileName);
              this.saveUrlCroquis(idImage, urlImage);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    });
  }

  updateCroquis(imagen: any) {
    new Promise((resolve, reject) => {
      this.loadImage();
      let storeRef = firebase.storage().ref();
      let photoURL: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(`croquis/${photoURL}.jpg`)
        .putString(imagen.imagenes, "base64", { contentType: "image/jpeg" });
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress + "% done");
        }, //saber el % cuantos se han subido
        (error) => {
          //manejo
          console.log("Error en la carga");
          console.log(JSON.stringify(error));
          reject();
        },
        () => {
          // TODO BIEN!
          console.log("Archivo subido");
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((urlImage) => {
              let idImage = imagen.idSucursal;
              this.updateUrlCroquis(idImage, urlImage);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    });
  }

  public saveUrlCroquis(uid: string, url: string) {
    let croquis_img = {
      idSucursal: uid,
      imagenes: url,
    };
    this.afDB
      .collection("croquis_img")
      .add(croquis_img)
      .then((reason: any) => {
        console.log("Reason -->", reason);
        this.loadingImg.dismiss();
        this.mostrarToast("Croquis agregado correctamente");
      });
  }

  public updateUrlCroquis(uid: string, url: string) {
    let croquis_img = {
      idSucursal: uid,
      imagenes: url,
    };
    this.afDB
      .collection("croquis_img").doc().update
      (croquis_img)
      .then((reason: any) => {
        console.log("Reason -->", reason);
        this.loadingImg.dismiss();
        this.mostrarToast("Croquis agregado correctamente");
      });
  }

  loadImage() {
    this.loadingImg = this.loadingCtrl.create({
      spinner: "crescent",
      content: "Cargando croquis...",
    });
    this.loadingImg.present();
  }

  mostrarToast(mensaje: string) {
    this.toastCtrl
      .create({
        message: mensaje,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK",
      })
      .present();
  }
}

interface ArchivoSubir {
  plano: string;
  key?: string;
}
