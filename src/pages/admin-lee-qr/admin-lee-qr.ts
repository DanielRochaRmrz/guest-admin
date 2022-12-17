import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { AuthProvider } from '../../providers/auth/auth';
import { AdminMonitearReservPage } from '../admin-monitear-reserv/admin-monitear-reserv';

@IonicPage()
@Component({
  selector: 'page-admin-lee-qr',
  templateUrl: 'admin-lee-qr.html',
})
export class AdminLeeQrPage {
  idReservacion: any;
  idReservacion2: any;
  montoReservacion: any;
  idTarjeta: any;
  reservacion: any = {};
  cliente: any = {};
  area: any = {};
  zona: any = {};
  mesas: any;
  evento: any = {};
  productos: any;
  datosQrRecibidos: any;
  infotarjeta: any = {};
  numTarjeta: any;
  mesExpiracion: any;
  anioExpiracion: any;
  cvc: any;
  idCompartir: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afs: AngularFirestore,
    public servMon: MonitoreoReservasProvider,
    public user: AuthProvider,
    public alertCtrl: AlertController,
  ) {

    this.datosQrRecibidos = this.navParams.get('datosQr');

    // console.log("this.datosQrRecibidos", this.datosQrRecibidos);

    const dataCode = JSON.parse(this.datosQrRecibidos);

    // console.log("dataCode", dataCode);

    this.idReservacion2 = dataCode.idReservacion;
    this.idCompartir = dataCode.idCompartir;
    // wpqg4q8bNm4GU2iT4Wek

    // this.idReservacion2 = "hF93QiLuZeYT6407MEOB";
    // this.idCompartir = "0nVeAWgoBm3iBcBumcEV";

    const idSucursalG = localStorage.getItem('uidSucursal');

    // ESCANEO DE RESERVACION NORMAL
    if (this.idCompartir == undefined) {

      this.servMon.getEstatusReservacion(this.idReservacion2).then(data => {

        const estatus = data[0].estatus;

        const idSucursal = data[1].idSucursal;

        if (estatus == "Finalizado") {

          let alerta = this.alertCtrl.create({
            title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Esta reservación ya ha sido escaneada:<br> ¡Acesso denegado!",
            buttons: [
              {
                text: "Aceptar"
              }
            ]
          });
          alerta.present();

          this.navCtrl.push(AdminMonitearReservPage);

        } else if (idSucursal != idSucursalG) {

          let alerta = this.alertCtrl.create({
            title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Esta reservación pertenece a otra sucursal:<br> ¡Acesso denegado!",
            buttons: [
              {
                text: "Aceptar"
              }
            ]
          });
          alerta.present();

          this.navCtrl.push(AdminMonitearReservPage);

        } else {

          this.afs.collection('reservaciones').doc(this.idReservacion2).update({
            estatus: 'Finalizado'
          });
          let alerta = this.alertCtrl.create({
            title: "<div align='center'><img text-center class='adv2' src='./assets/content/ok.png'/></div> Reservación pagada:<br> Acesso permitido!",
            buttons: [
              {
                text: "Aceptar"
              }
            ]
          });
          alerta.present();

        }

      })

    }
    // ESCANEO RESERVACIONES COMPARTIDAS

    if (this.idCompartir != undefined) {

      this.servMon.getEstatusReservacion(this.idReservacion2).then(data => {

        const estatus = data[0].estatus;

        const idSucursal = data[1].idSucursal;

        if (estatus == "Finalizado") {

          let alerta = this.alertCtrl.create({
            title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Esta reservación ya ha sido escaneada en su totalidad:<br> ¡Acesso denegado!",
            buttons: [
              {
                text: "Aceptar"
              }
            ]
          });
          alerta.present();

          this.navCtrl.push(AdminMonitearReservPage);

        } else if (idSucursal != idSucursalG) {

          let alerta = this.alertCtrl.create({
            title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Esta reservación pertenece a otra sucursal:<br> ¡Acesso denegado!",
            buttons: [
              {
                text: "Aceptar"
              }
            ]
          });
          alerta.present();

          this.navCtrl.push(AdminMonitearReservPage);

        }

        this.servMon.getEstatusReservacionCompartidas(this.idReservacion2, this.idCompartir).then(data => {

          if (data == "OK") {

            let alerta = this.alertCtrl.create({
              title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Este QR ya ha sido escaneado:<br> ¡Acesso denegado!",
              buttons: [
                {
                  text: "Aceptar"
                }
              ]
            });
            alerta.present();

            this.navCtrl.push(AdminMonitearReservPage);

          } else {

            const consul = this.afs.collection('compartidas').ref;
            consul.where('idReservacion', '==', this.idReservacion2).where('estatus_escaneo', '==', 'NO').get().then(data => {

              var count = [];
              data.forEach(res => {
                const idCompartidas = res.id;
                count.push(idCompartidas);


              });
              const totalCompartidas = count.length;
              console.log('totalCompartidas -->', totalCompartidas);
              
              if (totalCompartidas == 1) {

                this.afs.collection('reservaciones').doc(this.idReservacion2).update({
                  estatus: 'Finalizado'
                });

                let alerta = this.alertCtrl.create({
                  title: "<div align='center'><img text-center class='adv2' src='./assets/content/ok.png'/></div> Reservación compartida aceptada:<br> Acesso permitido",
                  buttons: [
                    {
                      text: "Aceptar"
                    }
                  ]
                });
                alerta.present();

              } else {

                let alerta = this.alertCtrl.create({
                  title: "<div align='center'><img text-center class='adv2' src='./assets/content/ok.png'/></div> Reservación compartida aceptada:<br> Acesso permitido",
                  buttons: [
                    {
                      text: "Aceptar"
                    }
                  ]
                });
                alerta.present();

              }
              // Cambiar el estatus a pagado cuando ya se escanea y se verifico el pago
              this.afs.collection('compartidas').doc(this.idCompartir).update({
                estatus_escaneo: 'OK'
              });
            });
          }

        });
      })

    }

    // Datos de la reservacion
    this.servMon.getReservacion(this.idReservacion2).subscribe(reserv => {

      if (reserv != null) {

        this.reservacion = reserv;
        // Extraemos uid del usuario
        const uid = this.reservacion.idUsuario;
        this.infoClient(uid);
        // Extraemos el id del area
        const uidArea = this.reservacion.idArea;
        this.infoArea(uidArea);
        // Extraemos el id de la zona
        const uidZona = this.reservacion.idZona;
        this.infoZona(uidZona);
        // Extraemos el id del evento
        const uidEvento = this.reservacion.idevento;
        this.infoEvento(uidEvento);
        // Enviamos el idReservacion a productos
        this.getProducts(this.idReservacion2);
      } else {

        let alerta = this.alertCtrl.create({
          title: "<div align='center'><img text-center class='adv2' src='./assets/content/advertenciaRojo.png'/></div> Esta reservación no existe:<br> ¡Acesso denegado!",
          buttons: [
            {
              text: "Aceptar"
            }
          ]
        });
        alerta.present();

        this.navCtrl.push(AdminMonitearReservPage);

      }

    });
    //this.servMon.getDatosTarjeta(this.idTarjeta).subscribe( tarjeta =>{
    //  this.infotarjeta = tarjeta;
    //  this.numTarjeta = this.infotarjeta.numTarjeta;
    //  this.mesExpiracion = this.infotarjeta.mesExpiracion;
    //  this.anioExpiracion = this.infotarjeta.anioExpiracion;
    //  this.cvc = this.infotarjeta.cvc;
    //console.log('datos de la tarjeta y monto');
    //console.log(this.idTarjeta,this.numTarjeta,  this.mesExpiracion,this.anioExpiracion,this.cvc,this.montoReservacion);
    //mandar datos de la tarjeta
    //this.servMon.cambiaPagando(this.idReservacion2,this.numTarjeta,this.mesExpiracion,this.anioExpiracion,this.cvc,this.montoReservacion);
    //});

  }

  ionViewDidLoad() {
  }

  infoClient(uid) {
    this.user.getUserAdmins(uid).subscribe(c => {
      this.cliente = c;
      console.log('cliente', this.cliente);
    })
  }
  infoArea(uid) {
    this.servMon.getArea(uid).subscribe(a => {
      this.area = a;
      console.log('area', this.area);
    })
  }
  infoZona(uid) {
    this.servMon.getZona(uid).subscribe(a => {
      this.zona = a;
      console.log('zona', this.zona);
    })
  }
  infoEvento(uid) {
    this.servMon.getEvento(uid).subscribe(e => {
      this.evento = e;
      console.log('evento', e);
    })
  }
  getProducts(uid) {
    this.servMon.getAllProductos(uid).then(p => {
      this.productos = p;
      console.log('carta', p);
    })
  }
  // updateRes() {
  //   this.servMon.cambiaPagando();
  // }

}
