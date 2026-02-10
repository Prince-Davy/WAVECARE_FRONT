import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFiltersComponent } from './advanced-filters.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('AdvancedFiltersComponent', () => {
  let component: AdvancedFiltersComponent;
  let fixture: ComponentFixture<AdvancedFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdvancedFiltersComponent,
        FormsModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvancedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('role test devrait etre checké', () => {
    const key = 'roles';
    component.onToggleArray(key, 'test', true);
    expect(component.filtersForm.get(key)?.value).toContain('test');
  })

  it('statut testStatus devrait etre checké', () => {
    const key = 'statuses';
    component.onToggleArray(key, 'testStatus', true);
    expect(component.filtersForm.get(key)?.value).toContain('testStatus');
  })

  it('role test devrait etre unchecked', () => {
    const key = 'roles';
    component.onToggleArray(key, 'test', false);
    expect(component.filtersForm.get(key)?.value).not.toContain('test');
  })

  it('statut testStatus devrait etre unchecked', () => {
    const key = 'statuses';
    component.onToggleArray(key, 'testStatus', false);
    expect(component.filtersForm.get(key)?.value).not.toContain('testStatus');
  })

  it('devrait émettre filtersChanged lorsque applyFilters est appelé', () => {
    spyOn(component.filtersChanged, 'emit');
    component.filtersForm.get('role')?.setValue('test');
    component.applyFilters();
    expect(component.filtersChanged.emit).toHaveBeenCalled();
  })
});
