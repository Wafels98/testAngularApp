import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scaleline } from './scaleline';

describe('Scaleline', () => {
  let component: Scaleline;
  let fixture: ComponentFixture<Scaleline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scaleline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scaleline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
