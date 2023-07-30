import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StmGraphComponent } from './stm-graph.component';

describe('StmGraphComponent', () => {
  let component: StmGraphComponent;
  let fixture: ComponentFixture<StmGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StmGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StmGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
