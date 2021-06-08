import { ReglementMessageService } from './reglementMessage.service';

var sdInstance = null;

export function ReglementServiceFactory() {
    if (sdInstance == null) {
        sdInstance = new ReglementMessageService();
    }

    return sdInstance;
}