import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {
  combineLatest,
  defer,
  fromEvent,
  merge,
  Observable,
  timer,
} from 'rxjs';
import { finalize, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { ContextService } from '../context.service';
import { Storage } from '../context.types';
import { evolve, always, Evolver, Evolve } from 'ramda';

@Component({
  selector: 'app-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss'],
})
export class PageOneComponent implements OnInit, OnDestroy {
  model$!: Observable<Storage>;
  model!: Storage;

  @ViewChild('select1') select1!: MatSelect;
  @ViewChild('select2') select2!: MatSelect;

  constructor(private contextService: ContextService) {}

  ngOnInit() {
    this.model$ = merge(
      this.contextService.storage(
        timer().pipe(
          mergeMap(() =>
            this.select1.selectionChange.pipe(
              map((selectionChange) => ({
                select1: always(selectionChange.value as number),
                test: {
                  test: always('test'),
                },
              })),
              finalize(() => console.log('select1 finalize'))
            )
          )
        )
      ),

      this.contextService.storage(
        timer().pipe(
          mergeMap(() =>
            this.select2.selectionChange.pipe(
              map((selectionChange) => ({
                select2: always(selectionChange.value),
              })),
              finalize(() => console.log('select2 finalize'))
            )
          )
        )
      )
    ).pipe(startWith({ select1: 1, select2: 2, test: { test: '' } }));
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}
