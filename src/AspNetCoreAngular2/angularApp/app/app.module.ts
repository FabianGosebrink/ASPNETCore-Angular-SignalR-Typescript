import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AboutModule } from './about/about.module';
import { AppComponent } from './app.component';
import { appRouting } from './app.routing';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        HomeModule,
        appRouting,
        FormsModule
    ],

    declarations: [
        AppComponent
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }
