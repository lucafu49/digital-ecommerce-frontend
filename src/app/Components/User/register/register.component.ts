import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../../Services/client.service';
import { Client } from '../../../Interfaces/client';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm : FormGroup;
  showPassword:any;
  showConfirmPassword:any;


  constructor(private cService: ClientService,private formBuilder:FormBuilder,private route:Router){
    this.registerForm = this.formBuilder.group({
      username:["",[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      mail:["",[Validators.required,Validators.email,Validators.minLength(8),Validators.maxLength(20)]],
      password:["",[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      confirmPassword:["",[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
    },
    { validator: this.passwordMatchValidator }
  );
  }

  onSubmit(){

    if(this.registerForm.valid){

      const newClient = {
        id : 0,
        email : this.registerForm.value.mail,
        username : this.registerForm.value.username,
        password : this.registerForm.value.password,
        confirmPassword : this.registerForm.value.confirmPassword
      }

      this.registerClient(newClient);
    }

  }

  registerClient(client : any){

    this.cService.registerClient(client).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error("Error: ", error );
      }
    })
  }


  togglePasswordVisibility(field: string) {
    if (field === 'password') {
        this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  passwordMatchValidator(control:AbstractControl){
    return control.get('password')?.value ===
    control.get('confirmPassword')?.value
    ? null
    : {mismatch:true};
  }
}
