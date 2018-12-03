import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';
import { MessageRoutingModule } from './message-routing.module';

@NgModule({
  declarations: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule
  ],
  exports: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  providers: [

  ]
})
export class MessageModule {}
