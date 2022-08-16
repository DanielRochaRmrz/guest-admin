import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaDetallePage } from './reserva-detalle';
import { GetNameUserPipe } from '../../pipes/get-name-user/get-name-user';
import { GetNamexphoneUserPipe } from '../../pipes/get-namexphone-user/get-namexphone-user';

@NgModule({
  declarations: [
    ReservaDetallePage,
    GetNameUserPipe,
    GetNamexphoneUserPipe
  ],
  imports: [
    IonicPageModule.forChild(ReservaDetallePage),
  ],
})
export class ReservaDetallePageModule {}
