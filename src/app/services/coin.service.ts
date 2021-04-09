import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'X-CoinAPI-Key': '2BDC5F1B-7F0A-4E8D-8D58-51C966018C50',
  }),
};

@Injectable({ providedIn: 'root' })
export class CoinService {
  private cryptoBaseUrl = 'https://rest.coinapi.io/'; // URL to web api

  public cryptoCurrencies: any = [];
  public cryptoAssets: any = [];
  public cryptoSymbols: any = [];
  public assetsIcons: any = [];

  constructor(private http: HttpClient) {}

  /** GET CryptoCurrencies from the server */
  getCurrencies(): Observable<any[]> {
    if (this.cryptoCurrencies.length > 0) {
      return of(this.cryptoCurrencies);
    } else {
      let reqUrl = this.cryptoBaseUrl + 'v1/exchanges';
      return this.http.get<any[]>(reqUrl, httpOptions).pipe(
        tap((cryptoCurrencies) => {
          this.cryptoCurrencies = cryptoCurrencies;
          console.log('fetched crypto exchanges ');
        }),
        catchError(this.handleError('', []))
      );
    }
  }

  getAssets(): Observable<any[]> {
    // if (this.cryptoAssets.length > 0) {
    //   return of(this.cryptoAssets);
    // } else {
    let reqUrl = this.cryptoBaseUrl + 'v1/assets';
    return this.http.get<any[]>(reqUrl, httpOptions).pipe(
      tap((cryptoAssets) => {
        this.cryptoAssets = cryptoAssets;
      }),
      catchError(this.handleError('', []))
    );
    // }
  }

  getAssetsIcons(iconsSize: number): Observable<any[]> {
    if (this.assetsIcons.length > 0) {
      return of(this.assetsIcons);
    } else {
      let reqUrl = this.cryptoBaseUrl + 'v1/assets/icons/' + iconsSize;
      return this.http.get<any[]>(reqUrl, httpOptions).pipe(
        tap((assetsIcons) => {
          this.assetsIcons = assetsIcons;
        }),
        catchError(this.handleError('', []))
      );
    }
  }

  getSymbols(): Observable<any[]> {
    if (this.cryptoSymbols.length > 0) {
      return of(this.cryptoSymbols);
    } else {
      let reqUrl = this.cryptoBaseUrl + 'v1/symbols';
      return this.http.get<any[]>(reqUrl, httpOptions).pipe(
        tap((cryptoSymbols) => {
          this.cryptoSymbols = cryptoSymbols;
        }),
        catchError(this.handleError('', []))
      );
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
