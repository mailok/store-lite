import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isFunction, updateState } from './utils';

export class StoreLite<S> {
  private store$: BehaviorSubject<S>;
  public vm$: Observable<S>;

  constructor(initialState: Partial<S>) {
    this.store$ = new BehaviorSubject<Readonly<S>>({ ...initialState, loading: false, error: null } as S & {
      loading: boolean;
      error: any;
    });
    this.vm$ = this.store$.asObservable();
  }

  public update(newState: Partial<S> | updateState<S>): void {
    if (isFunction(newState)) {
      this.store$.next(newState(this.store$.getValue()) as S);
    } else {
      this.store$.next({ ...this.store$.getValue(), ...newState });
    }
  }

  public select<R>(project: (store: S) => R): Observable<R> {
    return this.vm$.pipe(
      map<S, R>(project),
      distinctUntilChanged<R>()
    );
  }

  public selectSnapshot<R>(project: (store: S) => R): R {
    return project(this.store$.getValue());
  }

  public selectLoading(): Observable<boolean> {
    return this.select<boolean>(state => (state as S & { loading: boolean }).loading);
  }

  public getLoading(): boolean {
    return (this.store$.getValue() as S & { loading: boolean }).loading;
  }

  public getError(): any {
    return (this.store$.getValue() as S & { error: any }).error;
  }

  public selectError(): Observable<any> {
    return this.select<any>(state => (state as S & { error: any }).error);
  }

  public updateLoading(loading: boolean): void {
    this.update({ loading } as S & { loading: boolean });
  }

  public updateError(error: any): void {
    this.update({ error } as S & { error: any });
  }
}
