import { Routes } from "@angular/router";

import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { PatientsComponent } from "../../pages/patients/patients.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { ClinicsComponent } from "src/app/pages/clinics/clinics.component";
import { ClinicComponent } from 'src/app/pages/clinic/clinic.component';
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  { path: "patients", component: PatientsComponent, canActivate: [AuthGuard] },
  { path: "maps", component: MapComponent, canActivate: [AuthGuard] },
  { path: "notifications", component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: "user", component: UserComponent, canActivate: [AuthGuard] },
  { path: "tables", component: TablesComponent, canActivate: [AuthGuard] },
  { path: "typography", component: TypographyComponent, canActivate: [AuthGuard] },
  { path: "clinics", component: ClinicsComponent, canActivate: [AuthGuard] },
  { path: "clinic", component: ClinicComponent, canActivate: [AuthGuard] }, 
  // { path: "rtl", component: RtlComponent, canActivate: [AuthGuard] }
];
