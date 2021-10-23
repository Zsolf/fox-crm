import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private fireStorage: AngularFireStorage){}

    fileUrl: any;

    async upload(userId: string, data: any){
       await this.fireStorage.upload("/avatars/" + userId, data)
    }

    delete(userId: string){
        this.fireStorage.ref("/avatars/" + userId).delete()
    }

    getFileForCurrentUser(userId: string): Observable<any>{
       this.fireStorage.ref("/avatars/"+userId).getDownloadURL().subscribe(res =>{
        this.fileUrl = res
       },
       error =>{
           this.fileUrl=undefined
       });
       return this.fireStorage.ref("/avatars/"+userId).getDownloadURL()
    }

    getFile(userId: string): Observable<any>{
        return this.fireStorage.ref("/avatars/"+userId).getDownloadURL()
    }
}