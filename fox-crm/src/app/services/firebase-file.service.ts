import { Injectable, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UserService } from './firebase-user.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService{

    constructor(private fireStorage: AngularFireStorage){}

    fileUrl: any;

    usersAvatar: {id: string, avatar: string}[]

    currenUserAvatar: string;

    async upload(userId: string, data: any){
       await this.fireStorage.upload("/avatars/" + userId, data)
    }

    delete(userId: string){
        this.fireStorage.ref("/avatars/" + userId).delete()
    }

    getAvatarFileForCurrentsUser(userId: string): Observable<any>{
       this.fireStorage.ref("/avatars/"+userId).getDownloadURL().subscribe(res =>{
        this.fileUrl = res
       },
       error =>{
           this.fileUrl=undefined
       });
       return this.fireStorage.ref("/avatars/"+userId).getDownloadURL()
    }

    getAvatarsFile(userId: string): Observable<any>{
        return this.fireStorage.ref("/avatars/"+userId).getDownloadURL()
    }

    getSaleFile(companyId: string, saleId: string){
        return this.fireStorage.ref("/sales/"+companyId+"/"+saleId).getDownloadURL()
    }
    
    async uploadSaleFile(companyId: string, saleId: string, data: any){
        await this.fireStorage.upload("/sales/"+companyId+"/"+saleId, data)
     }

    getAvatarByPath(avatarPath: string){
           return this.fireStorage.ref(avatarPath).getDownloadURL()
    }

    getCurrentUserAvatarByPath(avatarPath: string){
        this.fireStorage.ref(avatarPath).getDownloadURL().subscribe(res =>{
            this.fileUrl = res
           },
           error =>{
               this.fileUrl=undefined
           });
           return this.fireStorage.ref(avatarPath).getDownloadURL()
    }
}