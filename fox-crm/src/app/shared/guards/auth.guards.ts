import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { map, take, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.currentUserObserable().pipe(
            take(1),
            map(user => !!user),
            tap(loggedIn => {
                if(!loggedIn){
                    this.router.navigateByUrl('/login')
                }
            })
        )
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route,state)
    }
}
