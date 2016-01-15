System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            DataService = (function () {
                function DataService(_http) {
                    this._http = _http;
                    this.actionUrl = 'http://localhost:3848/api/foodItems/';
                }
                DataService.prototype.GetAllFood = function () {
                    return this._http.get(this.actionUrl).map(function (res) { return res.json(); });
                };
                DataService.prototype.GetSingleFood = function (id) {
                    return this._http.get(this.actionUrl + id).map(function (res) { return res.json(); });
                };
                DataService.prototype.AddFood = function (FoodToAdd) {
                    return this._http.post(this.actionUrl, FoodToAdd).map(function (res) { return res.json(); });
                };
                DataService.prototype.Update = function (id, foodToUpdate) {
                    return this._http.post(this.actionUrl + id, foodToUpdate).map(function (res) { return res.json(); });
                };
                DataService.prototype.DeleteFood = function (id) {
                    return this._http.delete(this.actionUrl + id);
                };
                DataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], DataService);
                return DataService;
                var _a;
            })();
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=PersonDataService.js.map