import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CuentasHistorialListPage } from './cuentas-historial-list';

@NgModule({
  declarations: [
    CuentasHistorialListPage,
  ],
  imports: [
    IonicPageModule.forChild(CuentasHistorialListPage),
  ],
})
export class CuentasHistorialListPageModule {}
