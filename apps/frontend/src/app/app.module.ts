import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { TableModule } from '@vsolv/ui-kit/table'
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { TablePageComponent } from './table-page/table-page.component';

const config = {
  apiKey: "AIzaSyBDki01XPbo8OvLGzYqm9C4iJ1dRBplq3g",
  authDomain: "kwdemo-8f69c.firebaseapp.com",
  projectId: "kwdemo-8f69c",
  storageBucket: "kwdemo-8f69c.appspot.com",
  messagingSenderId: "870054033678",
  appId: "1:870054033678:web:55e09549bcb78a5e33bf5f"
};
@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    TablePageComponent,
    ],
  imports: [
    BrowserModule,
    TableModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
