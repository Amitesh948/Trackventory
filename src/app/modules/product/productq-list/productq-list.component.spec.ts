import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductqListComponent } from './productq-list.component';

describe('ProductqListComponent', () => {
  let component: ProductqListComponent;
  let fixture: ComponentFixture<ProductqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductqListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
