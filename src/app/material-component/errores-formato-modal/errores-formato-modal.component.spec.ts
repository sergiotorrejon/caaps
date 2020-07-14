import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroresFormatoModalComponent } from './errores-formato-modal.component';

describe('ErroresFormatoModalComponent', () => {
  let component: ErroresFormatoModalComponent;
  let fixture: ComponentFixture<ErroresFormatoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErroresFormatoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErroresFormatoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
