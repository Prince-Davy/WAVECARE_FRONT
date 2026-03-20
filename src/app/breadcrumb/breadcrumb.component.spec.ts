import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';


import { BreadcrumbComponent } from './breadcrumb.component';

describe('PatientBreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', [
      { labelKey: 'test1', link: ['/'] },
      { labelKey: 'test2', ariaLabel: 'second' },
    ]);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});