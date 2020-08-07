import { Component, OnInit } from '@angular/core';
import { FireService } from '../../services/fire.service';
import { Usuario } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PushFireService } from '../../services/push-fire.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  visible: string = "eye-off";
  passwordV: string = "password";
  textoError: string;

  numero: number;
  password: string;
  usuarios: Usuario[];
  usuario: Usuario;
  idUsuario: string;

  logInvalido: boolean = false;

  backButtonSub: Subscription;

  constructor(private fireService: FireService,
              private router: Router,
              private accionesService: AccionesService,
              private storageService: StorageService,
              private plt: Platform,
              private pushFire: PushFireService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        this.usuarios = val;
      })
    });
  }

  passwordVisible() {
    if(this.visible == "eye") {
      this.visible = "eye-off";
      this.passwordV = "password";
    } else {
      this.visible = "eye";
      this.passwordV = "text";
    }
  }

  async login() {
    this.logInvalido = false;
    await this.accionesService.presentLoading("Cargando...", 800);

    for(var user of this.usuarios) {
      if(user.numero == this.numero) {
        if(user.contraseña == this.password) {
          this.usuario = user;
          // @ts-ignore
          this.idUsuario = user.id;
          await this.accionesService.presentLoading("Entrando...", 900);
          await this.storageService.guardarUsuario(this.usuario);
          await this.storageService.guardarNacimiento(this.usuario.nacimiento.toDate().toISOString());
          await this.storageService.guardarId(this.idUsuario);
          //comentar esta linea en ionic serve
          //await this.guardarToken(this.usuario.numero);
          await this.seleccionarHome(this.usuario.tipo);
          return;
        }
        this.textoError = "El numero de empleado y la fecha de nacimiento no concuerdan, revisalos bien e intenta de nuevo";
        this.logInvalido = true;
        this.password = null;
        return;
      }
    }

    this.textoError = "El numero de empleado no esta registrado";
    this.logInvalido = true;
    this.numero = null;
    this.password = null;
  }

  async guardarToken(numero: number) {
    await this.pushFire.cargarDispositivos();
    await this.pushFire.getToken(numero);
    await this.pushFire.listenNotifications().pipe(
      tap(msg => {
        this.accionesService.presentToast(msg.body);
      })
    );
  }

  async restablecer() {
    this.router.navigate(["recuperar-password"]);
  }

  seleccionarHome(tipo: string) {
    switch (tipo) {
      case 'Elemento seguridad': {
        this.router.navigate(["/home-guardia"], {replaceUrl: true});
        break;
      }
      case 'Recursos humanos': {
        this.router.navigate(["/home-rh"]);
        break;
      }
      case 'Supervisor' : {
        this.router.navigate(["/home-supervisor"]);
        break;
      }
      case 'Cabina' : {
        this.router.navigate(["/home-cabina"]);
        break;
      }
    }
  }

  async ionViewWillEnter() {
    this.numero = null;
    this.password = "";
    this.visible = "eye-off";
    this.passwordV = "password";
    await this.pushFire.cargarDispositivos();
  }

  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
      navigator["app"].exitApp();
    });
  }
}
