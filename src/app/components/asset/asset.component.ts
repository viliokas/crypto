import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Asset } from './asset.interface';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetComponent implements OnInit {
  defaultUrl =
    'https://cdn1.iconfinder.com/data/icons/navigation-elements/512/round-empty-circle-function-512.png';
  @Input() asset: Asset | undefined;
  @Output() toggleFavorite = new EventEmitter<any>();
  constructor(private cd: ChangeDetectorRef) {}

  public toggleSelected() {
    if (this.asset) {
      this.asset.favourite = !this.asset?.favourite;
      this.toggleFavorite.emit(this.asset);
      this.cd.markForCheck();
    }
  }

  ngOnInit(): void {}
}
