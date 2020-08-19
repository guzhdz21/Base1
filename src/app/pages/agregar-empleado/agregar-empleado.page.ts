import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { FireService } from 'src/app/services/fire.service';
import { AccionesService } from '../../services/acciones.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.page.html',
  styleUrls: ['./agregar-empleado.page.scss'],
})
export class AgregarEmpleadoPage implements OnInit {

  constructor( private fireService: FireService,
               private accionesService: AccionesService,
               private modalCtrl: ModalController) { }

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

  contrasena: string;
  fechaDeHoy: Date = new Date();

  tipoDeEmpleado(event){
    this.usuarioAgregar.tipo = event.detail.value;
  }

  radios(event){
    this.usuarioAgregar.papeleria = event.detail.value;
  }

  async agregarNuevoEmpleado(){
    this.usuarioAgregar.contraseña = this.contrasena; //Igualamos contraseña
    this.usuarioAgregar.fechaDeIngreso = this.fechaDeHoy.toDateString();
    this.fireService.addUsuario(this.usuarioAgregar);
    this.modalCtrl.dismiss();
    this.accionesService.presentToast("Empleado agregado");
  }

}
