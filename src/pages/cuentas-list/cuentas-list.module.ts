import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CuentasListPage } from './cuentas-list';

@NgModule({
  declarations: [
    CuentasListPage,
  ],
  imports: [
    IonicPageModule.forChild(CuentasListPage),
  ],
})
export class CuentasListPageModule {}
