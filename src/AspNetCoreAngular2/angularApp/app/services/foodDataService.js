var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CONFIGURATION } from '../shared/app.constants';
var DataService = (function () {
    function DataService(_http) {
        var _this = this;
        this._http = _http;
        this.GetAllFood = function () {
            return _this._http.get(_this.actionUrl)
                .map(function (response) { return response.json(); })
                .catch(_this.handleError);
        };
        this.GetSingleFood = function (id) {
            return _this._http.get(_this.actionUrl + id)
                .map(function (response) { return response.json(); })
                .catch(_this.handleError);
        };
        this.AddFood = function (foodName) {
            var toAdd = JSON.stringify({ ItemName: foodName });
            return _this._http.post(_this.actionUrl, toAdd, { headers: _this.headers })
                .map(function (response) { return response.json(); })
                .catch(_this.handleError);
        };
        this.Update = function (id, foodToUpdate) {
            return _this._http.put(_this.actionUrl + id, JSON.stringify(foodToUpdate), { headers: _this.headers })
                .map(function (response) { return response.json(); })
                .catch(_this.handleError);
        };
        this.DeleteFood = function (id) {
            return _this._http.delete(_this.actionUrl + id)
                .catch(_this.handleError);
        };
        this.actionUrl = CONFIGURATION.baseUrls.server +
            CONFIGURATION.baseUrls.apiUrl +
            'foodItems/';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    DataService.prototype.handleError = function (error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    };
    return DataService;
}());
DataService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof Http !== "undefined" && Http) === "function" && _a || Object])
], DataService);
export { DataService };
var _a;
//# sourceMappingURL=foodDataService.js.map