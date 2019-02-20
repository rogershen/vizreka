import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
    add(message:string) {
        console.log(message);
    }
}