import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/interfaces/interfaces';
import { FireService } from 'src/app/services/fire.service';
import { AccionesService } from 'src/app/services/acciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-empleado',
  templateUrl: './modificar-empleado.page.html',
  styleUrls: ['./modificar-empleado.page.scss'],
})
export class ModificarEmpleadoPage implements OnInit {

@Input() empleadoAModificar : Usuario;
@Input() idEmpleadoAModificar : string;

fechaDeNacimiento: string = new Date().toISOString();
fechaDeIngreso: string = new Date().toISOString();
contrasena: string;

  constructor( private fireService: FireService,
    private accionesService: AccionesService,
    private modalCtrl: ModalController) { }

ngOnInit() {
}

tipoDeEmpleado(event){
this.empleadoAModificar.tipo = event.detail.value;
}

radios(event){
this.empleadoAModificar.papeleria = event.detail.value;
}

async agregarNuevoEmpleado(){
//FECHA DE NACIMIENTO
var diaN = new Date(this.fechaDeNacimiento);
//@ts-ignore
this.empleadoAModificar.nacimiento = diaN;
//FECHA DE INGRESO
var diaI = new Date(this.fechaDeIngreso);
//@ts-ignore
this.empleadoAModificar.fechaDeIngreso = diaI;

this.fireService.updateUsuario(this.empleadoAModificar, this.idEmpleadoAModificar);
this.modalCtrl.dismiss();
this.accionesService.presentToast("Empleado modificado");
}

}
