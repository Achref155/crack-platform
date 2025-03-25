import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProposalsComponent } from './user-proposals.component';

describe('UserProposalsComponent', () => {
  let component: UserProposalsComponent;
  let fixture: ComponentFixture<UserProposalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProposalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
