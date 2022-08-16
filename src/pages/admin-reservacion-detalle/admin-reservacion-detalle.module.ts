import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminReservacionDetallePage } from './admin-reservacion-detalle';
import { GetNameUserPipe } from '../../pipes/get-name-user/get-name-user';
import { GetNameEventoPipe } from '../../pipes/get-name-evento/get-name-evento';
import { GetNameZonaPipe } from '../../pipes/get-name-zona/get-name-zona';
import { GetNamexphoneUserPipe } from '../../pipes/get-namexphone-user/get-namexphone-user';

@NgModule({
  declarations: [
    AdminReservacionDetallePage,
    GetNameUserPipe,
    GetNameEventoPipe,
    GetNameZonaPipe,
    GetNamexphoneUserPipe,
  ],
  imports: [
    IonicPageModule.forChild(AdminReservacionDetallePage),
  ],
})
export class AdminReservacionDetallePageModule {}
