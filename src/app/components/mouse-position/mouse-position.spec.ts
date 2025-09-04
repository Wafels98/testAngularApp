import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MousePosition } from './mouse-position';

describe('MousePosition', () => {
  let component: MousePosition;
  let fixture: ComponentFixture<MousePosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MousePosition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MousePosition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
