import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { FireService } from 'src/app/services/fire.service';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { AccionesService } from 'src/app/services/acciones.service';
import { PushFireService } from 'src/app/services/push-fire.service';
import { Usuario, Comprador } from '../../interfaces/interfaces';

@Component({
  selector: 'app-agregar-comprador',
  templateUrl: './agregar-comprador.page.html',
  styleUrls: ['./agregar-comprador.page.scss'],
})
export class AgregarCompradorPage implements OnInit {

  empleados: any[] = [];
  textoBuscar = '';
  confirmarCompra: boolean = false;

  comprador: Comprador = {
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
    papeleria: null,
    activo: false,
    cantidad: null,
    articulo: null, 
    pagosT: null,
    pagosR: null
  }

  constructor(private storageService: StorageService,
              private fireService: FireService,
              private modalCtrl: ModalController,
              private plt: Platform,
              private navCtrl: NavController,
              private accionesService: AccionesService,
              private pushFire: PushFireService) { }

async ngOnInit() {

    this.empleados = [];

    await this.obtenerTodosLosEmpleados();
  }

  async obtenerTodosLosEmpleados() {
    await this.fireService.getAllUsuarios().then(res => {
      res.subscribe(val => {
        this.empleados = val;
        //this.obtenerSeguridad(val);
      });
    });
  }

  async empleadoSeleccionado(empleado: Comprador, id: string){
    this.accionesService.presentAlertDatosCompra("Compra de " + empleado.nombre, "Completa los datos de la compra", [{text: 'Cancelar',handler: (bla) => { 
      this.confirmarCompra = false;
      this.accionesService.presentToast("Compra cancelada");}
    }, {text: 'Agregar',handler: (bla) => {
      if(bla.Precio > 0 && bla.numeroDePagos > 0){

        empleado.activo = true;
        empleado.articulo = bla.Articulo;
        empleado.cantidad = bla.Precio;
        empleado.pagosR = bla.numeroDePagos;
        empleado.pagosT = bla.numeroDePagos;

        this.fireService.addCompradores(empleado);
        this.accionesService.presentToast("Empleado Agregado");
      } else{
        this.accionesService.presentToast("Datos mal ingresados");
      }
    }}]);
    this.modalCtrl.dismiss();
  }

  async compradorDadoDeBaja(){
    this.accionesService.presentAlertDatosCompraDadoDeBaja("Nuevo comprador ", "Completa los datos de la compra", [{text: 'Cancelar',handler: (bla) => {
      this.confirmarCompra = false;
      this.accionesService.presentToast("Compra cancelada");}
    }, {text: 'Agregar',handler: (bla) => {
      if(bla.Precio > 0 && bla.numeroDePagos > 0){

        this.comprador.activo = false;
        this.comprador.nombre = bla.nombreComprador;
        this.comprador.articulo = bla.Articulo;
        this.comprador.cantidad = bla.Precio;
        this.comprador.pagosT = bla.numeroDePagos;
        this.comprador.pagosR = bla.numeroDePagos;

        this.fireService.addCompradores(this.comprador);
        this.modalCtrl.dismiss();
        this.accionesService.presentToast("Empleado Agregado");
      } else{
        this.modalCtrl.dismiss();
        this.accionesService.presentToast("Datos mal ingresados");
      }
      
    }}]);
  }

  buscar( event ){
    this.textoBuscar = event.detail.value;
  }

}
