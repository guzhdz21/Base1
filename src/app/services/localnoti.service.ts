import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { timeoutWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalnotiService {

  constructor(private localNotifications: LocalNotifications) { }

  async mandarNotificaionCalendario(id: number, title: string, text: string, fecha: Date) {
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var año = fecha.getFullYear();
    await this.localNotifications.schedule({
      id: id,
      title: title,
      text: text,
      trigger: { every: {hour: fecha.getHours(), minute: fecha.getMinutes()}, 
      firstAt: new Date(año, mes, dia)},
      foreground: true,
      icon: 'alarm'
    });
    return;
  }

  async borrarNotificacion(id: number) {
    this.localNotifications.cancel(id);
  }

  async borrarTodas() {
    this.localNotifications.cancelAll();
  }
}
