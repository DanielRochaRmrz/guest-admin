import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioProvider } from '../../providers/usuario/usuario';


@Pipe({
  name: 'getNameUser',
})


export class GetNameUserPipe implements PipeTransform {

  constructor(private userProvider: UsuarioProvider ){
  
  }  

  async transform(idUsuario: string) {
  
    const user = await this.userProvider.getUserName(idUsuario);

    return user;

  }
}
