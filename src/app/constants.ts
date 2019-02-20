import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Constants {

  public static STATE_KEY = 'spotify_auth_state';
  public static ACCESS_TOKEN = 'spotify_access_token';
  public static CODE = 'spotify_access_code';

  constructor() { }
}
