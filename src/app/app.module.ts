import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from "../pages/perfil/perfil";
import { EventosPage } from "../pages/eventos/eventos";
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { HistorialPage } from "../pages/historial/historial";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { TabsPage } from "../pages/tabs/tabs";
import { EventoDetallePage } from "../pages/evento-detalle/evento-detalle";
import { ReservacionesPage } from '../pages/reservaciones/reservaciones';
import { ProductoDetallePage } from "../pages/producto-detalle/producto-detalle";
import { ResumenPage } from "../pages/resumen/resumen";

//administrador
import { AdminLoginPage } from "../pages/admin-login/admin-login";
import { AdminHomePage } from "../pages/admin-home/admin-home";
import { AdminUsersPage } from "../pages/admin-users/admin-users";
import { AdminEventoHomePage } from "../pages/admin-evento-home/admin-evento-home";
import { AdminEventoSubirPage } from "../pages/admin-evento-subir/admin-evento-subir";
import { AdminEventoEditPage } from '../pages/admin-evento-edit/admin-evento-edit';
import { AdminCartaHomePage } from "../pages/admin-carta-home/admin-carta-home";
import { AdminCartaEditPage } from '../pages/admin-carta-edit/admin-carta-edit';
import { AdminUsersListPage } from '../pages/admin-users-list/admin-users-list';
import { AdminUserUserPage } from '../pages/admin-user-user/admin-user-user';
import { AdminCartaSubirPage } from '../pages/admin-carta-subir/admin-evento-subir';
import { AdminUsersGuestPage } from '../pages/admin-users-guest/admin-users-guest';
import { AdminUserDetailPage } from '../pages/admin-user-detail/admin-user-detail';
import { AdminMenuReservacionPage } from '../pages/admin-menu-reservacion/admin-menu-reservacion';
import { AdminSucursalListPage } from '../pages/admin-sucursal-list/admin-sucursal-list';
import { AdminSucursalSubirPage } from '../pages/admin-sucursal-subir/admin-sucursal-subir';
import { AdminSucursalPerfilPage } from '../pages/admin-sucursal-perfil/admin-sucursal-perfil';
import { AdminSucursalEditperfilPage } from '../pages/admin-sucursal-editperfil/admin-sucursal-editperfil';
import { AdminSucursalEditperfilImagenPage } from '../pages/admin-sucursal-editperfil-imagen/admin-sucursal-editperfil-imagen';
import { AdminEventoImageEditPage } from '../pages/admin-evento-image-edit/admin-evento-image-edit';
import { AdminCartaImageEditPage } from '../pages/admin-carta-image-edit/admin-carta-image-edit';
import { AdminSucursalCroquisPage } from '../pages/admin-sucursal-croquis/admin-sucursal-croquis';
import { ImagencroquisPage } from '../pages/imagencroquis/imagencroquis';
import { AdminPerfilEmpleadoPage } from '../pages/admin-perfil-empleado/admin-perfil-empleado';
import { AdministrarReservacionesPage } from '../pages/administrar-reservaciones/administrar-reservaciones';
import { AdminLeeQrPage } from '../pages/admin-lee-qr/admin-lee-qr';
import { CorteVentaPage } from '../pages/corte-venta/corte-venta';
import { CorteHistorialPage } from '../pages/corte-historial/corte-historial';
import { CuponesSucursalPage } from '../pages/cupones-sucursal/cupones-sucursal';
import { AgregarCuponesPage } from '../pages/agregar-cupones/agregar-cupones';
import { CiudadEstablecimientoPage } from '../pages/ciudad-establecimiento/ciudad-establecimiento';
import { AgregarCiudadPage } from '../pages/agregar-ciudad/agregar-ciudad';
import { AdminHistorialReservacionesPage } from '../pages/admin-historial-reservaciones/admin-historial-reservaciones';
import { AdminReservacionDetallePage } from '../pages/admin-reservacion-detalle/admin-reservacion-detalle';
import { AdminReservacionesCursoPage } from '../pages/admin-reservaciones-curso/admin-reservaciones-curso';
import { DetalleCuponPage } from '../pages/detalle-cupon/detalle-cupon';
import { CuentasPage } from '../pages/cuentas/cuentas';
import { AdminRpCodigoPage } from '../pages/admin-rp-codigo/admin-rp-codigo';
import { AdminRpCorteCodigosPage } from '../pages/admin-rp-corte-codigos/admin-rp-corte-codigos';
import { ReservaDetallePage } from '../pages/reserva-detalle/reserva-detalle';
import { AdminCroquisPage } from '../pages/admin-croquis/admin-croquis';
import { ToolsPage } from '../pages/tools/tools';
import { ChecklistPage } from '../pages/checklist/checklist';
import { ChecklistNewPage } from '../pages/checklist-new/checklist-new';

//Pipes
import { PipesModule } from "../pipes/pipes.module";

//import { AuthService } from '../providers/auth-service';
//Firebase
import { AngularFireModule, FirebaseAuth } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
//providers
import { UsuarioProvider } from '../providers/usuario/usuario';
import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';
import { CartaAddProvider } from '../providers/carta-add/carta-add';
import { ToastProvider } from '../providers/toast/toast';
import { CargaArchivoCartaProvider } from '../providers/carga-archivo-carta/carga-archivo';
import { SucursalAltaProvider } from '../providers/sucursal-alta/sucursal-alta';
import { CargaCroquisProvider } from '../providers/carga-croquis/carga-croquis';
import { PushNotiProvider } from "../providers/push-noti/push-noti";
import { ReservacionProvider } from "../providers/reservacion/reservacion";
import { ToolsProvider } from '../providers/tools/tools';

//Plugins
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import { OneSignal } from "@ionic-native/onesignal";
import { CartaProvider } from '../providers/carta/carta';
import { HttpModule } from '@angular/http';
import { GestionReservacionesProvider } from '../providers/gestion-reservaciones/gestion-reservaciones';
import { TooltipsModule, TooltipController } from 'ionic-tooltips';

import { AdminMonitearReservPage } from '../pages/admin-monitear-reserv/admin-monitear-reserv';
import { MonitoreoReservasProvider } from '../providers/monitoreo-reservas/monitoreo-reservas';
import { AdminDeMonUserPage } from '../pages/admin-de-mon-user/admin-de-mon-user';
import { ResumenProvider } from '../providers/resumen/resumen';
import { MisReservacionesPage } from '../pages/mis-reservaciones/mis-reservaciones';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';

export const firebaseConfig = {
  apiKey: "AIzaSyBixlCb21nNbPSurY-Pvqu3hZB80Icl9Pk",
  authDomain: "guestreservation-8b24b.firebaseapp.com",
  databaseURL: "https://guestreservation-8b24b.firebaseio.com",
  projectId: "guestreservation-8b24b",
  storageBucket: "guestreservation-8b24b.appspot.com",
  messagingSenderId: "853477386824"
};
import { Stripe } from '@ionic-native/stripe';
import { PaymentProvider } from '../providers/payment/payment';
import { HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';
import { DeviceProvider } from '../providers/device/device';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
// import { FCM } from '@ionic-native/fcm';
import { ClipboardModule } from 'ngx-clipboard';
import { ScrollableDirective } from './scrollable.directive';
import { PaginationService } from './pagination.service';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner';
import { SliderPage } from '../pages/slider/slider';
import { CorteReservacionesHistorialPage } from '../pages/corte-reservaciones-historial/corte-reservaciones-historial';
import { CorteDetalleReservacionPage } from '../pages/corte-detalle-reservacion/corte-detalle-reservacion';
import { CuentasListPage } from '../pages/cuentas-list/cuentas-list';
import { CuentasHistorialListPage } from '../pages/cuentas-historial-list/cuentas-historial-list';

import localeEsMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from "@angular/common";
import { MasterReembolsosPage } from '../pages/master-reembolsos/master-reembolsos';
import { ReembolsosPage } from '../pages/reembolsos/reembolsos';
import { ReembolsosProvider } from '../providers/reembolsos/reembolsos';
registerLocaleData(localeEsMX, 'es-MX');

 firebase.initializeApp(firebaseConfig);
 //var secondaryConnection = firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    ProductoDetallePage,
    ResumenPage,
    AdminLoginPage,
    AdminHomePage,
    AdminUsersPage,
    AdminEventoHomePage,
    AdminEventoSubirPage,
    AdminCartaHomePage,
    AdminCartaSubirPage,
    AdminCartaEditPage,
    AdminEventoEditPage,
    AdminUsersListPage,
    AdminUsersGuestPage,
    AdminUserUserPage,
    AdminUserDetailPage,
    AdminMenuReservacionPage,
    AdminSucursalListPage,
    AdminSucursalSubirPage,
    EventoDetallePage,
    AdminSucursalPerfilPage,
    AdminSucursalEditperfilPage,
    AdminSucursalEditperfilImagenPage,
    AdminEventoImageEditPage,
    AdminCartaImageEditPage,
    AdminSucursalCroquisPage,
    ImagencroquisPage,
    ReservacionesPage,
    AdminPerfilEmpleadoPage,
    AdministrarReservacionesPage,
    AdminMonitearReservPage,
    AdminDeMonUserPage,
    MisReservacionesPage,
    AdminLeeQrPage,
    CorteVentaPage,
    CorteHistorialPage,
    CuponesSucursalPage,
    AgregarCuponesPage,
    CiudadEstablecimientoPage,
    AgregarCiudadPage,
    AdminHistorialReservacionesPage,
    AdminReservacionDetallePage,
    AdminReservacionesCursoPage,
    DetalleCuponPage,
    CuentasPage,
    AdminRpCodigoPage,
    AdminRpCorteCodigosPage,
    ReservaDetallePage,
    AdminCroquisPage,
    ScrollableDirective,
    LoadingSpinnerComponent,
    SliderPage,
    ToolsPage,
    ChecklistPage,
    ChecklistNewPage,
    CorteReservacionesHistorialPage,
    CorteDetalleReservacionPage,
    CuentasListPage,
    CuentasHistorialListPage,
    MasterReembolsosPage,
    ReembolsosPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TooltipsModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: ''
        }
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule,
    HttpModule,
    HttpClientModule,
    ClipboardModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    ProductoDetallePage,
    ResumenPage,
    AdminLoginPage,
    AdminHomePage,
    AdminUsersPage,
    AdminEventoHomePage,
    AdminEventoSubirPage,
    AdminEventoEditPage,
    AdminCartaHomePage,
    AdminCartaEditPage,
    AdminCartaSubirPage,
    AdminUsersListPage,
    AdminUsersGuestPage,
    AdminUserUserPage,
    AdminUserDetailPage,
    AdminMenuReservacionPage,
    AdminSucursalListPage,
    AdminSucursalSubirPage,
    EventoDetallePage,
    AdminSucursalPerfilPage,
    AdminSucursalEditperfilPage,
    AdminSucursalEditperfilImagenPage,
    AdminEventoImageEditPage,
    AdminCartaImageEditPage,
    AdminSucursalCroquisPage,
    ImagencroquisPage,
    ReservacionesPage,
    AdminPerfilEmpleadoPage,
    ReservacionesPage,
    AdministrarReservacionesPage,
    AdminMonitearReservPage,
    AdminDeMonUserPage,
    MisReservacionesPage,
    AdminLeeQrPage,
    CorteVentaPage,
    CorteHistorialPage,
    CuponesSucursalPage,
    AgregarCuponesPage,
    CiudadEstablecimientoPage,
    AgregarCiudadPage,
    AdminHistorialReservacionesPage,
    AdminReservacionDetallePage,
    AdminReservacionesCursoPage,
    DetalleCuponPage,
    CuentasPage,
    AdminRpCodigoPage,
    AdminRpCorteCodigosPage,
    ReservaDetallePage,
    AdminCroquisPage,
    SliderPage,
    ToolsPage,
    ChecklistPage,
    ChecklistNewPage,
    CorteReservacionesHistorialPage,
    CorteDetalleReservacionPage,
    CuentasListPage,
    CuentasHistorialListPage,
    MasterReembolsosPage,
    ReembolsosPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    UsuarioProvider,
    AuthProvider,
    UserProvider,
    SocialSharing,
    CargaArchivoProvider,
    CartaAddProvider,
    ToastProvider,
    CargaArchivoCartaProvider,
    SucursalAltaProvider,
    CargaCroquisProvider,
    AngularFirestore,
    PushNotiProvider,
    OneSignal,
    ReservacionProvider,
    GestionReservacionesProvider,
    CartaProvider,
    MonitoreoReservasProvider,
    ResumenProvider,
    Stripe,
    PaymentProvider,
    Camera,
    DeviceProvider,
    Device,
    // FCM,
    PaginationService,
    ToolsProvider,
    File,
    FileOpener,
    TooltipController,
    ReembolsosProvider
  ]
})
export class AppModule {}
