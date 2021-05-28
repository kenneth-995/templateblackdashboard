import { Component, OnInit } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user-model';

declare interface RouteInfo {
  path: string;
  title: string;

  icon: string;
  class: string;
  role:number;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "icon-chart-pie-36",
    class: "",
    role: 3
  },
  {
    path: "/patients",
    title: "Patients",
    icon: "icon-atom",
    class: "",
    role: 3
  },
  {
    path: "/medicalsheet",
    title: "Medical Sheet",
    icon: "icon-calendar-60",
    class: "" ,
    role: 3
  },
  {
    path: "/treatments",
    title: "Treatments",
    icon: "icon-sound-wave",
    class: "",
    role: 3
  },
  {
    path: "/reports",
    title: "Reports",
    icon: "icon-notes",
    class: "",
    role: 3
  },
  {
    path: "/specialists",
    title: "Specialists",
    icon: "icon-single-02",
    class: "",
    role: 2
  }

  ,
  {
    path: "/clinic",
    title: "My Clinic",
    icon: "icon-istanbul",
    class: "",
    role: 3
  },
  {
    path: "/clinics",
    title: "Management clinics",
    icon: "icon-bank",
    class: "",
    role: 1
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
        console.log(this.roleUser)

        this.menuItems = ROUTES.filter(menuItem => menuItem.role >= this.roleUser);


      }, error => {
        console.log('error in sidebarcomponent')
        console.log(error)
      });
  }
}
