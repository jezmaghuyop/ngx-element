import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxElementComponent } from './ngx-element.component';
import { createDef, LazyComponentRegistry, LAZY_CMPS_REGISTRY } from './tokens';

@Component({
  selector: 'talk-wrap',
  template: '<ws-talk></ws-talk>'
})
class MockTalkComponent {}

describe('NgxElementComponent', () => {
  let component: MockTalkComponent;
  let fixture: ComponentFixture<MockTalkComponent>;

  const lazyConfig: LazyComponentRegistry = {
    definitions: [
      createDef('talk', () => import('../../../ngx-element-app/src/app/talk/talk.module').then(m => m.TalkModule)),
      createDef('sponsor', () => import('../../../ngx-element-app/src/app/sponsor/sponsor.module').then(m => m.SponsorModule))
    ],
    prefix: 'ws'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxElementComponent,
        MockTalkComponent
      ],
      providers: [
        {
          provide: LAZY_CMPS_REGISTRY,
          useValue: lazyConfig
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
