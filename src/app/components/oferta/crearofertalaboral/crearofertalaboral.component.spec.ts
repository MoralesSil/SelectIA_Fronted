import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearofertalaboralComponent } from './crearofertalaboral.component';

describe('CrearofertalaboralComponent', () => {
  let component: CrearofertalaboralComponent;
  let fixture: ComponentFixture<CrearofertalaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearofertalaboralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearofertalaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
