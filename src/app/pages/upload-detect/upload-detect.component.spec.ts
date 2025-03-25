import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDetectComponent } from './upload-detect.component';

describe('UploadDetectComponent', () => {
  let component: UploadDetectComponent;
  let fixture: ComponentFixture<UploadDetectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDetectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
