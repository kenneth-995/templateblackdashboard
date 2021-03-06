import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { ClinicService } from 'src/app/services/clinic.service';

import { ClinicDto } from 'src/app/models/dto/clinic/ClinicDto';
import { User } from 'src/app/models/entities/user-model';

@Component({
  selector: "app-typography",
  templateUrl: "specialists.component.html"
})
export class SpecialistsComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;
  @ViewChild("modalCreate", { static: false }) modalCreate: TemplateRef<any>;

  private destroy$ = new Subject();

  public userLogged: User;
  public roleUser: number;

  public specialists: User[] = [];
  public specialistsAux: User[] = [];
  public isSpecialists: boolean = false;
  public clinics: ClinicDto[] = [];
  public clinic: ClinicDto = new ClinicDto;
  public clinicIdParamSearch: number = 0; //[(ngModel)]

  public createSpecialistForm: FormGroup;
  public observablecreateSpecialistForm: Subscription = new Subscription();
  public messageForm: string = '';
  public msgEmail: string = '';
  public msgPsswd: string = '';


  public showButtonsForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private modalService: NgbModal,
    private userService: UserService,
    private clinicService: ClinicService) { }

  ngOnInit(): void {
    if (this.userService.userLogged != null) this.userLogged = this.userService.userLogged;
    else this.userLogged = this.userService.getUserLocalStorage()
    this.getData();

    this.createSpecialistForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: [' ', Validators.required],
      password2: [' ', Validators.required],
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      phone: ['', Validators.required],
      collegiateNumber: [0, Validators.required],
      specialistType: ['', Validators.required],
      clinicId: ['', Validators.required],
    });
  }


  getData() {
    this.userService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(
      (res: number) => {
        this.roleUser = res;

        if (res === 1) {
          //superadmin
          this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(
            (res: User[]) => {
              this.specialists = res;
              this.specialistsAux = res;
              this.isSpecialists = this.specialists.length>0;
            }
          );

          this.clinicService.getAllClinics().pipe(takeUntil(this.destroy$)).subscribe(
            (clinics: ClinicDto[]) => {
              this.clinics = clinics;
            }
          );


        } else if (res === 2) {
          //admin / user
          this.userService.getAllUsersByClinicId(this.userLogged.clinicId)
            .pipe(takeUntil(this.destroy$)).subscribe(
              (res: User[]) => {
                this.specialists = res;
                this.specialistsAux = res;
                this.isSpecialists = this.specialists.length>0;
              }
            );
          this.clinicService.getClinic(this.userLogged.clinicId).pipe(takeUntil(this.destroy$)).subscribe(
            (clinic: ClinicDto) => {
              this.clinic = clinic;
            }
          );
        } else {
          //IT WOULD NOT HAPPEN, A USER ALWAYS HAS A ROLE
        }

      }, error => {
        this.toast.error(JSON.stringify(error));
      });
  }

  public openModalCreateNewSpecialist() {
    this.inicializeFormCreate();
    this.modalService.open(this.modalCreate).result.then(
      r => {
        if (r === '1') {
          this.registerSpecialist();
        }
      }
    );
  }

  private inicializeFormCreate() {
    this.observablecreateSpecialistForm.unsubscribe();
    this.createSpecialistForm.reset();
    let formValid: boolean = false;


    if (this.roleUser != 1) {
      this.createSpecialistForm.controls['clinicId'].setValue(this.userLogged.clinicId);
    } else {
      this.createSpecialistForm.controls['clinicId'].setValue(this.clinics[0].id);
    }

    this.observablecreateSpecialistForm = this.createSpecialistForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field) => {
        if (this.isValidEmail(this.createSpecialistForm.controls['email'].value)) {
          this.msgEmail = ''
          formValid = true;
        } else {
          this.msgEmail = 'invalid email'
          formValid = false;
        }

        let _password = this.createSpecialistForm.controls['password'].value;
        let _password2 = this.createSpecialistForm.controls['password2'].value;

        if (_password != null && _password === _password2 && _password.length >= 6) {
          this.msgPsswd = ''
          formValid = true;
        } else {
          this.msgPsswd = 'invalid passwords'
          formValid = false;
        }

        if (formValid &&
          this.createSpecialistForm.controls['username'].value != '' &&
          this.createSpecialistForm.controls['name'].value != '' &&
          this.createSpecialistForm.controls['surnames'].value != '' &&
          this.createSpecialistForm.controls['phone'].value != '' &&
          this.createSpecialistForm.controls['collegiateNumber'].value != '' &&
          this.createSpecialistForm.controls['specialistType'].value != 0) {

          this.showButtonsForm = true;
          this.messageForm = '';
          this.msgPsswd = ''
          this.msgEmail = ''
        }

        else {
          this.messageForm = 'all fields is required'
          this.showButtonsForm = false;
        }
      }
    );
  }

  private isValidEmail(value) {
    return /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/.test(value);
  }

  public openModalDeleteSpecialist(id: number, idx: number) {
    this.modalService.open(this.modalDelete).result.then(
      r => {
        if (r === '1') {
          this.deleteSpecialist(id, idx);
        }
      }
    );
  }

  private deleteSpecialist(id: number, idx: number) {
    this.userService.deactivateUser(id).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.specialists.splice(idx, 1);
        this.toast.success('Delete specialist', 'Successfully');
      }
    );
  }

  private registerSpecialist() {
    this.userService.createSpecialist(this.createSpecialistForm.value).pipe(takeUntil(this.destroy$)).subscribe(
      (res: User) => {
        this.specialists.push(this.createSpecialistForm.value) //not activate!
        this.toast.success('Registered user, it will be necessary for the user to confirm the email', 'Successfully')
      },
      (error) => {
        //console.log(error)
      }
    );
  }

  public findByParams(name: string) {
    this.specialists = this.specialistsAux;

    if (name) {
      this.specialists = this.specialists.filter(
        specialist => specialist.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (this.clinicIdParamSearch != 0) {
      this.specialists = this.specialists.filter(patient => patient.clinicId == this.clinicIdParamSearch);
    }
    
    this.isSpecialists = this.specialists.length > 0
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
