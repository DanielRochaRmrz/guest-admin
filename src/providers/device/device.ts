import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { Device } from "@ionic-native/device";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";
import { Platform } from "ionic-angular";

@Injectable()
export class DeviceProvider {
  apiURL: string = "https://fcmpush-115c1.web.app";

  constructor(
    public http: HttpClient,
    private device: Device,
    public db: AngularFirestore,
    private platform: Platform
  ) {}

  async deviceInfo(uid: string, uidSucursal: string, playersId: any) {
    console.log("playersId", typeof playersId);

    if (typeof playersId === "string") {
      const userInfoArr = [] 
      const userInfo = [{
        playerID: String(this.device.uuid),
        uidUser: uid,
      }];

      userInfoArr.push(userInfo);

      this.updatePlayerID(userInfo, uidSucursal);

      const authStatus = await FCM.requestPushPermission();
      console.log("authStatus -->", authStatus);
      if (authStatus == true) {
        FCM.subscribeToTopic(String(this.device.uuid));

        if (this.platform.is("ios")) {
          let fcmToken = await FCM.getAPNSToken();
          console.log("fcmToken -->", fcmToken);
          localStorage.setItem("tokenPush", fcmToken);
        }

        if (this.platform.is("android")) {
          let fcmToken = await FCM.getToken();
          console.log("fcmToken -->", fcmToken);
          localStorage.setItem("tokenPush", fcmToken);
        }

        FCM.onNotification().subscribe(
          (data) => {
            if (data.wasTapped) {
              //cuando nuestra app esta en segundo plano
              console.log("Estamos en segundo plano", JSON.stringify(data));
            } else {
              //ocurre cuando nuestra app esta en primer plano
              console.log("Estamos en primer plano", JSON.stringify(data));
            }
          },
          (error) => {
            console.log("Error -->", error);
          }
        );
      }
    } else {
      // Consultar si el uid de usuario ya existe en el arreglo
      const existUidUser = playersId.map((d: any) => d.uidUser).includes(uid);

      console.log("existUidUser -->", existUidUser);

      if (existUidUser) {
        // Consultar el indice del uid usuario
        const getUidUserIndex = playersId
          .map((d: any) => d.uidUser)
          .indexOf(uid);

        console.log("getUidUserIndex -->", getUidUserIndex);

        const playerID = String(this.device.uuid);
        localStorage.setItem("playerID", playerID);
        playersId[getUidUserIndex].playerID = playerID;
        this.updatePlayerID(playersId, uidSucursal);

        const authStatus = await FCM.requestPushPermission();
        console.log("authStatus -->", authStatus);
        if (authStatus == true) {
          FCM.subscribeToTopic(playerID);

          if (this.platform.is("ios")) {
            let fcmToken = await FCM.getAPNSToken();
            console.log("fcmToken -->", fcmToken);
            localStorage.setItem("tokenPush", fcmToken);
          }

          if (this.platform.is("android")) {
            let fcmToken = await FCM.getToken();
            console.log("fcmToken -->", fcmToken);
            localStorage.setItem("tokenPush", fcmToken);
          }

          FCM.onNotification().subscribe(
            (data) => {
              if (data.wasTapped) {
                //cuando nuestra app esta en segundo plano
                console.log("Estamos en segundo plano", JSON.stringify(data));
              } else {
                //ocurre cuando nuestra app esta en primer plano
                console.log("Estamos en primer plano", JSON.stringify(data));
              }
            },
            (error) => {
              console.log("Error -->", error);
            }
          );
        }
      } else {
        const userInfo = {
          playerID: String(this.device.uuid),
          uidUser: uid,
        };

        playersId.push(userInfo);

        this.updatePlayerID(playersId, uidSucursal);

        const authStatus = await FCM.requestPushPermission();
        console.log("authStatus -->", authStatus);
        if (authStatus == true) {
          FCM.subscribeToTopic(String(this.device.uuid));

          if (this.platform.is("ios")) {
            let fcmToken = await FCM.getAPNSToken();
            console.log("fcmToken -->", fcmToken);
            localStorage.setItem("tokenPush", fcmToken);
          }

          if (this.platform.is("android")) {
            let fcmToken = await FCM.getToken();
            console.log("fcmToken -->", fcmToken);
            localStorage.setItem("tokenPush", fcmToken);
          }

          FCM.onNotification().subscribe(
            (data) => {
              if (data.wasTapped) {
                //cuando nuestra app esta en segundo plano
                console.log("Estamos en segundo plano", JSON.stringify(data));
              } else {
                //ocurre cuando nuestra app esta en primer plano
                console.log("Estamos en primer plano", JSON.stringify(data));
              }
            },
            (error) => {
              console.log("Error -->", error);
            }
          );
        }
      }
    }
  }

  updatePlayerID(playerID: any, uidSucursal: string) {
    this.db
      .collection("sucursales")
      .doc(uidSucursal)
      .update({
        playerID: playerID,
      })
      .then(() => {
        console.log("Se actualizo");
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  sendPushNoti(data: any) {
    return new Promise((resolve, rejects) => {
      const noti = {
        topic: data.topic,
        title: data.title,
        body: data.body,
      };
      const url = `${this.apiURL}/fcm`;
      this.http.post(url, noti).subscribe((res: any) => {
        resolve(res);
      });
    });
  }
}
