"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core"); // Uncomment for production
var app_module_1 = require("./app.module");
core_1.enableProdMode(); // uncomment in production
var platform = platform_browser_dynamic_1.platformBrowserDynamic();
platform.bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map