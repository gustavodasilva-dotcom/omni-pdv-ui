import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvProductListItemComponent } from './pdv-product-list-item.component';

describe('PdvProductListItemComponent', () => {
  let component: PdvProductListItemComponent;
  let fixture: ComponentFixture<PdvProductListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdvProductListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdvProductListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
