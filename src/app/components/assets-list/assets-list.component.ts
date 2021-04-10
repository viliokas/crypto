import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { combineLatest, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CoinService } from 'src/app/services/coin.service';
import { Asset } from '../asset/asset.interface';
import { BaseComponent } from '../base/base-component';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsListComponent extends BaseComponent implements OnInit {
  @Input() favouriteMode: boolean = false;
  assets: Asset[] = [];
  favoriteAssets: string[] = [];
  searchValue = '';
  forkJoinAssetsAPI = combineLatest([
    this.coinService.getAssets(),
    this.coinService.getAssetsIcons(5),
  ]);

  constructor(private coinService: CoinService, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.liveAssetsRefresh();
  }

  // Sockets could be used.
  // Did not found pagination in coinapi APIs.
  // Best solution to use infinity scroll to load data on scroll for better UX.
  liveAssetsRefresh() {
    timer(0, 1000)
      .pipe(
        this.unsubsribeOnDestroy,
        switchMap(() => this.forkJoinAssetsAPI)
      )
      .subscribe((data) => {
        this.getFavourites();
        let icons = data[1];
        let assets = data[0]
          // filter so only crypto assets would be shown.
          // slice 200, because response is to big, have to manage it the other way.
          // also instead of refreshing whole list we can go trough list and refresh only assets prices instead of resfreshing whole data.
          // there is a lot of room for solution optimisation.
          .filter(
            (asset: any) =>
              asset.type_is_crypto === 1 && asset.volume_1day_usd !== 0
          )
          .slice(0, 200);

        this.assets = assets.map((asset: Asset) => {
          asset.favourite = this.favoriteAssets.includes(asset.asset_id);
          asset.iconUrl = icons.find(
            (icon: any) => icon.asset_id === asset.asset_id
          )?.url;
          return asset;
        });

        if (this.favouriteMode) {
          this.assets = this.assets.filter((asset) => asset.favourite);
        }
        this.cd.markForCheck();
      });
  }

  toggleFavorite(asset: Asset) {
    if (asset.favourite) this.favoriteAssets.push(asset.asset_id);
    else
      this.favoriteAssets = this.favoriteAssets.filter(
        (favoriteAsset) => favoriteAsset !== asset.asset_id
      );
    localStorage.setItem('favourites', JSON.stringify(this.favoriteAssets));
  }

  getFavourites() {
    let temp = localStorage.getItem('favourites');
    if (temp) this.favoriteAssets = JSON.parse(temp);
  }
}
