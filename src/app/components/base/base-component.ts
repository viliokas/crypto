// base-component.ts
import { Component, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

/**
 * If there is a Child component that:
 * - extends this BaseComponent
 * - implement ngOnDestroy,
 *
 * then it should manually unsubscribe via `this.sub.unsubscribe()`
 */
@Component({
  template: '',
})
export class BaseComponent implements OnDestroy {
  private isAlive$ = new Subject<any>();

  /**
   * Auto-unsubscribe all subscriptions
   */
  public ngOnDestroy() {
    this.isAlive$.next();
    this.isAlive$.complete();
    console.log('destroyed');
  }

  protected unsubsribeOnDestroy = (
    source: Observable<any>
  ): Observable<any> => {
    return source.pipe(takeUntil(this.isAlive$));
  };
}
