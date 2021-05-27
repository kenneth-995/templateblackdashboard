import { Routes } from "@angular/router";

import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { PatientsComponent } from "../../pages/patients/patients.component";
import { MedicalsheetComponent } from "../../pages/medicalsheets/medicalsheet.component";
import { TreatmentsComponent } from "../../pages/treatments/treatments.component";
import { UserComponent } from "../../pages/user/user.component";
import { ReportsComponent } from "../../pages/reports/reports.component";
import { SpecialistsComponent } from "../../pages/specialists/specialists.component";
import { ClinicsComponent } from "src/app/pages/clinics/clinics.component";
import { ClinicComponent } from 'src/app/pages/clinic/clinic.component';
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  { path: "patients", component: PatientsComponent, canActivate: [AuthGuard] },
  { path: "medicalsheet", component: MedicalsheetComponent, canActivate: [AuthGuard] },
  { path: "treatments", component: TreatmentsComponent, canActivate: [AuthGuard] },
  { path: "user", component: UserComponent, canActivate: [AuthGuard] },
  { path: "reports", component: ReportsComponent, canActivate: [AuthGuard] },
  { path: "specialists", component: SpecialistsComponent, canActivate: [AuthGuard] },
  { path: "clinics", component: ClinicsComponent, canActivate: [AuthGuard] },
  { path: "clinic", component: ClinicComponent, canActivate: [AuthGuard] }, 
  // { path: "rtl", component: RtlComponent, canActivate: [AuthGuard] }
];
