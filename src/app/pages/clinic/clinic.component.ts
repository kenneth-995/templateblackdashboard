import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { UploadFileService } from 'src/app/services/upload-file.service';

import { ClinicDto } from 'src/app/models/dto/clinic/ClinicDto'
import { UpdateCreateClinicDto } from 'src/app/models/dto/clinic/UpdateCreateClinicDto'
import { User } from 'src/app/models/entities/user-model';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;
  @ViewChild("modalEdit", { static: false }) modalEdit: TemplateRef<any>;
  @ViewChild("modalUpdate", { static: false }) modalUpdate: TemplateRef<any>;
  

  private destroy$ = new Subject();

  public userLogged: User;
  public roleUser: number;

  public clinic: ClinicDto = new ClinicDto;
  public clinicForUpdate: UpdateCreateClinicDto= new UpdateCreateClinicDto;

  public file: File

  public uploadPhotoForm: FormGroup;
  public observableuploadPhotoForm: Subscription = new Subscription();

  public updateForm: FormGroup;
  public observableupdateForm: Subscription = new Subscription();

  public imageSrc: string;

  public showButtonsForm: boolean = false;

  public textTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService,
    private clinicService: ClinicService,
    private uploadFileService: UploadFileService) { }

  ngOnInit(): void {

    if (this.userService.userLogged != null) {
      this.userLogged = this.userService.userLogged;
    } else {
      this.userLogged = this.userService.getUserLocalStorage()
    }

    this.getData();

    this.uploadPhotoForm = this.fb.group({
      file: null
    })

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
    });

  }

  private getData() {
    this.userService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(
      (res: number) => {
        this.roleUser = res;
        if (res === 2 || res === 3) {
          console.log('role admin or user')
          this.getClinic();
          this.textTitle = 'Edit Clinic';

        } else {
          this.textTitle = 'Profile Company';
          //placeholder clinica
          let noCLinic = new ClinicDto;
          noCLinic.id = 0;
          noCLinic.address = "Mountain View, Santa Clara, California 94043, United States";
          noCLinic.name = "YAPP Company"
          noCLinic.photo = "./../../../assets//img//yappimg.png"
          noCLinic.phoneNumber = "690180007"
          noCLinic.email = "yappaplication@gmail.com";
          this.clinic = noCLinic;
          this.inicializeForm();

        }
      }
    );
  }

  private getClinic() {
    this.clinicService.getClinic(this.userLogged.clinicId).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.clinic = res;
        console.log(res)
        this.inicializeForm();
      }
    );
  }

  private inicializeForm(){ 
    this.showButtonsForm = false;
    this.updateForm.reset();
    this.uploadPhotoForm.reset();

    this.updateForm.controls['name'].setValue(this.clinic.name);
    this.updateForm.controls['address'].setValue(this.clinic.address);
    this.updateForm.controls['phoneNumber'].setValue(this.clinic.phoneNumber);
    this.updateForm.controls['email'].setValue(this.clinic.email);

    let _name= this.clinic.name;
    let _address= this.clinic.address;
    let _phoneNumber= this.clinic.phoneNumber;
    let _email= this.clinic.email;

    // only the clinic admin (this.roleUser === 2) can update, the superadmin really has a fictitious clinic assigned
    if (this.roleUser === 1 || this.roleUser === 3) {
      this.updateForm.controls['name'].disable()
      this.updateForm.controls['address'].disable()
      this.updateForm.controls['phoneNumber'].disable()
      this.updateForm.controls['email'].disable()
    } 

    this.observableuploadPhotoForm = this.updateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field) => {
        console.log('ClinicFormFOTO subscriber')
        if (
            this.updateForm.controls['name'].value != _name || 
            this.updateForm.controls['address'].value != _address || 
            this.updateForm.controls['phoneNumber'].value != _phoneNumber || 
            this.updateForm.controls['email'].value != _email 
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

  private updatePhotoClinic() {
    var formData: any = new FormData();
    formData.append("file", this.uploadPhotoForm.get('file').value);
    this.uploadFileService.uploadFileClinic(formData, this.clinic.id).subscribe(
      res => {
        this.clinic.photo = res['url']
        this.showButtonsForm = false;
      });

  }

  public sendForms(){
    this.clinicService.updateClinic(this.updateForm.value, this.clinic.id).pipe(takeUntil(this.destroy$)).subscribe(
      (res: ClinicDto)=> {
        this.showButtonsForm = false;
        this.clinic = res
        this.toast.success('Update clinic', 'Successfully')
      }
    );
    if (this.uploadPhotoForm.get('file').value != null) {
      this.updatePhotoClinic();
    } 

  }

  public cancelUpdate() {
    this.inicializeForm();
    this.imageSrc = '';
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.uploadPhotoForm.get('file').setValue(file)

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.showButtonsForm = true;
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
