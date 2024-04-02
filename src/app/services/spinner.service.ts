import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading$ = new Subject<boolean>();
  isLoadingText$ = new Subject<string>();
  show(text: string): void {
    this.isLoading$.next(true);
    this.isLoadingText$.next(text);
  }
  hide(): void {
    this.isLoading$.next(false);
    this.isLoadingText$.next("");
  }
  constructor() { }
}
