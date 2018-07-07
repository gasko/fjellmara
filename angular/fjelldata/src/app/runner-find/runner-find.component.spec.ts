import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerFindComponent } from './runner-find.component';

describe('RunnerFindComponent', () => {
  let component: RunnerFindComponent;
  let fixture: ComponentFixture<RunnerFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
