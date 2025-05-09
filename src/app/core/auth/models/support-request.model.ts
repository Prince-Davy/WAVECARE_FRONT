import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class SupportRequestModel {
  static createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      nom: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]+$')]],
      prenom: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]+$')]],
      email: ['', [Validators.required, Validators.email]],
      objet: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }
}
