import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import * as moment from "moment";

@Injectable()
export class ReservacionProvider {
  fechaI: any;
  fechaF: any;
  reservaciones: AngularFirestoreCollection<any[]>;
  _reservaciones: Observable<any>;

  areas: AngularFirestoreCollection<any[]>;
  _areas: Observable<any>;

  zonas: AngularFirestoreCollection<any[]>;
  _zonas: Observable<any>;

  reservacion: AngularFirestoreDocument<any[]>;
  _reservacion: Observable<any>;

  zona: AngularFirestoreDocument<any[]>;
  _zona: Observable<any>;

  num: AngularFirestoreCollection<any[]>;
  _num: Observable<any>;

  constructor(public af: AngularFirestore) {
    console.log("Hello ReservacionProvider Provider");
  }

  public getAreas(idx) {
    // return this.afiredatabase.object("sucursales/" + uid);
    console.log("idSucursal", idx);
    this.areas = this.af.collection<any>("areas", (ref) =>
      ref.where("uidSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getZonas(idx, area) {
    // return this.afiredatabase.object("sucursales/" + uid);
    console.log("idSucursal", idx);
    this.areas = this.af.collection<any>("zonas", (ref) =>
      ref.where("uidSucursal", "==", idx).where("uidArea", "==", area)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getMesas(idx, area, zona) {
    // return this.afiredatabase.object("sucursales/" + uid);
    console.log("idSucursal", idx);
    this.areas = this.af.collection<any>("mesas", (ref) =>
      ref
        .where("uidSucursal", "==", idx)
        .where("uidArea", "==", area)
        .where("uidZona", "==", zona)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
  public getMesas2(idx) {
    // return this.afiredatabase.object("sucursales/" + uid);
    console.log("getMesas2 idSucursal", idx);
    this.areas = this.af.collection<any>("mesas", (ref) =>
      ref.where("uidSucursal", "==", idx).orderBy("noMesa", "asc")
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getImagenSucursal(identificador: any) {
    console.log("Servicio getImagenSucursal inicio", identificador);

    this.areas = this.af.collection<any>("croquis_img", (ref) =>
      ref
        .where("idSucursal", "==", identificador)
        .orderBy("fecha_creado", "asc")
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
    //console.log('Servicio getImagenSucursal Fin', identificador);
  }

  public saveReservacion(reservacion) {
    return new Promise((resolve, reject) => {
      const fecha = moment(reservacion.fecha).format("x");
      const hora = moment(reservacion.hora, "HH:mm").format("hh:mm a");
      const idUsuario = localStorage.getItem("uid");
      console.log("Evento: ", reservacion.idevento);
      this.af
        .collection("reservaciones")
        .add({
          numPersonas: reservacion.numPersonas,
          hora: hora,
          fechaR: reservacion.fecha,
          fechaR_: fecha,
          estatus: "Creando",
          idArea: reservacion.area,
          idZona: reservacion.zona,
          idSucursal: reservacion.idSucursal,
          idevento: reservacion.idevento,
          idUsuario: idUsuario,
        })
        .then((reserva) => {
          console.log("Reservación exitosa: ", reserva.id);
          this.updateReservaId(reserva.id);
          resolve({ success: true, idReservacion: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateReservacion(idx, reservacion) {
    return new Promise((resolve, reject) => {
      const fecha = moment(reservacion.fecha).format("x");
      const hora = moment(reservacion.hora, "HH:mm").format("hh:mm a");
      const idUsuario = localStorage.getItem("uid");
      console.log("Evento: ", reservacion.idevento);
      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          numPersonas: reservacion.numPersonas,
          hora: hora,
          fechaR: reservacion.fecha,
          fechaR_: fecha,
          estatus: "Creando",
          idArea: reservacion.area,
          idZona: reservacion.zona,
          idSucursal: reservacion.idSucursal,
          idevento: reservacion.idevento,
          idUsuario: idUsuario,
        })
        .then((reserva) => {
          console.log("Reservación actualizada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public addProducto(producto) {
    return new Promise((resolve, reject) => {
      console.log("Evento: ");
      this.af
        .collection("productos")
        .add({
          cantidad: producto.cantidad,
          idProducto: producto.idProducto,
          idReservacion: producto.idReservacion,
        })
        .then((reserva) => {
          console.log("Producto exitoso: ", reserva.id);
          this.updateReservaId(reserva.id);
          resolve({ success: true, idReservacion: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public cancelarStatus(id, info) {
    return new Promise((resolve, reject) => {
      //const idUsuario = localStorage.getItem("uid");
      this.af
        .collection("reservaciones")
        .doc(id)
        .update({
          estatus: info.status,
          motivoCancelacion: info.motivo,
        })
        .then((reserva) => {
          console.log("Reservación cancelada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public borrarRegistroUsuarioCodigoRP(uidReservacion) {
    this.af
      .collection("contCodigosRp")
      .doc(uidReservacion)
      .delete()
      .then(() => {
        console.log("Se borro regsitro en contCodigosRp");
      })
      .catch(function (error) {
        console.log("No se pudo en contCodigosRp");
      });
  }

  public addCorte(
    fechaI,
    fechaF,
    comision1,
    comision2,
    suma,
    idSucursal,
    propina,
    folio
  ) {
    console.log("****Provider add****");
    console.log("fechaI", fechaI);
    console.log("fechaF", fechaF);
    console.log("comision1", comision1);
    console.log("comision2", comision2);
    console.log("suma", suma);
    console.log("idSucursal", idSucursal);

    return new Promise((resolve, reject) => {
      this.af
        .collection("corte")
        .add({
          fecha_Inicio: fechaI,
          fecha_Fin: fechaF,
          comision1: comision1,
          comision2: comision2,
          totalCorte: suma,
          idSucursal: idSucursal,
          propina: propina,
          folio: folio,
        })
        .then((reserva) => {
          console.log("corteExitoso:", idSucursal);
          resolve({ success: true, idSucursal: idSucursal });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public getCortes(idx) {
    //return this.afiredatabase.object("sucursales/" + uid);
    console.log("idSucursal provider", idx);
    this.areas = this.af.collection<any>("corte", (ref) =>
      ref.where("idSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  delete_corte(idCorte) {
    this.af
      .collection("corte")
      .doc(idCorte)
      .delete()
      .then(function () {})
      .catch(function (error) {});
  }

  public updateReservaId(ID) {
    this.af
      .collection("reservaciones")
      .doc(ID)
      .update({
        idReservacion: ID,
      })
      .then(() => {})
      .catch(() => {});
  }

  public updateCuponStatus(uid, info) {
    console.log("provider cupon" + info.status);
    var promise = new Promise((resolve, reject) => {
      this.af
        .collection("cupones")
        .doc(uid)
        .update({
          estatus: info.status,
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

  public getReservacion(idx) {
    this.reservacion = this.af.doc<any>(`reservaciones/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._reservacion = this.reservacion.snapshotChanges().pipe(
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

  public getReservaciones(idx: any, fecha1: String, fecha2: String) {
    this.fechaI = fecha1;

    this.fechaF = fecha2;

    const fechI = moment(this.fechaI).format("x");

    const fechF = moment(this.fechaF).format("x");

    this.reservaciones = this.af.collection<any>("reservaciones", (ref) =>
      ref
        .where("idSucursal", "==", idx)
        .where("estatus", "==", "Pagado")
        .where("fechaR_", ">=", fechI)
        .where("fechaR_", "<=", fechF)
    );
    this._reservaciones = this.reservaciones.valueChanges();
    return (this._reservaciones = this.reservaciones.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getIdLast(idx: any) {
    this.num = this.af.collection<any>("corte", (ref) =>
      ref.where("idSucursal", "==", idx).orderBy("folio", "desc").limit(1)
    );
    this._num = this.num.valueChanges();
    return (this._num = this.num.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;

          return data;
        });
      })
    ));
  }

  public getProductos(idx) {
    //return this.afiredatabase.object("sucursales/" + uid);
    console.log("idSucursal", idx);
    this.areas = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getZona(idx) {
    this.zona = this.af.doc<any>(`zonas/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._zona = this.zona.snapshotChanges().pipe(
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

  deleteReservacion(idReservacion) {
    this.af
      .collection("reservaciones")
      .doc(idReservacion)
      .delete()
      .then(function () {
        // console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        // console.error("Error removing document: ", error);
      });

    const pedidosProductServ = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idReservacion)
    );

    pedidosProductServ.get().subscribe(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  }

  public getZonas2(idx) {
    console.log("idSucursal", idx);
    this.areas = this.af.collection<any>("zonas", (ref) =>
      ref.where("uidSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public updateZona(id, info) {
    console.log("updateZona", id);
    console.log("Zona: ", info.zona);
    return new Promise((resolve, reject) => {
      //const idUsuario = localStorage.getItem("uid");
      this.af
        .collection("reservaciones")
        .doc(id)
        .update({
          idZona: info.zona,
        })
        .then((reserva) => {
          console.log("Reservación-zona actualizad: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateStatus(id: string, mesa: string) {
    console.log("updateStatusServicio", id);
    //console.log("Status: ", info.status);
    console.log("Mesa: ", mesa);
    return new Promise((resolve, reject) => {
      //const idUsuario = localStorage.getItem("uid");
      this.af
        .collection("reservaciones")
        .doc(id)
        .update({
          numMesa: mesa,
        })
        .then((reserva) => {
          console.log("Reservación actualizad: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public ValidarMesa(fechaR: string, idSucursal: string, mesa: string) {
    return new Promise((resolve, reject) => {
      let reservaciones = this.af.collection("reservaciones").ref;
      reservaciones
        .where("idSucursal", "==", idSucursal)
        .where("fechaR", "==", fechaR)
        .where("numMesa", "==", mesa)
        .get()
        .then((data) => {
          console.log("Data mesa -->", data.empty);
          resolve(data.empty);
        })
        .catch((error) => {
          console.log("Error en la consulta -->", error);
        });
    });
  }

  public getCodigoRP(uidRp: string) {
    return new Promise((resolve, reject) => {
      let reservaciones = this.af.collection("codigosRp").ref;
      reservaciones
        .where("uidRp", "==", uidRp)
        .where("estatus", "==", 1)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            resolve(doc.data().codigo);
          });
        })
        .catch((error) => {
          console.log("Error en la consulta -->", error);
        });
    });
  }

  cleanReserva(uid: string) {
    return new Promise((resolve, reject) => {
      const reservaciones = this.af.collection("reservaciones").ref;
      reservaciones
        .where("idSucursal", "==", uid)
        .where("estatus", "not-in", ["Finalizado", "Pagado"])
        .get()
        .then((data) => {
          const dataVacia = data.empty;
          if (dataVacia == false) {
            data.forEach((reserva) => {
              const reservacion = reserva.data();
              const fecha = new Date();
              const fechaYMD = moment(fecha).format("YYYY-MM-DD");
              const resIgualDespues = moment(reservacion.fechaR).isSameOrAfter(
                fechaYMD
              );
              if (resIgualDespues == false) {
                const idReservacion = reservacion.idReservacion;
                this.af
                  .collection("reservaciones")
                  .doc(idReservacion)
                  .delete()
                  .then(() => {
                    const compartidas = this.af.collection("compartidas").ref;
                    compartidas
                      .where("idReservacion", "==", idReservacion)
                      .get()
                      .then((data) => {
                        const dataVacia = data.empty;
                        if (dataVacia == false) {
                          data.forEach((compartida) => {
                            const compartidaID = compartida.id;
                            this.af
                              .collection("compartidas")
                              .doc(compartidaID)
                              .delete()
                              .then(() => {
                                resolve("success");
                              }).catch((error) => {
                                console.error('Documento no borrado con exito', error);
                              });
                          });
                        } else {
                          resolve("success");
                        }
                      });
                  }).catch((error) => {
                  console.error('Documento no borrado con exito', error);
                });
              }
            });
          } else {
            resolve("success");
          }
        }).catch((error) => console.error('Sin resultados'));
    });
  }
}
