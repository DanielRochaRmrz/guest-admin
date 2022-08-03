import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminRpCodigoPage } from './admin-rp-codigo';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminRpCodigoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminRpCodigoPage),
    ClipboardModule,
    FormsModule
  ],
})
export class AdminRpCodigoPageModule {}
