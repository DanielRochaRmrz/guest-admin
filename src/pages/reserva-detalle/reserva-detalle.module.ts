import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaDetallePage } from './reserva-detalle';

@NgModule({
  declarations: [
    ReservaDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaDetallePage),
  ],
})
export class ReservaDetallePageModule {}
