import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvIndexComponent } from './pdv-index.component';

describe('PdvIndexComponent', () => {
  let component: PdvIndexComponent;
  let fixture: ComponentFixture<PdvIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdvIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdvIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
