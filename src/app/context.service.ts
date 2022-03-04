import { jsDocComment } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { listenerCount } from 'process';
import { Evolvable, evolve, Evolve, Evolver } from 'ramda';
import {
  BehaviorSubject,
  concat,
  identity,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  distinctUntilChanged,
  exhaustMap,
  filter,
  finalize,
  ignoreElements,
  last,
  map,
  mergeMap,
  mergeScan,
  reduce,
  scan,
  shareReplay,
  skipLast,
  skipUntil,
  switchMap,
  takeLast,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Storage } from './context.types';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private storageInput$ = new BehaviorSubject<Observable<Evolver<Storage>>>(
    of({ select1: identity, select2: identity })
  );
  storage$: Observable<Storage> = this.storageInput$.asObservable().pipe(
    mergeMap(identity),
    scan((storage, input) => evolve(input, storage), {
      select1: 0,
      select2: 0,
      test: {
        test: ''
      }
    }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  constructor() {}

  storage(input$: Observable<Evolver<Storage>>) {
    return new Observable((subscriber) => {
      const destroy$ = new Subject();
      subscriber.next(
        this.storageInput$.next(input$.pipe(takeUntil(destroy$)))
      );
      return () => destroy$.next(true);
    }).pipe(switchMap(() => this.storage$));
  }
}