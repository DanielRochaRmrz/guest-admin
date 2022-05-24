import { Pipe, PipeTransform } from '@angular/core';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';

@Pipe({
  name: 'getNameZona',
})
export class GetNameZonaPipe implements PipeTransform {
  
  constructor(private monitoreoReservaciones: MonitoreoReservasProvider){

}

  async transform(idZona: any) {
    
    if(idZona){

      const zona: any = await this.monitoreoReservaciones.getZonaNamePipe(idZona);

      const zn: string = zona as string;

      const zone = JSON.parse(zn);

      return zone;

    }
  }
}
