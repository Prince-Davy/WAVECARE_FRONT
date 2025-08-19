import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AssistanceComponent } from '@app/features/assistance/components/assistance/assistance.component';

describe('AssistanceComponent', () => {
  let component: AssistanceComponent;
  let fixture: ComponentFixture<AssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssistanceComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.assistanceForm.controls['nom'].setValue('Doe');
    component.assistanceForm.controls['prenom'].setValue('John');
    component.assistanceForm.controls['email'].setValue('***REMOVED***');
    component.assistanceForm.controls['objet'].setValue('Identifiant');
    component.assistanceForm.controls['description'].setValue('This is a test description.');

    expect(component.assistanceForm.valid).toBeTruthy();
  });

  it('should have an invalid form when fields are empty or incorrect', () => {
    component.assistanceForm.controls['nom'].setValue('');
    component.assistanceForm.controls['prenom'].setValue('');
    component.assistanceForm.controls['email'].setValue('invalid-email');
    component.assistanceForm.controls['objet'].setValue('');
    component.assistanceForm.controls['description'].setValue('short');

    expect(component.assistanceForm.invalid).toBeTruthy();
  });

  it('should set submissionSuccess to true on valid form submission', () => {
    component.assistanceForm.controls['nom'].setValue('Doe');
    component.assistanceForm.controls['prenom'].setValue('John');
    component.assistanceForm.controls['email'].setValue('***REMOVED***');
    component.assistanceForm.controls['objet'].setValue('Identifiant');
    component.assistanceForm.controls['description'].setValue('This is a test description.');

    component.onSubmit();

    expect(component.submissionSuccess).toBeTrue();
  });

  it('should set submissionSuccess to false on invalid form submission', () => {
    component.assistanceForm.controls['nom'].setValue('');
    component.assistanceForm.controls['prenom'].setValue('');
    component.assistanceForm.controls['email'].setValue('invalid-email');
    component.assistanceForm.controls['objet'].setValue('');
    component.assistanceForm.controls['description'].setValue('short');

    component.onSubmit();

    expect(component.submissionSuccess).toBeFalse();
  });
});
