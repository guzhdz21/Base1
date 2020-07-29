import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { Dispositivo } from '../interfaces/interfaces';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class PushFireService {
  dispositivos: Dispositivo[] = [];

  constructor(private firebase: FirebaseX,
              private fireService: FireService,
              private plt: Platform) { }
  
  async cargarDispositivos() {
    await this.fireService.getAllDispositivos().then(res => {
      res.subscribe(val => {
        this.dispositivos = val;
      });
    });
  }

  async getToken(numero: number) {
    this.cargarDispositivos();
    var token: string;
    if(this.plt.is('android')) {
      var token = await this.firebase.getToken();
    }

    if(!this.plt.is('cordova')) {

    }

    return this.guardarToken(token, numero);
  }

  async guardarToken(token: string, numero: number) {
    if(!token) {
      return;
    }

    const dispositivo: Dispositivo = {
      numero: numero,
      token: token
    }
    return this.compararToken(dispositivo);
  }

  async compararToken(dispositivo: Dispositivo) {
    for (var dis of this.dispositivos) {
      if(dis.numero == dispositivo.numero) {
        if(dis.token == dispositivo.token) {
          return;
        }
        // @ts-ignore
        this.procesoModificar(dispositivo, dis.id);
        return;
      } 
    }
    this.procesoDeGuardarNuevo(dispositivo);
    return;
  }

  async procesoDeGuardarNuevo(dispositivo: Dispositivo) {
    await this.guardarNuevo(dispositivo);
    await this.borrarAnteriores(dispositivo);
  }

  async guardarNuevo(dispositivo: Dispositivo) {
    await this.fireService.addDispositivos(dispositivo);
    return;
  }

  async procesoModificar(dispositivo: Dispositivo, id: string) {
    await this.modificar(dispositivo, id);
    await this.borrarAnteriores(dispositivo);
    return;
  }

  async borrarAnteriores(dispositivo: Dispositivo) {
    for (var dis of this.dispositivos) {
      if(dis.token == dispositivo.token && dis.numero != dispositivo.numero) {
        // @ts-ignore
        await this.fireService.removeDispositivos(dis.id);
      }
    }
    return;
  }

  async modificar(dispositivo: Dispositivo, id: string) {
    await this.fireService.updateDispositivos(dispositivo, id);
    return;
  }

  listenNotifications() {
    return this.firebase.onMessageReceived();
  }

  async leerToken() {
    var token: string;
    if(this.plt.is('android')) {
      var token = await this.firebase.getToken();
    }
    return token;
  }
}
