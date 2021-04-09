import { Pipe, PipeTransform } from '@angular/core';
import { Asset } from 'src/app/components/asset/asset.interface';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: Asset[], input: string): any[] {
    if (input) {
      input = input.toLocaleLowerCase();
      return value.filter(
        (val: Asset) =>
          val.asset_id.toLocaleLowerCase().indexOf(input) >= 0 ||
          val.name.toLocaleLowerCase().indexOf(input) >= 0
      );
    } else {
      return value;
    }
  }
}
