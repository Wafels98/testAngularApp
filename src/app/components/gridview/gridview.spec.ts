import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridview } from './gridview';

describe('Gridview', () => {
  let component: Gridview;
  let fixture: ComponentFixture<Gridview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gridview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gridview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
