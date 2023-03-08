import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { MenuComponent } from './components/layout-area/menu/menu.component';
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './components/home-area/home/home.component';
import { ListComponent } from './components/data-area/list/list.component';
import { AddComponent } from './components/data-area/add/add.component';
import { PageNotFoundComponent } from './components/layout-area/page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        LayoutComponent,
        MenuComponent,
        HomeComponent,
        ListComponent,
        AddComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [LayoutComponent]
})
export class AppModule { }
