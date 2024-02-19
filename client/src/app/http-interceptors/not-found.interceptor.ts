import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpSentEvent,
  HttpUserEvent,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class NotFoundInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status == 404) {
          this.router.navigateByUrl("/not-found", { replaceUrl: true });
          return EMPTY;
        } else {
          return throwError(error);
        }
      })
    );
  }
}
