import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEnviosComponent } from './registro-envios.component';

describe('RegistroEnviosComponent', () => {
  let component: RegistroEnviosComponent;
  let fixture: ComponentFixture<RegistroEnviosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroEnviosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEnviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
