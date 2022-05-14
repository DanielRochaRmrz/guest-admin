import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioProvider } from '../../providers/usuario/usuario';


@Pipe({
  name: 'getNameUser',
})


export class GetNameUserPipe implements PipeTransform {


  constructor(private userProvider: UsuarioProvider) {

  }

  async transform(idUsuario: string) {

    const usuario: unknown = await this.userProvider.getUserName(idUsuario);

    const us: string = usuario as string;

    const user = JSON.parse(us);
    
    return user;

  }
}
