import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  favoriteAssets: string[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getFavourites();
    this.navigation();
  }

  getFavourites() {
    let temp = localStorage.getItem('favourites');
    if (temp) this.favoriteAssets = JSON.parse(temp);
  }

  navigation() {
    if (this.favoriteAssets.length > 0) {
      this.router.navigate(['favourites']);
    } else {
      this.router.navigate(['home']);
    }
  }
}
