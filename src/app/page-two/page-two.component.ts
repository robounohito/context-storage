import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { ContextService } from '../context.service';
import { Storage } from '../context.types';

@Component({
  selector: 'app-page-two',
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.scss'],
})
export class PageTwoComponent implements OnInit {
  model$!: Observable<Storage>;
  sub$ = new BehaviorSubject(1);

  constructor(private contextService: ContextService) {}

  ngOnInit() {
    this.model$ = combineLatest([
      this.sub$.pipe(finalize(() => console.log('sub$ finalize'))),

      this.contextService.storage$,
    ]).pipe(
      map(([_, storage]) => storage),
      startWith({} as Storage)
    );
  }
}
