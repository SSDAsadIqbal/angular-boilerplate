import * as signalR from "@microsoft/signalr";
import { IHttpConnectionOptions } from "@microsoft/signalr"; 

export class SignalRHelperTest {

  private hubConnection?: signalR.HubConnection;
  private readonly options: IHttpConnectionOptions; 

  constructor(options?: IHttpConnectionOptions) {
    this.options = options || {
      transport: signalR.HttpTransportType.WebSockets,
    };
  }

  public setupConnection(hubUrl: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl + '/?token="' + sessionStorage.getItem('ACCESS_TOKEN')! + '"', this.options)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 20000;
    this.hubConnection.keepAliveIntervalInMilliseconds = 10000;
  } 

  public async startConnection(hubMethod: string, clientName: string, type:string): Promise<void> {
    try {
      if (this.hubConnection) {
        await this.hubConnection.start();
        await this.hubConnectionSend(hubMethod, clientName, type);
      } else {
        throw new Error("Hub connection is not initialized.");
      }
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  public async stopConnection(): Promise<void> {
    try {
      await this.hubConnection?.stop();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    this.hubConnection?.on(event, callback);
  }

  public async hubConnectionSend(method: string, ...args: any[]): Promise<void> {
    try {
      await this.hubConnection?.send(method, ...args);
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  public async invoke<TResult>(method: string, ...args: any[]): Promise<TResult> {
    try {
      return await this.hubConnection!.invoke<TResult>(method, ...args);
    } catch (error) {
      this.handleConnectionError(error);
      throw error;
    }
  }

  private handleConnectionError(error: any): void {
    console.error("SignalR connection error:", error);
  }
}
