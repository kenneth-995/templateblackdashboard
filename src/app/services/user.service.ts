import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { User } from '../models/entities/user-model';
import { UserLoginDto } from '../models/dto/UserLoginDto';
import { UserUpdateProfile } from '../models/dto/user/UserUpdateProfile';
import { ChangePswdDto } from '../models/dto/user/ChangePswdDto';

import { CreateSpecialistAdminDto } from 'src/app/models/dto/user/CreateSpecialistAdminDto';
import { CreateSpecialistDto } from 'src/app/models/dto/user/CreateSpecialistDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userLogged: User;
  public base_url = environment.BASE_URL;

  constructor(private htttClient: HttpClient, private router: Router) { }

  login(formData: UserLoginDto) {
    return this.htttClient.post(this.base_url+'/auth/login', formData);
  }

  logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    this.router.navigateByUrl('/login');
  }

  saveUserLocalStorage(user:User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserLocalStorage() : User{
    return JSON.parse(localStorage.getItem('user'));
  }

  
  public getUserById(userId: number) {
    return this.htttClient.get(this.base_url+'/user/'+userId );
  }

  public getAllUsers() {
    return this.htttClient.get(this.base_url + '/user/');
  }

  public getAllUsersByClinicId(clinicId: number) {
    return this.htttClient.get(this.base_url + '/user/clinic/'+ clinicId);
  }

  public getUserRole() {
    return this.htttClient.get(this.base_url+'/auth/roleuser');
  }

  public getUserLogged() {
    return this.userLogged;
  }

  public setUserLogged(user: User) {
      this.userLogged = user;
      this.saveUserLocalStorage(user)
  }

  public updateUserProfile(user: UserUpdateProfile, id:number) {
    return this.htttClient.put(this.base_url+'/auth/updateuser/'+id, user);
  }

  public updatePasswd (form: ChangePswdDto, id:number) {
    return this.htttClient.put(this.base_url+'/auth/updatepassword/'+id, form);
  }

  public deactivateUser(id:number) {
    return this.htttClient.delete(this.base_url+'/auth/deactivate/'+id);
  }

  public createSpecialist(specialistDto: CreateSpecialistDto) {
    return this.htttClient.post(this.base_url+'/auth/processregisteruser/', specialistDto);
  }

  public createSpecialistAdmin(specialistAdminDto: CreateSpecialistAdminDto) {
    return this.htttClient.post(this.base_url+'/auth/processregisteradmin', specialistAdminDto);
  }


}
