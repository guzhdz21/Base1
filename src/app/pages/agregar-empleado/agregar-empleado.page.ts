import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.page.html',
  styleUrls: ['./agregar-empleado.page.scss'],
})
export class AgregarEmpleadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  usuarioAgregar: Usuario = {
    contraseña: null,
    nacimiento: null,
    nombre: null,
    numero: null,
    tipo: null,
    fechaDeIngreso: null,
    domicilio: null,
    celular: null,
    CURP: null,
    RFC: null,
    NSS: null,
    papeleria: null
  }

  tipoDeEmpleado(event){
    this.usuarioAgregar.tipo = event.detail.value;
  }

  radios(event){
    this.usuarioAgregar.papeleria = event.detail.value;
  }

  agregarNuevoEmpleado(){

  }

}
