import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinanzasHomePage } from './finanzas-home.page';

describe('FinanzasHomePage', () => {
  let component: FinanzasHomePage;
  let fixture: ComponentFixture<FinanzasHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanzasHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanzasHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
