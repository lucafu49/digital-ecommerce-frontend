import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../../Services/client.service';
import { LoginRequest } from '../../../Interfaces/login-request';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean= false;
  message:string='';

  constructor(private formBuilder:FormBuilder, private router:Router, private cService:ClientService){
    this.loginForm = this.formBuilder.group({
      email: ["",[Validators.required,Validators.email]],
      password: ["",[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
    })
  }

  onSubmit(){

    if(this.loginForm.valid){ 

      const newClient = {
        email : this.loginForm.value.email,
        password : this.loginForm.value.password,
      }

      this.loginClient(newClient);
    }

    

  }

  loginClient(client: LoginRequest){
    this.cService.loginClient(client).subscribe({
      next: (data) => {
        console.log(data);

        localStorage.setItem('token', data.user.token);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;
  
        console.error("Status:", statusCode, "message:", this.message);
      }
    });
    
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
        this.showPassword = !this.showPassword;
    }
  }

}
