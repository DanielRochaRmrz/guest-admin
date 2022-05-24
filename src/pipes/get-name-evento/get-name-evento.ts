import { Pipe, PipeTransform } from '@angular/core';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';

@Pipe({
  name: 'getNameEvento',
})
export class GetNameEventoPipe implements PipeTransform {

  constructor(private monitoreoReservas: MonitoreoReservasProvider){

  }
 
  async transform(idEvento: any) {
    
    if(idEvento){ 

      const evento: any = await this.monitoreoReservas.getEventoNamePipe(idEvento);

      const ev: string = evento as string;

      const event = JSON.parse(ev);

      return event;

    }

  }
}
