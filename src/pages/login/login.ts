import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { ViewChild, AfterViewInit } from '@angular/core';
import { Slides } from 'ionic-angular';

import { UsuarioService } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements AfterViewInit {

  @ViewChild(Slides) slides: Slides;

  clave: string = 'As123'

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private _us: UsuarioService) {
  }

  continuar(){
    // Verificar si la clave es valida

    let loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    })
    loading.present()

    this._us.verifica_usuario(this.clave)
            .then( valido =>{

              loading.dismiss()

              if ( valido ){
                // Continuar

                this.slides.lockSwipes(false)
                this.slides.slideNext()                
                this.slides.lockSwipes(true)

              }else{

                this.alertCtrl.create({
                  title: 'clave no es correcta',
                  subTitle: 'Por favor verifique su clave, o hable con el Administrador.',
                  buttons: ['Ok!']
                }).present()
              }

            })
            .catch( err => {

              loading.dismiss()  
              console.log('Error Verifica Usuario:  ' + JSON.stringify(err))            
            })

  }

  ingresar(){
    // Ingresar al Home

    this.navCtrl.setRoot(HomePage)

  }

  ngAfterViewInit(){
    this.slides.lockSwipes(true)
    this.slides.freeMode = false
    this.slides.paginationType = 'progress'
  }



}
