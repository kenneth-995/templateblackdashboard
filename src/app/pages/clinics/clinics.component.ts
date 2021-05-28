import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { UploadFileService } from 'src/app/services/upload-file.service';

import { ClinicDto } from 'src/app/models/dto/clinic/ClinicDto'
import { UpdateCreateClinicDto } from 'src/app/models/dto/clinic/UpdateCreateClinicDto'
import { User } from 'src/app/models/entities/user-model';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;
  @ViewChild("modalCreateEdit", { static: false }) modalCreateEdit: TemplateRef<any>;

  private destroy$ = new Subject();

  public userLogged: User;
  public roleUser: number;

  public clinics: ClinicDto[];

  public file: File
  
  public uploadPhotoForm: FormGroup;
  public observableuploadPhotoForm: Subscription = new Subscription();

  public createUpdateForm: FormGroup;
  public observablecreateUpdateForm: Subscription = new Subscription();

  public imageSrc: string;

  public showButtonsForm: boolean = false;

  public textCreateUpdateModal: string;
  public isCreated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private modalService: NgbModal,
    private userService: UserService,
    private clinicService: ClinicService,
    private uploadFileService: UploadFileService) {

  }
  ngOnInit(): void {

    if (this.userService.userLogged != null) {//null if refresh browser
      this.userLogged = this.userService.userLogged;
    } else {
      console.log('[errorPatientComponent] user==null!');
      console.log(this.userService.userLogged) 
      this.userLogged = this.userService.getUserLocalStorage()
    }

    this.getData();

    this.uploadPhotoForm = this.fb.group({
      file: null
    })

    this.createUpdateForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['',Validators.required],
    });
  }

  getData() {

    this.userService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(
      (res: number) => {
        this.roleUser = res;
        if (res === 1) {
          this.getAllClinics();
        }  else {
          this.router.navigateByUrl('/login');
          this.userService.logout();
          console.log('role admin or user no deveria estar aqui')
        }
      }
    );

  }

  private inicializeFormCreate() {
    this.textCreateUpdateModal = 'Create ';
    this.observablecreateUpdateForm.unsubscribe();
    this.showButtonsForm = false;
    this.isCreated = true;
    this.createUpdateForm.reset();
    //set form
    this.createUpdateForm.controls['id'].setValue(0);
    this.createUpdateForm.controls['name'].setValue('');
    this.createUpdateForm.controls['address'].setValue('');
    this.createUpdateForm.controls['phoneNumber'].setValue('');
    this.createUpdateForm.controls['email'].setValue('');
        

    this.observablecreateUpdateForm = this.createUpdateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field) => {
        console.log('createPatientForm subscriber')
        if (
            this.createUpdateForm.valid &&
            this.createUpdateForm.controls['name'].value != '' && this.createUpdateForm.controls['name'].value != null &&
            this.createUpdateForm.controls['address'].value != '' && this.createUpdateForm.controls['address'].value != null &&
            this.createUpdateForm.controls['phoneNumber'].value != '' && this.createUpdateForm.controls['phoneNumber'].value != null &&
            this.createUpdateForm.controls['email'].value != '' && this.createUpdateForm.controls['email'].value != null 
          ) {

          this.showButtonsForm = true;
        }
        else {
          this.showButtonsForm = false;
        }
      }
    );
  }

  private inicializeFormEdit(clinic: ClinicDto, index: number){
    this.observableuploadPhotoForm.unsubscribe();
    this.observablecreateUpdateForm.unsubscribe();

    this.isCreated = false;
    this.showButtonsForm = false;
    this.createUpdateForm.reset();
    this.uploadPhotoForm.reset();
    this.textCreateUpdateModal = 'Update ';
    this.imageSrc = clinic.photo;

    //set form data
    this.createUpdateForm.controls['id'].setValue(clinic.id);
    this.createUpdateForm.controls['name'].setValue(clinic.name);
    this.createUpdateForm.controls['address'].setValue(clinic.address);
    this.createUpdateForm.controls['phoneNumber'].setValue(clinic.phoneNumber);
    this.createUpdateForm.controls['email'].setValue(clinic.email);
    

    //detect change in patient
    let _name= clinic.name;
    let _address= clinic.address;
    let _phoneNumber= clinic.phoneNumber;
    let _email= clinic.email;


    this.observablecreateUpdateForm = this.createUpdateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field) => {
        console.log('createClinicFormFOTO subscriber')
        if (
            this.createUpdateForm.controls['name'].value != _name || 
            this.createUpdateForm.controls['address'].value != _address || 
            this.createUpdateForm.controls['phoneNumber'].value != _phoneNumber || 
            this.createUpdateForm.controls['email'].value != _email 
          ) {

            this.showButtonsForm = true;
        }
        else {
          this.showButtonsForm = false;
        }
      }
    );

    this.observableuploadPhotoForm = this.uploadPhotoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field) => {
        if (this.uploadPhotoForm.get('file').value != null) this.showButtonsForm = true;
        else this.showButtonsForm = false;
      }
    );
  }

  public openModalCreateClinic() {
    this.inicializeFormCreate();
    this.modalService.open(this.modalCreateEdit).result.then(
      r => {
        if (r === '1') { // CONFIRM CREATE
          this.createClinic(this.createUpdateForm.value);
        } else {
          // CANCEL CREATE
        }
      }
    );


  }

  public openModalEditClinic(clinic:ClinicDto, idx:number) {
    //INICIALIZE FORM
    this.inicializeFormEdit(clinic, idx);
    //OPEN MODAL
    this.modalService.open(this.modalCreateEdit).result.then(
      r => {
        if (r === '1') {
          console.log('CONFIRM EDITED')
          this.updateClinic(this.createUpdateForm.value, idx);

          //SET CLINIC FILE
          if (this.uploadPhotoForm.get('file').value != null) {
            this.updatePhotoClinic(clinic, idx);
          }

        } else {
          //CANCEL EDITED
        }
      }
    );
  }

  public openModalDeleteClinic(id:number, idx:number) {
    this.modalService.open(this.modalDelete).result.then(
      r => {
        if (r === '1') { //CONFIRM DELETE
          this.deteleClinic(id, idx)
        } else {
          //DISCARD DELETE
        }
      }
    );
  }

  private getAllClinics() {
    this.clinicService.getAllClinics().pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.clinics = res;
      }
    );
  }

  private updateClinic(clinic: UpdateCreateClinicDto, idx:number) {
    console.log(clinic)
    this.clinicService.updateClinic(clinic, clinic.id).pipe(takeUntil(this.destroy$)).subscribe(
      (res:ClinicDto) => {
        this.clinics[idx] = res;
        this.toast.success('Updated clinic', 'Successfully')
      }
    );
  }

  private updatePhotoClinic(clinic:ClinicDto, idx:number) {
    var formData: any = new FormData();
    formData.append("file", this.uploadPhotoForm.get('file').value);
    this.uploadFileService.uploadFileClinic(formData, clinic.id).subscribe(
      res => {
        console.log(res)
        this.clinics[idx].photo = res['url']
      });

  }

  private createClinic(clinic: UpdateCreateClinicDto) {
    this.clinicService.createClinic(clinic).pipe(takeUntil(this.destroy$)).subscribe(
      (res:ClinicDto) => {
        this.clinics.push(res);
        this.toast.success('Created clinic', 'Successfully')
      }
    );
  }

  private deteleClinic(id:number, idx:number) {
    this.clinicService.deleteClinic(id).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.clinics.splice(idx, 1);
        this.toast.success('Delete clinic', 'Successfully');
      }
    );
  }

  public onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.uploadPhotoForm.get('file').setValue(file)

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
