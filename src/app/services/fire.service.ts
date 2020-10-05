import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, Seguridad, Cliente, Asistencia, Dispositivo, Supervisor, Cabina, Directivo, Comprador, Finanza, DataF } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  private usuariosColletion: AngularFirestoreCollection<Usuario>;
  private usuarios: Observable<Usuario[]>;

  private seguridadColletion: AngularFirestoreCollection<Seguridad>;
  private seguridad: Observable<Seguridad[]>;

  private clientesColletion: AngularFirestoreCollection<Cliente>;
  private clientes: Observable<Cliente[]>;

  private asistenciasColletion: AngularFirestoreCollection<Asistencia>;
  private asistencias: Observable<Asistencia[]>;

  private dispositivosColletion: AngularFirestoreCollection<Dispositivo>;
  private dispositivos: Observable<Dispositivo[]>;

  private supervisoresColletion: AngularFirestoreCollection<Supervisor>;
  private supervisores: Observable<Supervisor[]>;

  private cabinasColletion: AngularFirestoreCollection<Cabina>;
  private cabinas: Observable<Cabina[]>;

  private directivosColletion: AngularFirestoreCollection<Directivo>;
  private directivos: Observable<Directivo[]>;

  private compradoresColletion: AngularFirestoreCollection<Comprador>;
  private compradores: Observable<Comprador[]>;

  private finanzasColletion: AngularFirestoreCollection<Finanza>;
  private finanzas: Observable<Finanza[]>;

  private dataFColletion: AngularFirestoreCollection<DataF>;
  private dataF: Observable<DataF[]>;

  constructor(private db: AngularFirestore) {
  }

  fireUsuario() {
    this.usuariosColletion = this.db.collection<Usuario>('usuarios');
    this.usuarios = this.usuariosColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllUsuarios() {
    await this.fireUsuario();
    return this.usuarios;
  }

  async getUsuario(id: string) {
    await this.fireUsuario();
    return this.usuariosColletion.doc<Usuario>(id).valueChanges();
  }

  async updateUsuario(usuario: Usuario, id: string) {
    await this.fireUsuario();
    return this.usuariosColletion.doc(id).update(usuario);
  }

  async addUsuario(usuario: Usuario) {
    await this.fireUsuario();
    return this.usuariosColletion.add(usuario);
  }

  async removeUsuario(id: string) {
    await this.fireUsuario();
    return this.usuariosColletion.doc(id).delete();
  }

  fireSeguridad() {
    this.seguridadColletion = this.db.collection<Seguridad>('seguridad');

    this.seguridad = this.seguridadColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllSeguridad() {
    await this.fireSeguridad();
    return this.seguridad;
  }

  async getSegridad(id: string) {
    await this.fireSeguridad();
    return this.seguridadColletion.doc<Seguridad>(id).valueChanges();
  }

  async updateSeguridad(seguridad: Seguridad, id: string) {
    await this.fireSeguridad();
    return this.seguridadColletion.doc(id).update(seguridad);
  }

  async addSeguridad(seguridad: Seguridad) {
    await this.fireSeguridad();
    return this.seguridadColletion.add(seguridad);
  }

  async removeSeguridad(id: string) {
    await this.fireSeguridad();
    return this.usuariosColletion.doc(id).delete()
  }

  fireCliente() {
    this.clientesColletion = this.db.collection<Cliente>('cliente');

    this.clientes = this.clientesColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllClientes() {
    await this.fireCliente();
    return this.clientes;
  }

  async getClientes(id: string) {
    await this.fireCliente();
    return this.clientesColletion.doc<Cliente>(id).valueChanges();
  }

  async updateClientes(cliente: Cliente, id: string) {
    await this.fireCliente();
    return this.clientesColletion.doc(id).update(cliente);
  }

  async addClientes(cliente: Cliente) {
    await this.fireCliente();
    return this.clientesColletion.add(cliente);
  }

  async removeClientes(id: string) {
    await this.fireCliente();
    return this.clientesColletion.doc(id).delete()
  }

  fireAsistencias() {
    this.asistenciasColletion = this.db.collection<Asistencia>('asistencias');

    this.asistencias = this.asistenciasColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllAsistencias() {
    await this.fireAsistencias();
    return this.asistencias;
  }

  async addAsistencias(asistencia: Asistencia) {
    await this.fireAsistencias();
    return this.asistenciasColletion.add(asistencia);
  }

  async updateAsistencias(asistencia: Asistencia, id: string) {
    await this.fireAsistencias();
    return this.asistenciasColletion.doc(id).update(asistencia);
  }

  fireDispositivos() {
    this.dispositivosColletion = this.db.collection<Dispositivo>('dispositivos');

    this.dispositivos = this.dispositivosColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllDispositivos() {
    await this.fireDispositivos();
    return this.dispositivos;
  }

  async addDispositivos(dispositivo: Dispositivo) {
    await this.fireDispositivos();
    return this.dispositivosColletion.add(dispositivo);
  }

  async updateDispositivos(dispositivo: Dispositivo, id: string) {
    await this.fireDispositivos();
    return this.dispositivosColletion.doc(id).update(dispositivo);
  }

  async removeDispositivos(id: string) {
    await this.fireDispositivos();
    return this.dispositivosColletion.doc(id).delete();
  }

  fireSupervisores() {
    this.supervisoresColletion = this.db.collection<Supervisor>('supervisores');

    this.supervisores = this.supervisoresColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllSupervisores() {
    await this.fireSupervisores();
    return this.supervisores;
  }

  async addSupervisores(supervisor: Supervisor) {
    await this.fireSupervisores();
    return this.supervisoresColletion.add(supervisor);
  }

  async updateSupervisores(supervisor: Supervisor, id: string) {
    await this.fireSupervisores();
    return this.supervisoresColletion.doc(id).update(supervisor);
  }

  async removeSupervisores(id: string) {
    await this.fireSupervisores();
    return this.supervisoresColletion.doc(id).delete();
  }

  fireCabinas() {
    this.cabinasColletion = this.db.collection<Cabina>('cabina');

    this.cabinas = this.cabinasColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllCabinas() {
    await this.fireCabinas();
    return this.cabinas;
  }

  async addCabinas(cabina: Cabina) {
    await this.fireCabinas();
    return this.cabinasColletion.add(cabina);
  }

  async updateCabinas(cabina: Cabina, id: string) {
    await this.fireCabinas();
    return this.cabinasColletion.doc(id).update(cabina);
  }

  async removeCabinas(id: string) {
    await this.fireCabinas();
    return this.cabinasColletion.doc(id).delete();
  }

  fireDirectivos() {
    this.directivosColletion = this.db.collection<Directivo>('directivos');

    this.directivos = this.directivosColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllDirectivos() {
    await this.fireDirectivos();
    return this.directivos;
  }

  async addDirectivos(directivo: Directivo) {
    await this.fireDirectivos();
    return this.directivosColletion.add(directivo);
  }

  async updateDirectivos(directivo: Directivo, id: string) {
    await this.fireDirectivos();
    return this.directivosColletion.doc(id).update(directivo);
  }

  async removeDirectivos(id: string) {
    await this.fireDirectivos();
    return this.directivosColletion.doc(id).delete();
  }

  fireCompradores() {
    this.compradoresColletion = this.db.collection<Comprador>('compradores');

    this.compradores = this.compradoresColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllCompradores() {
    await this.fireCompradores();
    return this.compradores;
  }

  async addCompradores(comprador: Comprador) {
    await this.fireCompradores();
    return this.compradoresColletion.add(comprador);
  }

  async updateCompradores(comprador: Comprador, id: string) {
    await this.fireCompradores();
    return this.compradoresColletion.doc(id).update(comprador);
  }

  async removeCompradores(id: string) {
    await this.fireCompradores();
    return this.compradoresColletion.doc(id).delete();
  }

  fireFinanzas() {
    this.finanzasColletion = this.db.collection<Finanza>('finanzas');

    this.finanzas = this.finanzasColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllFinanzas() {
    await this.fireFinanzas();
    return this.finanzas;
  }

  async addFinanzas(finanza: Finanza) {
    await this.fireFinanzas();
    return this.finanzasColletion.add(finanza);
  }

  async updateFinanzas(finanza: Finanza, id: string) {
    await this.fireFinanzas();
    return this.finanzasColletion.doc(id).update(finanza);
  }

  async removeFinanzas(id: string) {
    await this.fireFinanzas();
    return this.finanzasColletion.doc(id).delete();
  }

  fireDataF() {
    this.dataFColletion = this.db.collection<DataF>('datafinanciera');

    this.dataF = this.dataFColletion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getAllDataF() {
    await this.fireDataF();
    return this.dataF;
  }

  async addDataF(dataF: DataF) {
    await this.fireDataF();
    return this.dataFColletion.add(dataF);
  }

  async updateDataF(dataF: DataF, id: string) {
    await this.fireDataF();
    return this.dataFColletion.doc(id).update(dataF);
  }

  async removeDataF(id: string) {
    await this.fireDataF();
    return this.dataFColletion.doc(id).delete();
  }
}
