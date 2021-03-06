import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { PatientsComponent } from "../../pages/patients/patients.component";
import { MedicalsheetComponent } from "../../pages/medicalsheets/medicalsheet.component";
import { TreatmentsComponent } from "../../pages/treatments/treatments.component";
import { UserComponent } from "../../pages/user/user.component";
import { ReportsComponent } from "../../pages/reports/reports.component";
import { SpecialistsComponent } from "../../pages/specialists/specialists.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ClinicsComponent } from "src/app/pages/clinics/clinics.component";
import { ClinicComponent } from "src/app/pages/clinic/clinic.component";


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin
]);


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FullCalendarModule,
    NgSelectModule,
    NgOptionHighlightModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    ReportsComponent,
    PatientsComponent,
    SpecialistsComponent,
    TreatmentsComponent,
    MedicalsheetComponent,
    ClinicsComponent,
    ClinicComponent
    // RtlComponent
  ]
})
export class AdminLayoutModule {}
