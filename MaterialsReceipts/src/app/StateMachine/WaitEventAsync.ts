import { Subject } from "rxjs";

/**
 * Wrapper to wait for a specific event on observable
 * @param eventId unique event id
 * @param eventBus reference to event bus we gonna look eventId in
 */
export function WaitEventAsync(eventId: number, eventBus: Subject<number>): Promise<number> {
    return new Promise<number>((resolve) => {
        var sub = eventBus.subscribe((data: number) => {
            if (data == eventId) {
                sub.unsubscribe();
                resolve(eventId);
            }
        })
    });
}