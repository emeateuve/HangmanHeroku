import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatglobalComponent } from './chatglobal.component';

describe('ChatglobalComponent', () => {
  let component: ChatglobalComponent;
  let fixture: ComponentFixture<ChatglobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatglobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatglobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
