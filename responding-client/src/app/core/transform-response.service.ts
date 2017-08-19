import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

@Injectable()
export class TransformResponseService {

  constructor() { }

  transform(response: Response): any {
    let transformedResponse;
    try {
      transformedResponse = response.json();
    } catch (e) {
      transformedResponse = {};
    }
    transformedResponse._response = response;
    return transformedResponse;
  }
}
