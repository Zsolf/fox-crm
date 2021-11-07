import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

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

    update(collectionName: string, id: string, data: any){
      this.afs.collection(collectionName).doc(id).update(data);
    }

    delete(collectionName: string, id: string){
      return this.afs.collection(collectionName).doc(id).delete()
    }

    getIdFromLinkedDB(collectionName: string, givenId: string, givenIdName: string, searchedIdName: string): Observable<any[]>{
      let ids = []
      let result = this.afs.collection(collectionName, ref => {
        let query = ref.where(givenIdName, '==', givenId)
        
        query.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              ids.push(doc.get(searchedIdName))
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
        return query
      })
      return of(ids)
    }

    getFilteredByIdList(collectionName: string, givenId: string, givenIdName: string): Observable<any>{
      let coll = this.afs.collection(collectionName,ref => ref.where(givenIdName, '==', givenId))
      return coll.valueChanges()
    }

    getLimitedList(collectionName: string, givenId: string, givenIdName: string): Observable<any>{
      let coll = this.afs.collection(collectionName,ref => ref.where(givenIdName, '==', givenId).limit(20))
      return coll.valueChanges()
    }

    getAll(collectionName: string): Observable<any[]>{
      return this.afs.collection(collectionName).valueChanges();
    }

    getByTwoElements(collectionName: string, firstName: string, firstValue: string,  secondName: string, secondValue: string): Observable<any>{
      return this.afs.collection(collectionName, ref => ref.where(firstName, '==', firstValue).where(secondName, '==', secondValue)).valueChanges()
       
    }
  
}
