import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTrainingComponent } from './ai-training.component';

describe('AiTrainingComponent', () => {
  let component: AiTrainingComponent;
  let fixture: ComponentFixture<AiTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
