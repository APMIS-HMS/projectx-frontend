import { environment } from "./../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  login_on = false;
  pwdReset_on = false;
  platformName = "";
  platformLogo = "";
  secondaryLogo;
  title;

  constructor(private titleService: Title) {
    this.title = environment.title;
    this.titleService.setTitle(this.title);
    this.platformName = environment.platform;
    this.platformLogo = environment.logo;
    this.secondaryLogo = environment.secondary_logo;
  }

  ngOnInit() {
    this.login_show();
  }
  login_show() {
    this.login_on = true;
    this.pwdReset_on = false;
  }
  pwdReset_show() {
    this.pwdReset_on = true;
    this.login_on = false;
  }
  overlay_onClick(e) {
    if (e.srcElement.id === "form-modal") {
    }
  }

  close_onClick(message: boolean): void {
    this.login_on = false;
    this.pwdReset_on = false;
  }
}
