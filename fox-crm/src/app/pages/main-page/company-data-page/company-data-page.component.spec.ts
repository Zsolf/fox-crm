import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDataPageComponent } from './company-data-page.component';

describe('CompanyDataPageComponent', () => {
  let component: CompanyDataPageComponent;
  let fixture: ComponentFixture<CompanyDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDataPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
