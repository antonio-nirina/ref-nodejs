"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reglementMessage_service_1 = require("./reglementMessage.service");
var sdInstance = null;
function ReglementServiceFactory() {
    if (sdInstance == null) {
        sdInstance = new reglementMessage_service_1.ReglementMessageService();
    }
    return sdInstance;
}
exports.ReglementServiceFactory = ReglementServiceFactory;
//# sourceMappingURL=reglementServiceFactory.js.map