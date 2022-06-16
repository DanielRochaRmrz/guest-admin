import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Pipe({
  name: 'getNamexphoneUser',
})
export class GetNamexphoneUserPipe implements PipeTransform {

  constructor(public firestore: AngularFirestore, public userProvider: UsuarioProvider) {

  }

  // 
  async transform(idUsuario: any) {

    if(idUsuario){
      console.log('user -->', idUsuario);

      const usuario: any = await this.userProvider.getUserNamePhone(idUsuario);

      const us: string = usuario as string;

      const user = JSON.parse(us);
      console.log('user -->', user);
      
      
      return user;

    }  

  }
}
