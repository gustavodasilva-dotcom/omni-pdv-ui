import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosClientModalComponent } from './pos-client-modal.component';

describe('PosClientModalComponent', () => {
  let component: PosClientModalComponent;
  let fixture: ComponentFixture<PosClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosClientModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
