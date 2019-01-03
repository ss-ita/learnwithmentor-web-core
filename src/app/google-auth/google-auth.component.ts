import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'google-auth',
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent {
  private url : string = `${environment.uiUrl}`;
  messageOk = { provider : '', status : true, accessToken : '' };
  messageError = { provider : '', status : true, errorDescription : '' };
  accessToken : string = '';

  constructor(){
    this.accessToken = this.getParameterByName("access_token");
    
    if(this.accessToken)
    {
      this.messageOk.provider = 'google';
      this.messageOk.status = true;
      this.messageOk.accessToken = this.accessToken;
      window.opener.postMessage(JSON.stringify(this.messageOk), this.url);
    }
    else
    {
      this.messageError.provider = 'google';
      this.messageError.status = false;
      this.messageError.errorDescription = this.getParameterByName("error_description");
      window.opener.postMessage(JSON.stringify(this.messageError), this.url);
    }
  }

  getParameterByName(name: string, url?: string) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
