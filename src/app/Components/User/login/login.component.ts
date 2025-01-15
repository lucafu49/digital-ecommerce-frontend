import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../Services/client.service';
import { LoginRequest } from '../../../Interfaces/login-request';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterOutlet,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean= false;
  message:string='';
  toastr= inject(ToastrService);

  constructor(private formBuilder:FormBuilder, private router:Router, private cService:ClientService){
    this.loginForm = this.formBuilder.group({
      email: ["",[Validators.required,Validators.email]],
      password: ["",[Validators.required,Validators.minLength(8),Validators.maxLength(30)]],
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
        this.toastr.success("Successful login!", "Success");

        const tokenData = {
          token: data.user.token,
          timeLogged: new Date().toISOString() // Tiempo en formato ISO
        };
  
        // Guardar el objeto como JSON en localStorage
        localStorage.setItem('token', JSON.stringify(tokenData));

        this.router.navigate(['/packages']);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;
  

        this.toastr.error(this.message,statusCode);
      }
    });
    
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
        this.showPassword = !this.showPassword;
    }
  }

}
