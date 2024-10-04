import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from 'src/app/admin/services/profiles.service';
import { SectionP } from 'src/app/admin/services/profiles.service';
import { UserService } from 'src/app/admin/services/user.service';
@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit {
  userForm!: FormGroup;
  profiles: SectionP[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private serviceProfile: ProfilesService,
    private serviceAddUser: UserService,
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      profile: ['', [Validators.required]],
    });

    this.serviceProfile.getProfile().subscribe({
      next: (response) => {
        this.profiles = response.object;
        console.log('Perfiles obtenidos:', this.profiles);
      },
      error: (err) => {
        console.error('Error al cargar perfiles:', err);
      }
    })
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const userData = {
      email: this.userForm.get('email')?.value,
      fullName: this.userForm.get('fullName')?.value,
      profileId: this.userForm.get('profile')?.value,
      dateOfBirth: new Date(),
    }

    this.serviceAddUser.addUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario agregado:', response);
        this.userForm.reset();
      },
      error: (err) => {
        console.error('Error al agregar usuario:', err);
      }
    });
  }
}
