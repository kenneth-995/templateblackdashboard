import { Component, OnInit } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user-model';

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
  role:number;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: "",
    role: 3
  },
  {
    path: "/patients",
    title: "Patients",
    rtlTitle: "الرموز",
    icon: "icon-atom",
    class: "",
    role: 3
  },
  {
    path: "/medicalsheet",
    title: "Medical Sheet",
    rtlTitle: "خرائط",
    icon: "icon-pin",
    class: "" ,
    role: 3
  },
  {
    path: "/notifications",
    title: "Notifications Treatments",
    rtlTitle: "إخطارات",
    icon: "icon-bell-55",
    class: "",
    role: 3
  },

  /* {
    path: "/user",
    title: "User Profile",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-single-02",
    class: ""
  }, */
  {
    path: "/tables",
    title: "Table List Reports",
    rtlTitle: "قائمة الجدول",
    icon: "icon-puzzle-10",
    class: "",
    role: 3
  },
  {
    path: "/typography",
    title: "Typography Management Specialists",
    rtlTitle: "طباعة",
    icon: "icon-align-center",
    class: "",
    role: 2
  },
  {
    path: "/clinics",
    title: "Management clinics",
    rtlTitle: "طباعة",
    icon: "icon-align-center",
    class: "",
    role: 1
  }

  ,
  {
    path: "/clinic",
    title: "Clinic",
    rtlTitle: "طباعة",
    icon: "icon-align-center",
    class: "",
    role: 2
  }
  
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  private destroy$ = new Subject();
  menuItems: any[];

  public userLogged: User;
  public roleUser: number;

  constructor(private userService: UserService) {}

  ngOnInit() {
    
    this.addItemsByRole();
    if (this.userService.userLogged != null) {
      this.userLogged = this.userService.userLogged;
    } else {
      this.userLogged = this.userService.getUserLocalStorage()
    }

    //ROUTES.forEach(e=>console.log(e))
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  private addItemsByRole() {
    this.userService.getUserRole().pipe(takeUntil(this.destroy$)).subscribe(
      (res: number) => {
        this.roleUser = res;

        this.menuItems = ROUTES.filter(menuItem => menuItem.role >= this.roleUser);


      }, error => {
        console.log('error in sidebarcomponent')
        console.log(error)
      });
  }
}
