import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { Dispositivo } from '../interfaces/interfaces';
import { FireService } from './fire.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushFireService {
  dispositivos: Dispositivo[] = [];

  constructor(private firebase: FirebaseX,
              private fireService: FireService,
              private plt: Platform,
              private http: HttpClient) { }
  
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

  enviarPush(titulo: string, mensaje: string, token: string, servicio: string) {
    let datos = {
      notification: {
        title: "Alerta de Incidente",
        body: "Incidente en " + servicio + ": " + titulo + ". " + mensaje
      },
      to: token
    }

    let options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAA8La8sO4:APA91bFUxCWkOXDyZW-2KFsh_LnXn7W-ns03du2ckrYhBR85i5slwHS57DrFPb0i-QS3fRauuPULOy9JD0v86KAnNc5NZWKqN48MG7UpLFKE3Q36NGqdxzPcHXbOgK3XNPN6_v62L1sR'
      }
    }
    let url = 'https://fcm.googleapis.com/fcm/send'
    return this.http.post(url, datos, options);
  }

  enviarPushNuevo(nombre: string, celular: string, token: string) {
    let datos = {
      notification: {
        title: "Nuevo elemento de seguridad (Alta)",
        body: "Nombre: " + nombre + ", Celular: " + celular
      },
      to: token
    }

    let options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAA8La8sO4:APA91bFUxCWkOXDyZW-2KFsh_LnXn7W-ns03du2ckrYhBR85i5slwHS57DrFPb0i-QS3fRauuPULOy9JD0v86KAnNc5NZWKqN48MG7UpLFKE3Q36NGqdxzPcHXbOgK3XNPN6_v62L1sR'
      }
    }
    let url = 'https://fcm.googleapis.com/fcm/send'
    return this.http.post(url, datos, options);
  }
}
