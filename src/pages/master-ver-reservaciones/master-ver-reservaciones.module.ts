import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MasterVerReservacionesPage } from './master-ver-reservaciones';

@NgModule({
  declarations: [
    MasterVerReservacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MasterVerReservacionesPage),
  ],
})
export class MasterVerReservacionesPageModule {}
