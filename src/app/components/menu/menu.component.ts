import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() tipo: string;
  opciones = [];
  nombre: string = "";
  usuario: Usuario;

  constructor(private storage: StorageService,
              private router: Router,) { }

  async ngOnInit() {
    await this.cargarUsuario();
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      await this.storage.eliminarUsuario();
    }
    await this.router.navigate([irA]);
  }

  async cargarUsuario() {
    await this.storage.cargarUsuario().then(res => {
      this.usuario = res;
      this.nombre = res.nombre;
    });
    switch(this.tipo) {

      case 'guardia': {
        this.opciones = [
          {
            icono: 'log-out-outline',
            nombre: 'Cerrar Sesion',
            irA: '/login'
          },
        ];
        break;
      }

      case 'supervisor': {
        this.opciones = [
          {
            icono: 'warning',
            nombre: 'Alertas Incidentes',
            irA: '/login'
          },
          {
            icono: 'location',
            nombre: 'Ubicacion guardias',
            irA: '/login'
          },
          {
            icono: 'log-out-outline',
            nombre: 'Cerrar Sesion',
            irA: '/login'
          }
        ];
        break;
      }

    }
  }
}
