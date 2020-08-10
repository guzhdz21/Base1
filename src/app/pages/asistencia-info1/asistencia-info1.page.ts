import { Component, OnInit, Input } from '@angular/core';
import { Asistencia, Usuario, Seguridad } from '../../interfaces/interfaces';

@Component({
  selector: 'app-asistencia-info1',
  templateUrl: './asistencia-info1.page.html',
  styleUrls: ['./asistencia-info1.page.scss'],
})
export class AsistenciaInfo1Page implements OnInit {

  @Input() asistencia : Asistencia;
  @Input() usuario: Usuario;
  @Input() seguridad: Seguridad;
  @Input() id: string;
  constructor() { }

  ngOnInit() {
    console.log(this.asistencia);
    console.log(this.usuario);
    console.log(this.seguridad);
    console.log(this.id);
  }

}
