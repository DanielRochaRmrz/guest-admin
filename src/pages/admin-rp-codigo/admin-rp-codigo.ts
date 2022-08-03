import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
} from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { UserProvider } from "../../providers/user/user";
import { AdminRpCorteCodigosPage } from "../admin-rp-corte-codigos/admin-rp-corte-codigos";
import { AdminMenuReservacionPage } from "../admin-menu-reservacion/admin-menu-reservacion";

@IonicPage()
@Component({
  selector: "page-admin-rp-codigo",
  templateUrl: "admin-rp-codigo.html",
})
export class AdminRpCodigoPage {
  uidRp: any;
  codigos: any;
  admins: any[];
  empleados: any[];
  usuario: any;
  sucursal: any;
  sucursales: any;
  uid: any;
  codigosRps: any;
  copyCode: any;
  tpye: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public firebase: AngularFireAuth,
    public actionSheet: ActionSheetController,
    public _up: UserProvider
  ) {
    // private _clipboardService: ClipboardService
    this.usuario = this.navParams.get("uidRp");

    // console.log("tipo de usuario", this.usuario);

    this.sucursal = this.firebase.auth.currentUser;

    if (this.sucursal != null) {
      this.uid = this.sucursal.uid;

      //Cuando es un usuario se saca el id de la sucursal a la que pertenece

      this.afs
        .collection("users", (ref) => ref.where("uid", "==", this.uid))
        .valueChanges()
        .subscribe((data) => {
          this.sucursales = data;

          // console.log("sucursales", this.sucursales);

          this.sucursales.forEach((element) => {
            const uidSucursal = element.uidSucursal;

            this.tpye = element.type;

            this.afs
              .collection("users", (ref) =>
                ref
                  .where("uidSucursal", "==", uidSucursal)
                  .where("type", "==", "rp")
              )

              .valueChanges()
              .subscribe((u) => {
                this.admins = u;

                this.empleados = u;

                console.log("this.admins", this.admins);
              });
          });
        });
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AdminRpCodigoPage');

    this.uidRp = this.navParams.get("uidRp");

    this.getCodigoRp(this.uidRp);

    this.getCodigosRPs();

    // console.log(this.uidRp);
  }

  getCodigoRp(uidRP) {
    this.afs
      .collection("codigosRp", (ref) =>
        ref.where("uidRp", "==", uidRP).where("estatus", "==", 1)
      )
      .valueChanges()
      .subscribe((data) => {
        this.codigos = data;

        console.log("RP", this.codigos);
      });
  }

  getCodigosRPs() {
    var uidSucursal = this.usuario;

    this.afs
      .collection("codigosRp", (ref) =>
        ref.where("uidSucursal", "==", uidSucursal)
      )
      .valueChanges()
      .subscribe((data) => {
        this.codigosRps = data;

        // console.log("RP", this.codigosRps);
      });
  }

  initializeItems(): void {
    this.admins = this.empleados;
  }

  getItems(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }
    this.admins = this.admins.filter((admin) => {
      if (admin.displayName && searchTerm) {
        if (
          admin.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        ) {
          return true;
        }

        return false;
      }
    });
  }

  selectUsuario(uid, active) {
    var uidSucursal = this.usuario;

    this.actionSheet
      .create({
        title: "Acciones",

        buttons: [
          {
            text: "Copiar código",

            role: "destructive",

            handler: () => {
              this._up.copiarCodigo(uid);
            },
          },

          {
            text: "Actualizar código RP",

            role: "destructive",

            handler: () => {
              if (confirm("Actualizar el código de este usuario")) {
                //
                if (active == "true") {
                  this._up.actualizarCodigoRp(uid);

                  console.log("Se ha cambiado");
                } else if (active == "false") {
                  console.log("No se cambio");
                }
              }
            },
          },

          {
            text: "Corte de códigos",

            role: "destructive",

            handler: () => {
              this.navCtrl.push(AdminRpCorteCodigosPage, {
                uidRp: uid,
                uidSucursal: uidSucursal,
              });

              // console.log("SUCURSAL", uidSucursal);
              // console.log("UID RP", uid);
            },
          },

          {
            text: "Cancelar",

            role: "cancel",

            handler: () => {
              console.log("Cancelo");
            },
          },
        ],
      })
      .present();
  }

  copyText() {
    var uidSucursal = this.usuario;

    this._up.copiarCodigo(uidSucursal);
  }

  behind() {
    this.navCtrl.setRoot(AdminMenuReservacionPage);
  }
}
