import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResbuilderComponent } from './resbuilder.component';

describe('ResbuilderComponent', () => {
  let component: ResbuilderComponent;
  let fixture: ComponentFixture<ResbuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResbuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
