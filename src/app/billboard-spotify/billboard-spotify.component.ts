import { Component, OnInit, Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { VizrekaAPIService } from '../vizreka-api.service';

import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';

@Component({
  selector: 'app-billboard-spotify',
  templateUrl: './billboard-spotify.component.html',
  styleUrls: ['./billboard-spotify.component.css']
})
export class BillboardSpotifyComponent implements OnInit {

  user_id = 'titlerug';
  playlist_id = '4YhBBP9iOYDKxPWjo7rTlA';
  url = '';
  chart_date = null;
  is_getting_chart = false;
  error = '';

  constructor(private api: VizrekaAPIService,
    private sanitizer: DomSanitizer) { }

  // we do not want to refresh iframe constantly when url is not changing
  // special thanks to StackOverflow contributor for elegant solution
  // https://stackoverflow.com/questions/48306443/stop-angular-reloading-iframes-when-changing-components
  update_url() {
    this.url = `https://open.spotify.com/embed/user/${this.user_id}/playlist/${this.playlist_id}`;
  }

  ngOnInit() {
    this.api.spotify_profile();
  }

  authorize() {
    this.api.spotify_authorize();
  }

  profile() {
    this.api.spotify_profile();
  }

  get_chart() {
    if(this.chart_date) {
      this.billboard_spotify_playlist(_moment(this.chart_date).format('YYYY-MM-DD'));
    } else {
      this.error = 'Please select a valid date.';
    }
  }

  billboard_spotify_playlist(chart_date) {
    this.is_getting_chart = true;
    this.error = '';
    this.api.spotify_billboard_playlist(chart_date).subscribe(
      result => {
        if(result) {
          this.user_id = result.user_id;
          this.playlist_id = result.playlist_id;
          this.update_url();
        } else {
          this.error = 'Failed to get Spotify playlist. Please try again.';
        }
        this.is_getting_chart = false;
      }
    )
  }
}

@Directive({
  selector: 'iframe'
})
export class CachedSrcDirective {

    @Input() 
    public get cachedSrc(): string {
        return this.elRef.nativeElement.src;
    }
    public set cachedSrc(src: string) {
        if (this.elRef.nativeElement.src !== src) {
            this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
        }
    }

    constructor(
        private elRef: ElementRef,
        private renderer : Renderer2
        ) { }
}