import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertaGeneral } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class JsonsService {

  constructor(private http: HttpClient) { }

  getAlertasJson() {
    return this.http.get<AlertaGeneral[]>('/assets/data/info.json');
  }

  enviarPush() {
    let datos = {
      notification: {
        title: "Hola",
        body: "Buenos dias"
      },
      to:"hZx"
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
