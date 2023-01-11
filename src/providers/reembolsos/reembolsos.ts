import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { DeviceProvider } from '../device/device';
import * as firebase from "firebase/app";

@Injectable()
export class ReembolsosProvider {

  db = firebase.firestore();

  constructor(private sendNoti: DeviceProvider, public afs: AngularFirestore, public platform: Platform,) {

  }

  reembolsarReservacion(idPlayerUser, idReservacion) {

    
    if (idPlayerUser != undefined) {

      if (this.platform.is("cordova")) {

        this.db.collection("reservaciones").doc(idReservacion).update({ estatus: "Reembolsado"});

        const data = {
          topic: idPlayerUser,
          title: "Buenas noticias",
          body: "Hemos reembolsado el dinero de la ultima reservación que hiciste en Guest, te esperamos pronto.",
        };
        this.sendNoti.sendPushNoti(data).then((resp: any) => {
          console.log('Respuesta noti fcm', resp);
        });

      } else {
        console.log("Solo funciona en dispositivos");
      }

    }

  }

}
