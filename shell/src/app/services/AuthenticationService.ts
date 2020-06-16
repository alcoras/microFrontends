import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as Eth from 'ethjs';
import * as moment from 'moment';
import { EnvironmentService, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';
import { LoginSuccess } from '@uf-shared-events/';
import { uEventsIds } from '@uf-shared-models/event';

const WindowWeb3Context = window['web3'] as Web3;

/**
 * Message which will be sent to API gateway
 */
export class LoginRequest {
  /**
   * ISO time string
   */
  public Timestamp: string;

  /**
   * Signature starting with 0x
   */
  public Signature: string;

  public Error: string;

  public FullError: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  /**
   * Web3 interface which will be provided by metamask
   */
  private web3: Web3;

  /**
   * Ethereum interface for signing messages
   */
  private eth: Eth;

  public constructor(
    private environmentService: EnvironmentService,
    private eventProxyService: EventProxyLibService
  ) {}


  /**
   * Logouts
   */
  public Logout(): void {
    this.environmentService.AuthorizationToken = '';
    this.environmentService.TokenBeginDate = '';
    this.environmentService.TokenExpirationDate = '';
  }

  /**
   * Login through Metamask
   * @returns LoginRequest without errors if successful (later on can contain information about user)
   */
  public async LoginAsync(): Promise<LoginRequest> {
    const loginRequest = await this.createMessageAndSignature();

    if (loginRequest.Error)
      return Promise.reject(loginRequest);

    const ret = new Promise<LoginRequest>((resolve, reject) => {
      this.eventProxyService.LogIn(loginRequest.Timestamp, loginRequest.Signature).toPromise().then(
        (response: HttpResponse<LoginSuccess>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrieve data');
          }

          if (response.body.EventId === uEventsIds.LoginFailed) {
            loginRequest.Error = 'Failed to login';
            reject(loginRequest);
          } else if (response.body.EventId === uEventsIds.LoginSuccess) {
            const login = response.body as LoginSuccess;
            this.setSession(login);
            this.eventProxyService.ConfirmEvents("")
            resolve();
          }
          else {
            loginRequest.Error = `EventID ${response.body.EventId} was not recognized`;
            reject(loginRequest);
          }
        }
      );
    });

    return Promise.resolve(ret);
  }

  public GetToken(): string {
    return this.environmentService.AuthorizationToken;
  }

  /**
   * Checks if logged in
   * @returns true if still logged in
   */
  public IsLoggedIn(): boolean {
    return moment().isBefore(this.getExpirationTime());
  }

  /**
   * Creates a message to be sent to backend
   * @returns Promise with LoginRequest (empty fields if something went wrong)
   */
  private async createMessageAndSignature(): Promise<LoginRequest> {

    const logRequest = new LoginRequest();

    try {
      this.checkContextProviders();
    } catch (err) {
      logRequest.Error = 'Setup Metamask';
      logRequest.FullError = err;
      return Promise.reject(logRequest);
    }

    const fromAddress = this.web3.givenProvider.selectedAddress as string;

    if (!fromAddress) {
      logRequest.Error = 'Please try to login to Metamask to resolve.';
      return Promise.reject(logRequest);
    }

    if (fromAddress.length === 0) {
      logRequest.Error = 'Could not get sender address. Probably no wallets are connected.';
      return Promise.reject(logRequest);
    }

    const timeNow =  new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString();

    const ret = new Promise<LoginRequest>((resolve, reject) => {
      this.eth.personal_sign(timeNow, fromAddress).then(
        (signed: string) => {
          logRequest.Timestamp = timeNow;
          logRequest.Signature = signed;
          logRequest.Error = '';
          resolve(logRequest);
        },
        (error: string) => { reject(error); }
      )
    });

    return Promise.resolve(ret);
  }

  private getExpirationTime(): moment.Moment {
    return moment(this.environmentService.TokenExpirationDate);
  }

  /**
   * Sets session
   * @param login LoginSuccess data
   */
  private setSession(login: LoginSuccess): void {
    console.log(login);
    this.environmentService.TokenBeginDate = login.TokenBegins;
    this.environmentService.TokenExpirationDate = login.TokenExpires;
    this.environmentService.AuthorizationToken = login.Token;
  }

  /**
   * Checks if Metamask is setup
   * @returns true if it is setup, otherwise false
   */
  private checkContextProviders(): boolean {

    if (typeof WindowWeb3Context.currentProvider === 'undefined')
      return false;

    this.web3 = new Web3(WindowWeb3Context.currentProvider); // Web3 should be provided by metamask

    if (typeof this.web3 === 'undefined')
      return false;

    if (typeof this.web3.currentProvider === 'undefined')
      return false;

    this.eth = new Eth(this.web3.currentProvider);

    if (!this.eth)
      return false;

    return true;
  }
}
