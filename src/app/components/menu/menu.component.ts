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
  @Input() nombre: string;
  usuario: Usuario;

  guardia = [
    {
      icono: 'log-out-outline',
      nombre: 'Cerrar Sesion',
      irA: '/login'
    },
  ];

  supervisor = [
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

  cabina = [
    {
      icono: 'log-out-outline',
      nombre: 'Cerrar Sesion',
      irA: '/login'
    },
  ];

  constructor(private storage: StorageService,
              private router: Router,) { }

  async ngOnInit() {
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      await this.storage.eliminarUsuario();
    }
    await this.router.navigate([irA]);
  }
}
