import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { AlertController } from "ionic-angular";
import { SucursalAltaProvider } from "../../providers/sucursal-alta/sucursal-alta";
import { resolve } from "url";

@Injectable()
export class GestionReservacionesProvider {
  db = firebase.firestore();
  horasCollection: AngularFirestoreCollection;
  _horas: Observable<any[]>;
  servicios: AngularFirestoreCollection;
  _servicios: Observable<any[]>;
  usuarios: AngularFirestoreCollection<any[]>;
  _usuarios: Observable<any>;
  areas: AngularFirestoreCollection<any[]>;
  _areas: Observable<any>;
  zonas: AngularFirestoreCollection<any[]>;
  _zonas: Observable<any>;
  reservacionDoc: AngularFirestoreDocument;
  reservacion: Observable<any>;

  mesasCollection: AngularFirestoreCollection;
  mesas: Observable<any[]>;
  estatusCollection: AngularFirestoreCollection;
  estatus: Observable<any[]>;
  items: any[] = [];

  Reservacion: AngularFirestoreDocument<any[]>;
  _Reservacion: Observable<any>;

  constructor(
    public aFS: AngularFirestore,
    public alertCtrl: AlertController,
    public SucProv: SucursalAltaProvider
  ) { }

  getReservaciones(idx, fecha) {
    this.servicios = this.aFS.collection<any>(
      "reservaciones",
      (ref) =>
        //  ref.where("idSucursal", "==", idx).orderBy("fechaR_","asc"));
        ref
          .where("idSucursal", "==", idx)
          .where('estatusFinal', '==', 'rsv_copletada')
          .orderBy("fechaR_", "asc")

      //.where("estatus", "array-contains", 'Creando')
    );
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getReservacionesRP(idx: string, codigoRP: string) {
    this.servicios = this.aFS.collection<any>(
      "reservaciones",
      (ref) =>
        ref
          .where("idSucursal", "==", idx)
          .where('codigoRP', '==', codigoRP)
          .where('estatusFinal', '==', 'rsv_copletada')
          .orderBy("fechaR_", "asc")
    );
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getHistorial(idx) {
    this.servicios = this.aFS.collection<any>("reservaciones", (ref) =>
      ref
        .where("idUsuario", "==", idx)
        .where("estatus", "==", "Finalizado")
        .orderBy("fechaR_", "desc")
    );
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getCompartidas(idx) {
    //let idx ="UOhor7ujhflQTOzje5D3";
    this.servicios = this.aFS.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._servicios = this.servicios.valueChanges();
    console.log("compartidas");
    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getSucursales() {
    this.servicios = this.aFS.collection<any>("sucursales");
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getUsuarios() {
    this.usuarios = this.aFS.collection<any>("users", (ref) =>
      ref.where("type", "==", "u")
    );
    this._usuarios = this.usuarios.valueChanges();

    return (this._usuarios = this.usuarios.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getReservacion(idServicio: string) {
    this.reservacionDoc = this.aFS.doc(`reservaciones/${idServicio}`);
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getReservacionDetalle(idReservacion: string) {

    return new Promise((resolve, reject) => {
      const reservaciones = this.aFS.collection(`reservaciones`).ref;
      reservaciones.where("idReservacion", "==", idReservacion).get()
        .then((data) => {
          data.forEach(resp => {
            const reservacion = resp.data();
            resolve(reservacion);
          })
        })
    })

  }

  getArea(idArea: string) {
    this.reservacionDoc = this.aFS.doc(`areas/${idArea}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getZona(idZona: string) {
    this.reservacionDoc = this.aFS.doc(`zonas/${idZona}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getMesas(idx) {
    this.mesasCollection = this.aFS.collection("mesas", (ref) =>
      ref.where("uidZona", "==", idx).orderBy("mesa")
    );
    this.mesas = this.mesasCollection.valueChanges();
    return (this.mesas = this.mesasCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener estatus de la reservacion para saber si es creada normal o creada compartida
  getEstatusReser(idx) {
    this.estatusCollection = this.aFS.collection("reservaciones", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this.estatus = this.estatusCollection.valueChanges();
    return (this.estatus = this.estatusCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getMesaReservas(idMesa, reserva) {
    // alert("Esta es la mesa: "+idMesa);
    // alert("Esta es la fecha enviada: "+ reserva.fecha);
    this.horasCollection = this.aFS.collection<any>(
      "reservaciones_mesas",
      (ref) =>
        ref
          .where("idMesa", "==", idMesa)
          .where("fecha", "==", reserva.fecha)
          .orderBy("hora", "asc")
    );
    this._horas = this.horasCollection.valueChanges();
    return (this._horas = this.horasCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
  getMyUser(idUser) {
    this.reservacionDoc = this.aFS.doc(`users/${idUser}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.reservacion = this.reservacionDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }
  // consultarMesas() {
  //   this.mesasCollection = this.aFS.collection("mesas");
  //   this.mesas = this.mesasCollection.valueChanges();
  //   return (this.mesas = this.mesasCollection
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => {
  //         return changes.map(action => {
  //           const data = action.payload.doc.data();
  //           data.id = action.payload.doc.id;
  //           return data;
  //         });
  //       })
  //     ));
  // }

  actualizaEstatus(idx, estatus) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("mesas")
        .doc(idx)
        .update({
          estatus: estatus,
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

  getOneReservación(idx) {
    this.Reservacion = this.aFS.doc<any>(`reservaciones/${idx}`);
    return (this._Reservacion = this.Reservacion.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getValorCupon(idCupon: string) {
    return new Promise((resolve, reject) => {
      this.aFS.collection('cupones').doc(idCupon).get().subscribe(cupon => {
        const data = cupon.data();
        const valorCupon = data.valorCupon;
        resolve(valorCupon);
      })
    });
  }

  getInfoContCodigosRP(codigoRP: string, idReservacion: string) {

    return new Promise((resolve, reject) => {

      let infoCodigo = this.aFS.collection('contCodigosRp').ref;

      infoCodigo.where('codigoRpUser', '==', codigoRP)
        .where('uidReservacion', '==', idReservacion)
        .get()
        .then((data) => {

          data.forEach((doc) => {

            resolve(doc.data());

          });


        }).catch((error) => {

          console.log(error);

        })

      // this.aFS.collection('contCodigosRp', (ref) => ref+.where('codigoRP', '==', codigoRP))
    })


  }

  mesaReservacion(reserva) {
    var promise = new Promise((resolve, reject) => {
      this.aFS
        .collection("reservaciones_mesas")
        .add({
          idReservacion: reserva.idReservacion,
          hora: reserva.hora,
          fecha: reserva.fecha,
          idMesa: reserva.idMesa,
          no_mesa: reserva.noMesa,
        })
        .then((reserva) => {
          console.log("Inserción exitosa: ", reserva);
          resolve({ success: true, idReservacion: reserva.id });
          this.alertCtrl
            .create({
              title: "Se reservo la mesa correctamente correctamente",
              buttons: ["Aceptar"],
            })
            .present();
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  Cancelar() {
    let mesas = JSON.parse(localStorage.getItem("mesas"));
    if (mesas != null) {
      this.items = JSON.parse(localStorage.getItem("mesas"));
      var contador = 1;
      for (let item of this.items) {
        console.log("Contador: ", contador);
        this.db
          .collection("mesas")
          .doc(item)
          .update({
            estatus: "libre",
          })
          .then(() => {
            console.log("Si lo hizo para: ", item);
          })
          .catch((err) => {
            console.log("Error no lo hizo para: ", item);
          });
        contador++;
      }
    }
    localStorage.removeItem("mesas");
  }

  Aceptar(idx, mesas) {
    localStorage.removeItem("ids");
    localStorage.removeItem("mesas");
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("reservaciones")
        .doc(idx)
        .update({
          mesas: mesas,
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

  aceptarReservacion(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "Aceptado",
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
            .create({
              title: "Has reservado con éxito",
              buttons: ["Aceptar"],
            })
            .present();

          console.log("aceptarReservacion");
          const data = {
            uid: idx,
          };
          this.SucProv.actualizarStatusRsvpAceptadaHttp(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  aceptarReservacionCompartida(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "AceptadoCompartida",
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
            .create({
              title: "Has reservado con éxito",
              buttons: ["Aceptar"],
            })
            .present();
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  cancelarReservacion(idx) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "Cancelado",
        })
        .then(() => {
          resolve(true);
          this.alertCtrl
            .create({
              title: "Has cancelado la reservación",
              buttons: ["Aceptar"],
            })
            .present();
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }
}
