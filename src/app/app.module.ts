import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {VizrekaMaterialModule} from './material-module';

import { AppComponent } from './app.component';
import { LineChartDemoComponent } from './line-chart-demo/line-chart-demo.component';
import { NytimesMostfrequentnamesComponent } from './nytimes-mostfrequentnames/nytimes-mostfrequentnames.component';
import { DialogContentExampleDialog } from './nytimes-mostfrequentnames/nytimes-mostfrequentnames.component';
import { NamecardComponent } from './nytimes-mostfrequentnames/namecard.component';
import { BillboardSpotifyComponent } from './billboard-spotify/billboard-spotify.component';
import { CallbackComponent } from './billboard-spotify/callback.component';
import { CachedSrcDirective } from './billboard-spotify/billboard-spotify.component';

import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
  { path: 'most-frequent-names', component: NytimesMostfrequentnamesComponent },
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  { path: 'projects',
  redirectTo: '/most-frequent-names',
  pathMatch: 'full'
  },
  { path: 'billboard-spotify', component: BillboardSpotifyComponent },
  { path: 'callback', component: CallbackComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LineChartDemoComponent,
    NytimesMostfrequentnamesComponent,
    NamecardComponent,
    DialogContentExampleDialog,
    BillboardSpotifyComponent,
    CallbackComponent,
    CachedSrcDirective
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    BrowserModule,
    ChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    VizrekaMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  entryComponents: [NytimesMostfrequentnamesComponent, DialogContentExampleDialog],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
