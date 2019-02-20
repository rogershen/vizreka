import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap, debounceTime } from 'rxjs/operators';
import { Constants } from './constants';

import { MessageService } from './message.service';
import { WindowService } from './window.service';
import { CookieService } from 'ngx-cookie-service';

import { stringify } from 'querystring';
import { environment } from '../environments/environment';
import { FormControl } from '@angular/forms';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class VizrekaAPIService {
    private apiUrl = environment.apiUrl;  // URL to web api

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private windowService: WindowService,
        private cookieService: CookieService) { }

    generateRandomString(length: number): string {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    spotify_authorize() {
        let state = this.generateRandomString(16);
        this.cookieService.set(Constants.STATE_KEY, state);

        let window = this.windowService.getNativeWindow();
        window.open(`${this.apiUrl}/authorize?state=${state}`, '_blank');
    }
    
    spotify_profile() {
        let access_token = this.cookieService.get(Constants.ACCESS_TOKEN);
        this.http.get(`${this.apiUrl}/spotify/me?access_token=${access_token}`, httpOptions)
        .pipe(catchError(this.handleError(`spotify_profile()`)))
        .subscribe(result => console.log(result));
    }

    delay(milliseconds: number, count: number): Promise<number> {
        return new Promise<number>(resolve => {
                setTimeout(() => {
                    resolve(count);
                }, milliseconds);
            });
    }
    
    spotify_billboard_playlist(chart_date):Observable<any> {
        let access_token = this.cookieService.get(Constants.ACCESS_TOKEN);

        return this.http.get(`${this.apiUrl}/spotify/playlist/billboard/hot100/${chart_date}?access_token=${access_token}`)
        .pipe(
            tap(result => this.messageService.add(`Result is ${result})`)),
            catchError(this.handleError(`spotify_billboard_playlist(${chart_date})`))
        )
    }

    spotify_search(search_term) {
        // https://www.concretepage.com/angular/angular-debouncetime
    }

    search(terms: FormControl) {
        return terms.valueChanges.pipe(
            debounceTime(400),
            tap(term => `Search term: ${term}`),
            switchMap(term => this.searchEntries(term))
            );
    }

    searchEntries(term) {
        return this.http
            .get(this.apiUrl + '/search/?q=' + term);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            if(error.status == 401) {
                this.spotify_authorize();
            }

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`VizrekaService: ${message}`);
    }
}