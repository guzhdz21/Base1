import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Usuario, Finanza, DataF } from '../../interfaces/interfaces';
import { StorageService } from '../../services/storage.service';
import { FireService } from '../../services/fire.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { CalendarComponent } from 'ionic2-calendar';
import { formatDate } from '@angular/common';
import { LocalnotiService } from '../../services/localnoti.service';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { NuevoMovimientoPage } from '../nuevo-movimiento/nuevo-movimiento.page';

@Component({
  selector: 'app-finanzas-home',
  templateUrl: './finanzas-home.page.html',
  styleUrls: ['./finanzas-home.page.scss'],
})
export class FinanzasHomePage implements OnInit {

  //Variables visuales generales
  titulo: string = "Gastos";
  icono: string = "cash";
  fecha: number = 1;
  fecha2: Date;
  carga: boolean = false;
  skeleton = true;
  finanzas = [
    {
      icono: 'log-out-outline',
      nombre: 'Cerrar Sesion',
      irA: '/login'
    }
  ];
  gastos: number = 0;
  mes: string = "";

  //Variables de funcionalidad
  backButtonSub: Subscription;
  autentificacion;
  autenSub;
  eventosBorrar;
  eventSub;
  user: Usuario;
  existe: boolean = true;
  usuarioFake: Usuario = {
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
  login: string;

  //Variables de los datos del usuario
  usuarioLocal: Usuario = null;
  usuario : Usuario = {
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
  finanza: Finanza;
  id: string = null;
  recordatorios = [];
  ingresos: number = 0;
  egresos: number = 0;


  //Calendario
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: "es-MX"
  }
  viewTitle = '';
  event = {
    title: '',
    desc: '',
    startTime: null,
    endTime: null
  };
  collapseCard: boolean = true;
  minDate = new Date(new Date().getHours()).toISOString();
  @ViewChild(CalendarComponent, { static: false}) myCal: CalendarComponent;

  //Grafica
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Enero'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = ['#2dd36f']
  },
  {
    backgroundColor: [ ] = ['#eb445a']
  }
];

  public barChartData: ChartDataSets[] = [
    { data: [this.ingresos, 0], label: 'Ingresos' },
    { data: [this.egresos, 0], label: 'Egresos' }
  ];

  constructor(private storageService: StorageService,
              private fireService: FireService,
              private navCtrl: NavController,
              private accionesService: AccionesService,
              private plt: Platform,
              @Inject(LOCALE_ID) private locale: string,
              private localnoti: LocalnotiService,
              private activatedRoute: ActivatedRoute,
              private modalCtrl: ModalController) { 
                this.activatedRoute.queryParams.subscribe((res) => {
                  this.login = res.login;
                });
              }

  ngOnInit() {
  }

  //Metodos de carga
  async obtenerUsuarioLocal() {
    await this.storageService.cargarUsuario().then(res => {
      this.usuarioLocal = res;
      this.storageService.cargarId().then(res2 => {
        this.id = res2;
        this.obtenerUsuario(res2);
      })
    });
  }

  async obtenerUsuario(id: string) {
    await this.fireService.getUsuario(id).then(res => {
      res.subscribe(val => {
        this.usuario = val;
        this.obtenerFinanza(val.numero);
      });
    });
  }

  async obtenerFinanza(numero: number) {
    await this.fireService.getAllFinanzas().then(res => {
      res.subscribe(val => {
        for(var finanza of val) {
          if(finanza.numero == numero) {
            this.finanza = finanza;
            this.eventSource = [];
            for(var recordatorio of finanza.recordatorios) {
              this.obtenerRecordatorio(recordatorio);
            }
            break;
          }
        }
        this.login = "false";
      });
    });
  }

  async obtenerRecordatorio(recordatorio) {
    var event = {
      title: recordatorio.title,
      startTime: recordatorio.startTime.toDate(),
      endTime: recordatorio.endTime.toDate(),
      desc: recordatorio.desc
    }
    if(this.login != null && this.login == "true") {
      console.log("entre");
      await this.localnoti.mandarNotificaionCalendario(recordatorio.idNoti, event.title, event.desc, event.startTime);
      await this.localnoti.mandarNotificaionCalendario(recordatorio.idNoti, event.title, event.desc, event.endTime);
    }
    await this.eventSource.push(event);
  }

  async obtenerInEgresos() {
    var fecha = new Date();
    var mes = fecha.getMonth();
    var año = fecha.getFullYear();
    await this.fireService.getAllDataF().then(res => {
      res.subscribe(val => {
        this.ingresos = 0;
        this.egresos = 0;
        for(var data of val) {
          if(data.mes == mes && data.año == año) {
            for(var data2 of data.egresos) {
              this.egresos += data2.cantidad;
              this.barChartData[1].data = [this.egresos, 0];
            }
            for(var data2 of data.ingresos) {
              this.ingresos += data2.cantidad;
              this.barChartData[0].data = [this.ingresos, 0];
            }
            return;
          }
        }

        var newData: DataF = {
          mes: mes,
          año: año,
          ingresos: [],
          egresos: []
        }
        this.fireService.addDataF(newData);
      });
    });
  }
  //Metodos de verificacion
  async cargarUsuarioComparar() {
    if(this.usuarioLocal != null && this.id != null) {
      this.fireService.getUsuario(this.id).then(res => {
        res.subscribe(val => {
          if(val) {
            this.user = val;
          } else {
            this.existe = false;
          }
        });
      });
      if(this.existe) {
        this.autentificar();
      } else {
        this.procesoBorrado();
      }
    }
    return;
  }

  async borrarEventosAnteriores() {
    var fecha = new Date();
    var dia = fecha.getDate();
    if(dia == 1) {
      var mes = fecha.getMonth();
      var año = fecha.getFullYear();

      var finanza: Finanza = {
        numero: this.finanza.numero,
        recordatorios: this.finanza.recordatorios
      }
      var recordatoriosNuevos = [];
      for (var recordatorio of finanza.recordatorios) {
        if(recordatorio.startTime.toDate().getFullYear() > año 
        || (recordatorio.startTime.toDate().getMonth() > mes && recordatorio.startTime.toDate().getFullYear() == año)){
          recordatoriosNuevos.push(recordatorio);
        }
      }

      finanza.recordatorios = recordatoriosNuevos;
      //@ts-ignore
      await this.fireService.updateFinanzas(finanza, this.finanza.id);
      this.myCal.loadEvents();
    }
  }

  async autentificar() {
    if(this.user && this.usuarioLocal != null) {
      if(this.user.numero != this.usuarioLocal.numero 
        || this.usuarioLocal.contraseña != this.user.contraseña 
        || this.user.tipo != "Finanzas") {
        await this.autenSub.unsubscribe();
        await this.procesoSalida();
        await this.navCtrl.navigateRoot("/login");
      }
    }
    return;
  }

  async procesoSalida() {
    await this.accionesService.presentAlertGenerica("Alerta de Seguridad", "Algunos de tus datos indispenables" 
        + " (contraseña, numero, etc..) han sido modificados, por seguridad tendras que volver a ingresar a tu cuenta");
    await this.storageService.guardarId(null);
    await this.storageService.guardarUsuario(this.usuarioFake);
    await this.storageService.guardarNacimiento(null);
    return;
  }

  async procesoBorrado() {
    await this.autenSub.unsubscribe();
    await this.procesoBorrado2();
    return;
  }

  async procesoBorrado2() {
    await this.accionesService.presentAlertGenerica("Error", "Tu usuario no se encontra registrado," 
        + " por seguridad tendras que volver a ingresar a tu cuenta");
    await this.storageService.guardarId(null);
    await this.storageService.guardarUsuario(this.usuarioFake);
    await this.storageService.guardarNacimiento(null);
    await this.navCtrl.navigateRoot("/login");
    return;
  }

  //Metodos de la ventana e interaccion
  segment(event) {
    switch (event.detail.value) {

      case 'Gastos': {
        this.titulo = "Gastos";
        this.icono = "cash";
        break;
      }

      case 'Calendario': {
        this.titulo = "Calendario";
        this.icono = "calendar";
        this.resetEvent();
        this.today();
        this.myCal.loadEvents();
        break;
      }

    }
  }

  async redirigir(nombre: string, irA: string) {
    if(nombre == "Cerrar Sesion") {
      var ok = false;
      await this.accionesService.presentAlertPersonalizada([{text: 'Ok', handler: (blah) => {ok = true}},
      {text: 'Cancelar', handler: (blah) => {}}], "Cerrar Sesion" , 
      "Seguro que deseas cerrar sesion?");
      if(ok) {
        await this.storageService.eliminarUsuario();
        await this.localnoti.borrarTodas();
      } else {
        return;
      }
    }
    await this.navCtrl.navigateRoot(irA);
  }

  //Metodos de entrada y salida
  async ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, async () => {
      navigator["app"].exitApp();
    });
  }

  async ionViewWillEnter() {

    await this.reinicioVariables();
    this.fecha = new Date().getDay() - 1 ;
    if(this.fecha == -1) {
      this.fecha = 6;
    }

    var fecha2 = new Date();
    this.fecha2 = fecha2;
    await this.determinarMesYAño(fecha2.getMonth(), fecha2.getUTCFullYear());
    await this.obtenerUsuarioLocal();
    await this.obtenerInEgresos();

    this.autentificacion = interval(3500);
    this.autenSub = await this.autentificacion.subscribe(x => {
      console.log("verificar");
      this.cargarUsuarioComparar();
    });

    this.eventosBorrar = interval(5000);
    this.eventSub = await this.eventosBorrar.subscribe(x => {
      console.log("fecha");
      this.borrarEventosAnteriores();
      this.eventSub.unsubscribe();
    });

    this.resetEvent();
    this.today();

    await this.delay(2000);
    this.skeleton = false;
  }

  async ionViewWillLeave() {
    await this.autenSub.unsubscribe();
  }

  reinicioVariables() {
    this.titulo = "Gastos";
    this.icono = "cash";
    this.fecha = 1;
    this.carga = false;
    this.skeleton = true;
    this.gastos = 0;
    this.mes = "";

    //Variables de los datos del usuario
    this.usuarioLocal = null;
    this.usuario = {
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
    this.finanza = null;
    this.id = null;

    //Variables de funcionalidad
    this.autentificacion = null;
    this.autenSub = null;
    this.existe = true;
    this.usuarioFake = {
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
    this.user = null;
    this.ingresos = 0;
    this.egresos = 0;

    //Calendario
    this.eventSource = [];
    this.calendar = {
      mode: 'month',
      currentDate: new Date(),
      locale: "es-MX"
    }
    this.viewTitle = '';
    this.event = {
      title: '',
      desc: '',
      startTime: null,
      endTime: null
    };
    this.collapseCard= true;
    this.minDate = new Date(new Date().getHours()).toISOString();

    //Grafica
    this.barChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.barChartLabels = ['Enero'];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];
    this.chartColors = 
    [{
      backgroundColor: [ ] = ['#2dd36f']
    },
    {
      backgroundColor: [ ] = ['#eb445a']
    }
  ];
  
    this.barChartData = [
      { data: [this.ingresos, 0], label: 'Ingresos' },
      { data: [this.egresos, 0], label: 'Egresos' }
    ];

    return;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  //Metodos Calendario
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(event) { 
    let selected = new Date(event.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  async onEventSelected(event) {
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
    console.log(event);

    this.accionesService.presentAlertPersonalizada([{text: 'Borrar', handler: (blah) => {this.borrarRecordatorio(event)}},
    {text: 'Ok', handler: (bla) => {}}],
    event.title,
    "Descripcion: " + event.desc + '<br><br>Inicio:  ' + start + '<br><br>Fin:  ' + end,);
  }

  async borrarRecordatorio(event) {
    var finanza: Finanza = {
      numero: this.finanza.numero,
      recordatorios: this.finanza.recordatorios
    }
    var idNoti;
    var recordatoriosBien = [];
    for(var recordatorio of finanza.recordatorios) {
      if(recordatorio.title != event.title ||
        recordatorio.startTime.toDate().toString() != event.startTime.toString() ||
        recordatorio.endTime.toDate().toString() != event.endTime.toString() ||
        recordatorio.desc != event.desc) {
          recordatoriosBien.push(recordatorio);
      } else {
        idNoti = recordatorio.idNoti;
      }
    }
    finanza.recordatorios = recordatoriosBien;
    await this.localnoti.borrarNotificacion(idNoti);
    //@ts-ignore
    this.fireService.updateFinanzas(finanza, this.finanza.id);
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  back() { 
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
  
  next() { 
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  resetEvent() { 
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };
  }

  async addRecordatorio() {
    let eventCopy = {
      idNoti:  null,
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      desc: this.event.desc
    }

    for(var recordatorio of this.eventSource) {
      if(recordatorio.title == eventCopy.title &&
        recordatorio.desc == eventCopy.desc &&
        recordatorio.startTime.toString() == eventCopy.startTime.toString() &&
        recordatorio.endTime.toString() == eventCopy.endTime.toString()) {
        this.accionesService.presentToast("Ese mismo recordatorio ya existe")
        return;
      }
    }

    var noRepite;
    do {
      noRepite = false;
      var numero = Math.floor(Math.random() * (9000 - 1)) + 1;

      for(var recordatorio of this.finanza.recordatorios) {
        if(recordatorio.idNoti == numero) {
          noRepite = true;
          break;
        }
      }
    } while(noRepite);

    eventCopy.idNoti = numero;
    var finanza: Finanza = {
      numero: this.finanza.numero,
      recordatorios: this.finanza.recordatorios
    }
    finanza.recordatorios.push(eventCopy);
    //@ts-ignore
    await this.fireService.updateFinanzas(finanza, this.finanza.id);
    await this.localnoti.mandarNotificaionCalendario(eventCopy.idNoti, eventCopy.title, eventCopy.desc, eventCopy.startTime);
    await this.localnoti.mandarNotificaionCalendario(eventCopy.idNoti, eventCopy.title, eventCopy.desc, eventCopy.endTime);

    this.resetEvent();
    this.myCal.loadEvents();
    this.collapseCard = !this.collapseCard;
    this.accionesService.presentToast("Alerta agregada");
    return;
  }

  markDisabled = (date: Date) => {
    var dia = new Date().getDate();
    var mes = new Date().getMonth();
    var año = new Date().getFullYear();
    var current = new Date(new Date(año, mes, dia, 0, 0, 0, 0));
    return date < current;
  };

  //Metodos grafica
  async determinarMesYAño(mes: number, año: number) {
    switch (mes) {
      case 0 : {
        this.mes = "Enero";
        break;
      }
      case 1 : {
        this.mes = "Febrero";
        break;
      }
      case 2 : {
        this.mes = "Marzo";
        break;
      }
      case 3 : {
        this.mes = "Abril";
        break;
      }
      case 4 : {
        this.mes = "Mayo";
        break;
      }
      case 5 : {
        this.mes = "Junio";
        break;
      }
      case 6 : {
        this.mes = "Julio";
        break;
      }
      case 7 : {
        this.mes = "Agosto";
        break;
      }
      case 8 : {
        this.mes = "Septiembre";
        break;
      }
      case 9 : {
        this.mes = "Octubre";
        break;
      }
      case 10 : {
        this.mes = "Noviembre";
        break;
      }
      case 2 : {
        this.mes = "Diciembre";
        break;
      }
    }
    this.barChartLabels = [this.mes +" " + año.toString()];
  }

  async agregarMovimiento(tipo: string) {
    const modal = await this.modalCtrl.create({
      component: NuevoMovimientoPage,
      componentProps: {
        tipo: tipo,
        fecha: this.fecha2
      }
    });
    await modal.present();
    await modal.onDidDismiss();
  }
}
