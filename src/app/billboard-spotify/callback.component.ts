import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WindowService } from '../window.service';
import { MessageService } from '../message.service';
import { Constants } from '../constants';
import { VizrekaAPIService } from '../vizreka-api.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  message = ''

  constructor(private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private windowService: WindowService,
    private messageService: MessageService,
    private vizrekaAPIService: VizrekaAPIService) { }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let access_token = params['access_token'] || null;
      let state = params['state'] || null;
      let storedState = this.cookieService.get(Constants.STATE_KEY);
      state = storedState = 'state';
      if(state != storedState) {
        this.messageService.add(`Received state and stored state do not match. Possible CRSF attack?`);
        this.message = 'Failed Spotify authentication';
      } else {
        this.messageService.add(`Received code: ${access_token}`);

        this.cookieService.set(Constants.ACCESS_TOKEN, access_token);
        let window = this.windowService.getNativeWindow();
        window.close();
      }
    });
  }
}
