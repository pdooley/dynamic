## how to convert an observable to promise

In RxJs 7 toPromise has been deprecated and will be removed in RxJS 8

Instead of using toPromise on an observable, we can use firstValueFrom

example: await firstValueFrom(this.http.get<Tenant>(`/api/tenants/${id}`))
