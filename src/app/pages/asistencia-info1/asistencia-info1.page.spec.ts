import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsistenciaInfo1Page } from './asistencia-info1.page';

describe('AsistenciaInfo1Page', () => {
  let component: AsistenciaInfo1Page;
  let fixture: ComponentFixture<AsistenciaInfo1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaInfo1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciaInfo1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
