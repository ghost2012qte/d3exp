import { Directive, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Directive()
export abstract class BaseComponent implements OnDestroy {

  get destroy$(): Observable<void> {
    return this._destroy$;
  }

  private readonly _destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}