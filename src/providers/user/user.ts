import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
// import firebase from 'firebase';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Http, Headers, RequestOptions } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { ClipboardService } from 'ngx-clipboard';

// import { Clipboard } from '@ionic-native/clipboard';

@Injectable()
export class UserProvider {
  // firedata = firebase.database().ref('/users');
  db = firebase.firestore();
  users: AngularFirestoreCollection<any[]>;
  _users: Observable<any>;
  uid: any;
  codigosRp: any;
  copyCodes: any;

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public afs: AngularFirestore,
    private http: Http,
    public toastCtrl: ToastController,
    private _clipboardService: ClipboardService
    ) {
    // private clipboard: Clipboard,
    console.log("Hello UserProvider Provider");
  }

  newRegister(newuser, uidSucursal) {
    // var config = {apiKey: "AIzaSyBixlCb21nNbPSurY-Pvqu3hZB80Icl9Pk",
    // authDomain: "guestreservation-8b24b.firebaseapp.com",
    // databaseURL: "https://guestreservation-8b24b.firebaseio.com"};
    // var secondaryApp = firebase.initializeApp(config, "Secondary");
     this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then((firebaseUser) => {
      this.uid = firebaseUser.user.uid;
      console.log("User " + this.uid + " created successfully!");
      this.register(newuser, uidSucursal);
    })
  }

  register(newuser, uidSucursal) {

    // SI EL USUARIO SE REGISTRA COMO RP

    if(newuser.type == "rp"){

     // REGISTRAMOS EN LA BD AL USUARIO TIPO RP

      this.afs
      .collection("users").doc(this.uid)
      .set({
          uid: this.uid,
          displayName: newuser.name,
          correo: newuser.email,
          type: newuser.type,
          active: "true",
          uidSucursal: uidSucursal,
          photoURL: "../assets/imgs/icons/Group24.png",
        });

        // GENERAMOS UN CODIGO ALEATORIO

        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 56; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        // FECHA ACTUAL 
        let today = Date.now();

        //  CREAMOS UN REGISTRO PARA SU CODIGO A COMPARTIR 
        
        this.afs.collection('codigosRp').doc(this.uid).set({
          codigo: result,
          estatus: 1,
          fecha: today,
          uidRp: this.uid,
          uidSucursal: uidSucursal,
        });
        
    }else{

      this.afs
    .collection("users").doc(this.uid)
    .set({
        uid: this.uid,
        displayName: newuser.name,
        correo: newuser.email,
        type: newuser.type,
        active: "true",
        uidSucursal: uidSucursal,
        photoURL: "../assets/imgs/icons/Group24.png",
      });
      
    }
    
}

registerUser(sucursal, email, type, uidNewUser) {
  this.afs
  .collection("users").doc(uidNewUser)
  .set({
      uid: uidNewUser,
      displayName: sucursal,
      correo: email,
      type: type,
      active: "true",
      uidSucursal: uidNewUser,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
    });
}

  delete_user(uid) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    //
    const options = new RequestOptions({ headers: headers });
    const url = 'https://us-central1-guestreservation-8b24b.cloudfunctions.net/app/userDelete';
    const data = {
     uid:uid
    };
    this.http.post(url, data, options).subscribe(res => {
        console.log('El usuario se elimino de SDK');
    });
    // Eliminamos el usuario de la base de datos
    this.afs.collection('users').doc(uid).delete().then(() =>{
      this.mostrar_toast('Se elimino el empleado.')
      console.log('Se elimino el usuario de la base de datos');
    })
  }
  // Inhabilitar cuenta de empleado
  inhabilitar_user(uid, estatus) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    //
    const options = new RequestOptions({ headers: headers });
    const url = 'https://us-central1-guestreservation-8b24b.cloudfunctions.net/app/estatusUser';
    const data = {
     uid:uid,
     estatus:estatus
    };
    this.http.post(url, data, options).subscribe(res => {
        console.log('El usuario se inhabilito del SDK', res);
    });
    // Actualizamos al usuario de la base de datos
    this.afs.collection('users').doc(uid).update({
      active:estatus
    }).then(() =>{
      this.mostrar_toast('Se inhabilito al usuario.');
    })
  }

  idOneSignal(idx, playerID) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(idx)
        .update({
          playerID: playerID
        })
        .then(function() {
          console.log("Document written with ID: ", idx);
          resolve({ success: true });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  getAllUsers() {
    this.users = this.afs.collection<any>("users", ref =>
    ref.where("type", "==", "u"));
    this._users = this.users.valueChanges();

    return (this._users = this.users.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  actualizarCodigoRp(uid){

    let today = Date.now();

    let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 56; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

    // Actualizamos el codigo al usuario en la base de datos
    this.afs.collection('codigosRp').doc(uid).update({
      codigo: result,
      fecha: today
    }).then(() =>{
      this.mostrar_toast('Se actualizo el código del usuario.');
    });

  }

  copiarCodigo(uid){

    this.afs.collection('codigosRp', ref => ref.where("uidRp", "==", uid)).valueChanges().subscribe(data =>{

      this.copyCodes = data;

      this.copyCodes.forEach(element => {
        
        const code = element.codigo;

        this._clipboardService.copyFromContent(code);

        this.mostrar_toast('Se copio el código del RP');

      });

    });

  }

  mostrar_toast( mensaje: string  ){

    const toast = this.toastCtrl.create({
       message: mensaje,
       duration: 3000
     }).present();
   }
}