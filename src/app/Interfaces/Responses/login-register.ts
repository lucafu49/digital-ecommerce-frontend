export interface LoginUser {
    email: string;
    emailValidated: boolean;
    id: string;
    role: string;
    username: string;
}

export interface LoginAtt{
  token : string,
  user : LoginUser
}

export interface LoginResponse{
    user : LoginAtt
}

export interface RegisterUserEntity {
    id: string;
    email: string;
    username: string;
    role: string;
  }
  
  export interface RegisterUser {
    userEntity: RegisterUserEntity;
  }
  
  export interface RegisterResponse {
    user: RegisterUser;
    token: string;
  }
