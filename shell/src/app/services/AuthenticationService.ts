import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as Eth from 'ethjs';
import {
  CoreEvent,
  EnvironmentService,
  EventIds,
  EventProxyLibService,
  LoginSuccess,
  ResponseStatus } from 'event-proxy-lib-src';
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
        (responseStatus: ResponseStatus) => {
          if (responseStatus.HttpResult.status !== 200) {
            loginRequest.Error = "Failed to communicate with backend";
            loginRequest.FullError = "Failed to communicate with backend";
            return reject(loginRequest);
          }

          const response = responseStatus.HttpResult.body as LoginSuccess;

          if (response.EventId === EventIds.LoginFailed) {
            loginRequest.Error = 'Failed to login';
            loginRequest.FullError = 'Failed to login';
            return reject(loginRequest);
          } else if (response.EventId === EventIds.LoginSuccessWithTokenInformation) {
            this.setSession(response);
            resolve(loginRequest);
          } else {
            loginRequest.Error = `EventID ${response.EventId} was not recognized`;
            return reject(loginRequest);
          }
        },
        (responseStatusRejected: ResponseStatus) => {
          loginRequest.Error = responseStatusRejected.Error;
          return reject(loginRequest);
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
        (responseStatus: ResponseStatus) => {
          if (responseStatus.HttpResult.status !== 200) {
            reject("Failed to communicate with backend");
          }

          const response = responseStatus.HttpResult.body as CoreEvent;

          if (response.EventId === EventIds.LoginFailed) {
            reject('Failed to login');
          } else if (response.EventId === EventIds.TokenRenewSuccessWithTokenInformation) {
            const login = response as LoginSuccess;
            this.setUpcomingSession(login);
            resolve("");
          }
          else {
            reject(`EventID ${response.EventId} was not recognized`);
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

    this.web3 = new Web3(WindowWeb3Context.currentProvider); // Web3 should be provided by metamask or maybe no logner
    // https://medium.com/metamask/no-longer-injecting-web3-js-4a899ad6e59e

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
