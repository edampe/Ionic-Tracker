import { Injectable } from '@angular/core';


import { AngularFireDatabase } from 'angularfire2/database';


import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

@Injectable()
export class UsuarioService {

  clave: string = null

  constructor(private afDB: AngularFireDatabase,
              private storage: Storage,
              private platform: Platform) {  }

  verifica_usuario( clave: string ){

   // clave = clave.toLocaleLowerCase()

    let promesa = new Promise( (resolve, reject) => {

      this.afDB.list("/usuarios/" + clave).subscribe( data => {
        console.log(data)
        
        if ( data.length === 0 ){
          // Clave invalida
          resolve(false)
        }else{
          // Clave Valida
          this.clave = clave
          this.guardar_storage()
          resolve(true)
          

        }
      })
    }).catch( err => console.log('Error en promesa service: ' + JSON.stringify(err)))

    return promesa
  }

  guardar_storage(){

    let promesa =  new Promise( (resolve, reject) => {

      if (this.platform.is('cordova')){

        this.storage.set('clave', this.clave);

      }else{
        if(this.clave){
          localStorage.setItem('clave', this.clave)
        }else{
          localStorage.removeItem('clave')
        }
      }
  
    }) 
    return promesa
  }

  cargar_storage(){
    let promesa = new Promise( (resolve, reject) => {
      if (this.platform.is('cordova')){

        this.storage.ready().then( () => {
          // leer del storage
          this.storage.get('clave').then(clave => {
            this.clave = clave
            resolve()
            
          }).catch( err => { console.log( err )})

        })


      }else{
        this.clave = localStorage.getItem('clave')
        resolve()

      }
  
    })
    return promesa  
  }

  borrar_usuario(){
    this.clave = null
    this.guardar_storage( )
  }

}
