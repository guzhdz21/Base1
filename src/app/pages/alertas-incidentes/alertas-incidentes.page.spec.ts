import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertasIncidentesPage } from './alertas-incidentes.page';

describe('AlertasIncidentesPage', () => {
  let component: AlertasIncidentesPage;
  let fixture: ComponentFixture<AlertasIncidentesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertasIncidentesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertasIncidentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
