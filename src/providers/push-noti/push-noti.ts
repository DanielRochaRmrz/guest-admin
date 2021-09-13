import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';
import { UserProvider } from '../user/user';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class PushNotiProvider {
  constructor(
    public oneSignal: OneSignal,
    public platform: Platform,
    public _providerUser: UserProvider,
    public afireauth: AngularFireAuth
  ) {
    console.log("Hello PushNotiProvider Provider");
  }

  init_push_noti() {
    if (this.platform.is("cordova")) {
      this.oneSignal.startInit(
        "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        "853477386824"
      );

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.getIds().then(data => {
        // alert('Data :' + JSON.stringify(data));
        const uidUser = localStorage.getItem("uid");
        const playerID = data.userId;
        this._providerUser.idOneSignal(uidUser, playerID);
        localStorage.setItem("playerID", playerID);
      });

      this.oneSignal.endInit();
    } else {
      console.log("*** OneSignal no funciona en web ***");
    }
  }
}
