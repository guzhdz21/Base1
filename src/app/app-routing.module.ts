import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'recuperar-password',
    loadChildren: () => import('./pages/recuperar-password/recuperar-password.module').then( m => m.RecuperarPasswordPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'home-guardia',
    loadChildren: () => import('./pages/home-guardia/home-guardia.module').then( m => m.HomeGuardiaPageModule)
  },
  {
    path: 'reg-asistencia',
    loadChildren: () => import('./pages/reg-asistencia/reg-asistencia.module').then( m => m.RegAsistenciaPageModule)
  },
  {
    path: 'home-rh',
    loadChildren: () => import('./pages/home-rh/home-rh.module').then( m => m.HomeRHPageModule)
  },
  {
    path: 'agregar-empleado',
    loadChildren: () => import('./pages/agregar-empleado/agregar-empleado.module').then( m => m.AgregarEmpleadoPageModule)
  },  {
    path: 'home-supervisor',
    loadChildren: () => import('./pages/home-supervisor/home-supervisor.module').then( m => m.HomeSupervisorPageModule)
  },
  {
    path: 'home-cabina',
    loadChildren: () => import('./pages/home-cabina/home-cabina.module').then( m => m.HomeCabinaPageModule)
  },
  {
    path: 'asistencia-info1',
    loadChildren: () => import('./pages/asistencia-info1/asistencia-info1.module').then( m => m.AsistenciaInfo1PageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
