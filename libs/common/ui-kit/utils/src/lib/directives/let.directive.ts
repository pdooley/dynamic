import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LetViewContext<T = any> {
  $implicit: T | null;
  vsLet: T | null;
}

@Directive({ selector: '[vsLet]' })
export class LetDirective<T> implements OnDestroy {
  // tslint:disable-next-line: variable-name
  static ngTemplateGuard_vsLet: 'binding';

  private _viewRef?: EmbeddedViewRef<LetViewContext<T>>;
  private _templateRef: TemplateRef<LetViewContext<T>>;

  private readonly _context: LetViewContext<T> = {
    $implicit: null,
    vsLet: null,
  };

  public static ngTemplateContextGuard<T>(
    dir: LetDirective<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any
  ): ctx is LetViewContext<T> {
    return true;
  }

  @Input() set vsLet(value: T) {
    this._context.$implicit = this._context.vsLet = value;
    this._updateView();
  }

  constructor(private viewContainerRef: ViewContainerRef, templateRef: TemplateRef<LetViewContext<T>>) {
    this._templateRef = templateRef;
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();
  }

  private _updateView() {
    if (!this._viewRef) {
      this._viewRef = this.viewContainerRef.createEmbeddedView<LetViewContext<T>>(this._templateRef, this._context);
    }
  }
}
