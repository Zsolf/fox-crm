import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor( private afs: AngularFirestore) { }

    getByEmail(email: string): Observable<any>{
        return this.afs.collection("users",ref => ref.where("email", '==', email)).valueChanges()
      }
    
}