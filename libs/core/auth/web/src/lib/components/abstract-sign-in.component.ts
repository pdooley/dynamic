import { Component } from '@angular/core';

/**The abstract type of sign in component. Authorization strategies extend this with their own sign in components */
@Component({ selector: 'vsolv-abstract-sign-in', template: '' })
export abstract class SignInComponent {}
