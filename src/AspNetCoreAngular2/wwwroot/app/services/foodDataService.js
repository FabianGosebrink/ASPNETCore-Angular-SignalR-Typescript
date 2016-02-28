System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map', 'rxjs/Observable', '../app.constants'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1, app_constants_1;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (app_constants_1_1) {
                app_constants_1 = app_constants_1_1;
            }],
        execute: function() {
            DataService = (function () {
                function DataService(_http, _configuration) {
                    var _this = this;
                    this._http = _http;
                    this._configuration = _configuration;
                    this.GetAllFood = function () {
                        return _this._http.get(_this.actionUrl)
                            .map(function (response) { return response.json(); })
                            .do(function (data) { return console.log(data); })
                            .catch(_this.handleError);
                    };
                    this.GetSingleFood = function (id) {
                        return _this._http.get(_this.actionUrl + id)
                            .map(function (response) { return response.json(); })
                            .do(function (data) { return console.log(data); })
                            .catch(_this.handleError);
                    };
                    this.AddFood = function (foodName) {
                        var toAdd = JSON.stringify({ ItemName: foodName });
                        return _this._http.post(_this.actionUrl, toAdd, { headers: _this.headers })
                            .map(function (response) { return response.json(); })
                            .do(function (response) { return console.log(response); })
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
                        ;
                    };
                    this.actionUrl = _configuration.ServerWithApiUrl + 'foodItems/';
                    this.headers = new http_1.Headers();
                    this.headers.append('Content-Type', 'application/json');
                    this.headers.append('Accept', 'application/json');
                }
                DataService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                DataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration])
                ], DataService);
                return DataService;
            })();
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=foodDataService.js.map