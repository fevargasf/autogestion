import { Injector } from "@angular/core";
import { NotifierService } from "angular-notifier";

export type NotificationType = 'info' | 'success' | 'warning' | 'danger' | "error";

export class Notifier{
    public static injector: Injector;

    /**
     * Show a notification in the lower left.
     * @param text Text containing the notification
     * @param type Type of notification to be displayed. They can be successes, alerts or errors.
     */
     public static showNotification(text, type: NotificationType = "success") {
        const notifier = this.injector.get<NotifierService>(NotifierService);
        notifier.notify(type, text);
    }
}