import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdministrarReservacionesPage } from './administrar-reservaciones';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AdministrarReservacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(AdministrarReservacionesPage),
    PipesModule
  ],
})
export class AdministrarReservacionesPageModule {}
