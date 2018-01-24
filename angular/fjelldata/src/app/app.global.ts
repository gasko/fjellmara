import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
    public static get DEPLOY_PATH(): string { return ""; };
    public static get PHP_PATH(): string { return "http://localhost/fjellmara/"; };
    //public static get DEPLOY_PATH(): string { return "sample/url/"; };
}
