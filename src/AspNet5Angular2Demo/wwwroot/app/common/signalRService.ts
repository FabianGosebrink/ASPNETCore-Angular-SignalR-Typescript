/// <reference path="../../../typings/signalr/signalr.d.ts" />

import { Injectable, EventEmitter, Output } from "angular2/core";

@Injectable()
export class SignalRService {

    private proxy: HubProxy;
    private connection: HubConnection;

    public foodchanged: EventEmitter<any>;

    constructor() {
        this.foodchanged = new EventEmitter();
        this.connection = jQuery.hubConnection("http://localhost:5000/signalr/");
        this.proxy = this.connection.createHubProxy("coolmessages");

        this.registerOnServerEvents();

        this.startConnection();
    }

    startConnection(): void {
        this.connection.start().done(function(data) {
            console.log("Now connected " + data.transport.name + ", connection ID= " + data.id);
        }).fail(function(error) {
            console.log("Could not connect " + error);
        });
    }

    registerOnServerEvents(): void {
        this.proxy.on("FoodAdded", (data) => {
            this.foodchanged.emit("this could be data");
        });

        this.proxy.on("FoodDeleted", (data) => {
            this.foodchanged.emit("this could be data");
        });
    }

    public FoodAdded() {
        this.proxy.invoke("FoodAdded");
    }

    public FoodDeleted() {
        this.proxy.invoke("FoodDeleted");
    }
}
