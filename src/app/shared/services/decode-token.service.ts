import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {
  constructor() {}

  DecodeToken(token: string | undefined): any {
    if (!token) {
      return null;
    }

    try {
      const tokenParts = token.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
