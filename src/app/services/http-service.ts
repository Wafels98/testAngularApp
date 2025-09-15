import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/**
	* Einfacher, wiederverwendbarer HttpService (Singleton via providedIn: 'root').
	* Enthält get/post/put/delete mit generischen Typen, Basis-URL-Unterstützung,
	* automatische Param-/Header-Erstellung und grundlegendes Error-Handling.
	*/
@Injectable({
	providedIn: 'root'
})
export class HttpService {
	// Optional: Basis-URL zentral definieren (z. B. aus environment importieren)
	public baseUrl: string = 'https://dummyjson.com/';

	constructor(private http: HttpClient) {}

	/**
		* GET request
		* @param endpoint Pfad oder vollständige URL
		* @param params optionales Objekt mit Query-Parametern
		* @param headers optionale HttpHeaders
		*/
	public get<T>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
		const url = this.buildUrl(endpoint);
		const options = {
			params: this.buildHttpParams(params),
			headers: headers
		};
		return this.http.get<T>(url, options).pipe(
			retry(1),
			catchError(this.handleError)
		);
	}

	/**
		* POST request
		*/
	public post<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
		const url = this.buildUrl(endpoint);
		const options = {
			params: this.buildHttpParams(params),
			headers: headers
		};
		return this.http.post<T>(url, body, options).pipe(
			retry(1),
			catchError(this.handleError)
		);
	}

	/**
		* PUT request
		*/
	public put<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
		const url = this.buildUrl(endpoint);
		const options = {
			params: this.buildHttpParams(params),
			headers: headers
		};
		return this.http.put<T>(url, body, options).pipe(
			retry(1),
			catchError(this.handleError)
		);
	}

	/**
		* DELETE request
		*/
	public delete<T>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: HttpHeaders): Observable<T> {
		const url = this.buildUrl(endpoint);
		const options = {
			params: this.buildHttpParams(params),
			headers: headers
		};
		return this.http.delete<T>(url, options).pipe(
			retry(1),
			catchError(this.handleError)
		);
	}

	/** Helpers */
	private buildUrl(endpoint: string): string {
		if (!endpoint) return this.baseUrl;
		// If endpoint looks like absolute URL, return as-is
		if (/^https?:\/\//i.test(endpoint)) return endpoint;
		// Join baseUrl and endpoint cleanly
		const trimmedBase = this.baseUrl.replace(/\/+$/g, '');
		const trimmedEndpoint = endpoint.replace(/^\/+/, '');
		return trimmedBase ? `${trimmedBase}/${trimmedEndpoint}` : trimmedEndpoint;
	}

	private buildHttpParams(params?: Record<string, string | number | boolean>): HttpParams | undefined {
		if (!params) return undefined;
		let httpParams = new HttpParams();
		Object.keys(params).forEach(key => {
			const value = params[key];
			if (value === null || value === undefined) return;
			httpParams = httpParams.append(key, String(value));
		});
		return httpParams;
	}

	private handleError(error: HttpErrorResponse) {
		let message = '';
		if (error.error instanceof ErrorEvent) {
			// Client-side / network error
			message = `Network error: ${error.error.message}`;
		} else {
			// Backend returned an unsuccessful response code
			message = `Server returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
		}
		// Hier könnte man z. B. ein globales Error-Logging anstoßen
		return throwError(() => new Error(message));
	}
}
