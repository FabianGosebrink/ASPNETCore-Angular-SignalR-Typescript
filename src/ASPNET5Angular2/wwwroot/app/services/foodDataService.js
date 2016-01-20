var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
require('rxjs/add/operator/map');
var DataService = (function () {
    function DataService(_http) {
        this._http = _http;
        this.actionUrl = 'http://localhost:5000/api/foodItems/';
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    DataService.prototype.GetAllFood = function () {
        return this._http.get(this.actionUrl).map(function (res) { return res.json(); });
    };
    DataService.prototype.GetSingleFood = function (id) {
        return this._http.get(this.actionUrl + id).map(function (res) { return res.json(); });
    };
    DataService.prototype.AddFood = function (foodName) {
        var toAdd = JSON.stringify({ ItemName: foodName });
        return this._http.post(this.actionUrl, toAdd, { headers: this.headers }).map(function (res) { return res.json(); });
    };
    DataService.prototype.Update = function (id, foodToUpdate) {
        return this._http.put(this.actionUrl + id, JSON.stringify(foodToUpdate), { headers: this.headers }).map(function (res) { return res.json(); });
    };
    DataService.prototype.DeleteFood = function (id) {
        return this._http.delete(this.actionUrl + id);
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DataService);
    return DataService;
})();
exports.DataService = DataService;
//# sourceMappingURL=foodDataService.js.map