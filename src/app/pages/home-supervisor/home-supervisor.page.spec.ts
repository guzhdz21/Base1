import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeSupervisorPage } from './home-supervisor.page';

describe('HomeSupervisorPage', () => {
  let component: HomeSupervisorPage;
  let fixture: ComponentFixture<HomeSupervisorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSupervisorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
