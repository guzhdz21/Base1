import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.page.html',
  styleUrls: ['./agregar-empleado.page.scss'],
})
export class AgregarEmpleadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tipoEmpleado: string;
  papeleriaOpcion: number;
  hola: number;

  tipoDeEmpleado(event){
    this.tipoEmpleado = event.detail.value;
  }

  radios(event){
    this.papeleriaOpcion = event.detail.value;
  }

}
