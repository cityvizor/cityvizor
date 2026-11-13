import { Injectable, signal } from "@angular/core";

/**
 * Service to manage warning toasts
 *
 * toast() - create new toast
 */
@Injectable({
  providedIn: "root",
})
export class ToastService {
  /**
   * array of toasts
   */
  private readonly entries = signal<Array<{ text: string; status: string }>>(
    [],
  );

  get toasts() {
    return this.entries();
  }

  /**
   * text:string - text of toast
   * status:string - status type of toast, translates possibly to class
   */
  toast(text: string, status: string): void {
    this.entries.update(entries => [
      ...entries,
      { text, status: status || "notice" },
    ]);
    setTimeout(() => this.entries.update(entries => entries.slice(1)), 2000);
  }
}
