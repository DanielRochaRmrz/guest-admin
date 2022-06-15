import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Pipe({
  name: 'getNamexphoneUser',
})
export class GetNamexphoneUserPipe implements PipeTransform {

  constructor(private userProvider: UsuarioProvider) {

  }

  async transform(phone: any) {

    if (phone) {

      await this.userProvider.getUserNameXPhone(phone)

      .subscribe((users) => {

        const us: any  = users as any;

        us.forEach(function(value){

          value.displayName;
          
          // console.log("name", value.displayName);         

          return value.displayName;

        })

      })

    }

  }
}
