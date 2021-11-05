import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor( private afs: AngularFirestore) { }

    user: any;

    companyPageStart: string;

    getByEmail(email: string): Observable<any>{
        this.afs.collection("users",ref => ref.where("email", '==', email)).valueChanges().subscribe(result =>{
            this.user = result[0]
        })
        return this.afs.collection("users",ref => ref.where("email", '==', email)).valueChanges()
    }
    
    update(id: string, data: any){
        this.afs.collection("users").doc(id).update(data);
    }

    getById(userId: string): Observable<any>{
        return this.afs.collection("users",ref => ref.where("id", '==', userId)).valueChanges()
    }

    getAll(): Observable<any>{
        return this.afs.collection("users").valueChanges();
    }
}