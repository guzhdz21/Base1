import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeCabinaPage } from './home-cabina.page';

describe('HomeCabinaPage', () => {
  let component: HomeCabinaPage;
  let fixture: ComponentFixture<HomeCabinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCabinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCabinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
