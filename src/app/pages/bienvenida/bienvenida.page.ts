import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Usuario, Seguridad, Asignacion } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { Subscription, interval } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PushFireService } from '../../services/push-fire.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  UsuarioLocal: Usuario;
  usuario: Usuario;
  noLogin: boolean = false;

  backButtonSub: Subscription;

  timer;
  timerSub;

  constructor(private storage: StorageService,
              private router: Router,
              private fireService: FireService,
              private plt: Platform,
              private pushFire: PushFireService) { }

  async ngOnInit() {
    await this.obtenerUsuarioLocal();

    this.timer = interval(1500);
    this.timerSub = this.timer.subscribe(x => {
      if(this.noLogin == false) {
        if(this.usuario) {
          if(this.usuario.numero == this.UsuarioLocal.numero && this.usuario.contraseña == this.UsuarioLocal.contraseña) {
            this.UsuarioLocal = this.usuario;
            this.storage.guardarNacimiento(this.usuario.nacimiento.toDate().toISOString());
            // @ts-ignore
            this.storage.guardarId(this.usuario.id);
            this.seleccionarHome(this.usuario.tipo);
            this.timerSub.unsubscribe();
            return;
          }
        }
      } else {
        this.router.navigate(["/login"]);
        this.timerSub.unsubscribe();
      }
    });

  }

  async obtenerUsuarioLocal() {
    await this.storage.cargarUsuario().then(res => {
      this.UsuarioLocal = res;
      this.obtenerUsuario(res);
    });
  }

  async obtenerUsuario(local: Usuario) {
    await this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        if(local) {
          for(var user of val) {
            if(user.numero == local.numero && user.contraseña == local.contraseña) {
              this.usuario = user;
              this.obtenerDispositvos(user);
              return;
            }
          }
          this.noLogin = true;
          return;
        } else {
          this.noLogin = true;
          return;
        }
      });
    });
  }

  async obtenerDispositvos(user: Usuario) {
    await this.fireService.getAllDispositivos().then(res => {
      res.subscribe(val => {
        this.pushFire.leerToken().then(res4 => {
          for(var dis of val) {
            //Esta linea debe modificarse cuando se usa en ionic serve
            if(true) { //user.numero == dis.numero && dis.token == res4
              return;
            }
          }
          this.noLogin = true;
          return;
        });
      });
    });
  }
  
  seleccionarHome(tipo: string) {
    switch (tipo) {
      case 'Elemento seguridad': {
        this.router.navigate(["/home-guardia"]);
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

      case 'Recursos materiales' : {
        this.router.navigate(["/home-rm"]);
        break;
      }

      case 'Finanzas' : {
        this.router.navigate(["/finanzas-home"], {
          queryParams: {
            login: "false"
          }
        });
        break;
      }
    }
    return;
  }

  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {});
  }
}
