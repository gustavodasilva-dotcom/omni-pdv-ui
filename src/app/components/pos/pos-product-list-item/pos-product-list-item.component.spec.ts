import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductListItemComponent } from './pos-product-list-item.component';

describe('PosProductListItemComponent', () => {
  let component: PosProductListItemComponent;
  let fixture: ComponentFixture<PosProductListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosProductListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosProductListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
