import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManufacturerModalComponent } from './add-manufacturer-modal.component';

describe('AddManufacturerModalComponent', () => {
  let component: AddManufacturerModalComponent;
  let fixture: ComponentFixture<AddManufacturerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddManufacturerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddManufacturerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
