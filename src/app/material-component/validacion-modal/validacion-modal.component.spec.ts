import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionModalComponent } from './validacion-modal.component';

describe('ValidacionModalComponent', () => {
  let component: ValidacionModalComponent;
  let fixture: ComponentFixture<ValidacionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
