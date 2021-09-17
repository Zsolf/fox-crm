import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseBaseService {

  constructor( private afs: AngularFirestore) { }

    async add(collectionName: string, data: any, id?: string): Promise<string>{
      const uid = id ? id : this.afs.createId();
      data.id = uid;
      await this.afs.collection(collectionName).doc(uid).set(data);
      return uid;
    }

    getById(collectionName: string, id: string): Observable<any>{
      return this.afs.collection(collectionName).doc(id).valueChanges();
    }

  
}
