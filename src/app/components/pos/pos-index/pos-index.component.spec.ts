import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosIndexComponent } from './pos-index.component';

describe('PosIndexComponent', () => {
  let component: PosIndexComponent;
  let fixture: ComponentFixture<PosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
