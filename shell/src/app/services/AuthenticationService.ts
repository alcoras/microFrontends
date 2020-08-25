import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as Eth from 'ethjs';
import { EnvironmentService, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';
import { LoginSuccess } from '@uf-shared-events/';
import { uEventsIds } from '@uf-shared-models/event';
import { LoginRequest } from '../models/LoginRequest';

const WindowWeb3Context = window['web3'] as Web3;
const MetamaskEthereumHandle = window['ethereum'];

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

  private upcomingToken: LoginSuccess;

  public constructor(
    private environmentService: EnvironmentService,
    private eventProxyService: EventProxyLibService
  ) {}


  /**
   * Passive Logout
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
          } else if (response.body.EventId === uEventsIds.LoginSuccessWithTokenInformation) {
            const login = response.body as LoginSuccess;
            this.setSession(login);
            resolve();
          }
          else {
            loginRequest.Error = `EventID ${response.body.EventId} was not recognized`;
            reject(loginRequest);
          }
        },
        (reject) => {
          return new Error(reject);
        }
      );
    });

    return Promise.resolve(ret);
  }

  public GetToken(): string {
    return this.environmentService.AuthorizationToken;
  }

  /**
   * Sends RenewToken to backend
   * @returns LoginRequest without errors if successful (later on can contain information about user)
   */
  private async renewTokenAsync(): Promise<string> {

    const ret = new Promise<string>((resolve, reject) => {
      this.eventProxyService.RenewToken().toPromise().then(
        (response: HttpResponse<LoginSuccess>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrieve data');
          }

          if (response.body.EventId === uEventsIds.LoginFailed) {
            reject('Failed to login');
          } else if (response.body.EventId === uEventsIds.TokenRenewSuccessWithTokenInformation) {
            const login = response.body as LoginSuccess;
            this.setUpcomingSession(login);
            resolve();
          }
          else {
            reject(`EventID ${response.body.EventId} was not recognized`);
          }
        },
        (reject) => {
          return new Error(reject);
        }
      );
    });

    return Promise.resolve(ret);
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

    // https://docs.metamask.io/guide/getting-started.html#basic-considerations
    await MetamaskEthereumHandle.request({ method: 'eth_requestAccounts' });
    const account = MetamaskEthereumHandle.selectedAddress;

    if (!account) {
      logRequest.Error = 'Please try to login to Metamask to resolve.';
      return Promise.reject(logRequest);
    }

    if (account.length === 0) {
      logRequest.Error = 'Could not get sender address. Probably no wallets are connected.';
      return Promise.reject(logRequest);
    }

    const timeNow =  new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString();

    const ret = new Promise<LoginRequest>((resolve, reject) => {
      this.eth.personal_sign(timeNow, account).then(
        (signed: string) => {
          logRequest.Timestamp = timeNow;
          logRequest.Signature = signed;
          logRequest.Error = '';
          resolve(logRequest);
        },
        (error: string) => {
          logRequest.Error = 'Failed to login. Try again by refreshing website.';
          logRequest.FullError = error;
          reject(logRequest);
        }
      )
    });

    return Promise.resolve(ret);
  }

  /**
   * Sets session
   * @param login LoginSuccess data
   */
  private setSession(login: LoginSuccess): void {
    this.updateToken(login);

    const expires = new Date(login.TokenExpires);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);

    setTimeout(() => {
      this.renewTokenAsync();
    }, timeout);
  }

  private updateToken(login: LoginSuccess): void {
    this.environmentService.TokenBeginDate = login.TokenBegins;
    this.environmentService.TokenExpirationDate = login.TokenExpires;
    this.environmentService.AuthorizationToken = login.Token;
  }

  /**
   * Prepares for next session
   * @param login LoginSuccess data
   */
  private setUpcomingSession(login: LoginSuccess): void {
    this.upcomingToken = login;

    const tokenBeginDate = new Date(this.upcomingToken.TokenBegins);
    const timeNowInMiliSeconds = Date.now();
    const timeout = tokenBeginDate.getTime() - timeNowInMiliSeconds;

    setTimeout(() => {
      this.setSession(this.upcomingToken);
    }, timeout);
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

    if (typeof window['ethereum'] === 'undefined') {
        return false;
    }

    return true;
  }
}
