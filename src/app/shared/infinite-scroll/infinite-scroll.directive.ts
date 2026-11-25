import { DestroyRef, Directive, ElementRef, afterNextRender, effect, inject, input, output } from '@angular/core';

@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective {
  readonly scrollDisabled = input(false);
  readonly scrollMargin = input(300);
  readonly scrollKey = input<unknown>();
  readonly scrolled = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        entries => {
          if (!this.scrollDisabled() && entries.some(e => e.isIntersecting)) this.scrolled.emit();
        },
        { rootMargin: `0px 0px ${this.scrollMargin()}px 0px` },
      );
      this.observer.observe(this.host.nativeElement);
    });

    effect(() => {
      this.scrollKey();
      const disabled = this.scrollDisabled();
      if (!disabled && this.observer) {
        this.observer.unobserve(this.host.nativeElement);
        this.observer.observe(this.host.nativeElement);
      }
    });

    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }
}
