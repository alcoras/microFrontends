import { Component } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";

interface DropdownSelector {
  name: string,
  code: string
}

@Component({
  templateUrl: "WunderMobilityView.html",
  selector: "wunder-mobility-comp"
}) export class WunderMobilityComponent {
  public Themes: DropdownSelector[];

  public SelectedTheme: DropdownSelector;

  public constructor(private primeNgConfig: PrimeNGConfig) {
    const path = "assets/themes/";
    this.Themes = [
      { code: `${path}saga-blue/theme.css`, name: "Light" },
      { code: `${path}bootstrap4-dark-blue/theme.css`, name: "Dark Blue" },
      { code: `${path}arya-blue/theme.css`, name: "Dark" }
    ];

    this.SelectedTheme = this.Themes[0];
  }

  public ChangeTheme(): void {
    const el = document.getElementById("theme-link") as HTMLLinkElement;
    el.href = this.SelectedTheme.code;
  }

  public ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.ChangeTheme();
  }
}
