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
       await this.fireStorage.upload("/files-" + userId, data)
    }

    delete(userId: string){
        this.fireStorage.ref("/files-" + userId).delete()
    }

    getFileForCurrentUser(userId: string): Observable<any>{
       this.fireStorage.ref("/files-"+userId).getDownloadURL().subscribe(res =>{
        this.fileUrl = res
       },
       error =>{
           this.fileUrl=undefined
       });
       return this.fireStorage.ref("/files-"+userId).getDownloadURL()
    }

    getFile(userId: string): Observable<any>{
        return this.fireStorage.ref("/files-"+userId).getDownloadURL()
    }
}