import ClientActionBase from "./clientActions/clientActionsBase";

export type ClientActionBaseReference = Pick<typeof ClientActionBase, keyof typeof ClientActionBase> & (new (data) => ClientActionBase);

/**
An interface representing a response from an event.
@property {string} ErrorCode - The error code of the event, if any.
@property {string} ErrorMessage - The error message of the event, if any.
@property {boolean} Success - A flag indicating whether the event was successful or not.
@property {ClientAction} Value - The value of the event, if any.
*/
export interface EventResponse {
    ErrorCode: string;
    ErrorMessage: string,
    Success: boolean,
    Value: ClientAction
}

/**
An interface representing an event callback.
@property {string} Callback - The callback UUID.
@property {string} Type - The type of the client action.
@property {Object} Data - (Optional) Additional data associated with the client action. This is an object where the key is a string and the value can be of any type.
*/
export interface ClientAction 
{
  Callback: string;
  Type: string;
  Data?: { [key: string]: any };
}

export interface Event {
    EventKey: string;
    EventData: { [key: string]: any };
}

/**
 * Dialog action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/dialog.html
 */
export interface DialogActionExecutionResult extends Event {
    EventData: {
        SelectedAction: string,
        [key: string]: any
    }
}

/**
 * GeoLocation action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/geo-location.html
 */
export interface GeoLocationActionExecutionResult extends Event {
    EventData: {
        Success: boolean,
        Longitude: number,
        Latitude: number,
        Accuracy: number,
        ErrorMessage?: '' | "UnknownLocation" | "AccessDenied" | "Error"
        [key: string]: any
    }
}

/**
 * HUD action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/hud.html
 */
export interface HUDActionExecutionResult extends Event {
    EventData: {
        Success: boolean,
        HUDKey?: string,
        [key: string]: any
    }
}

/**
* Navigation action execution result is defined here:
* https://pepperi-addons.github.io/client-actions-docs/actions/navigation.html
*/
export interface NavigationActionExecutionResult extends Event {
    EventData: {}
}

/**
* Scan barcode action execution result is defined here:
* https://pepperi-addons.github.io/client-actions-docs/actions/scan-barcode.html
*/
export interface ScanBarcodeActionExecutionResult extends Event {
    EventData: {
        Success: boolean,
        Barcode: number,
        ErrorMessage: "" | "UserCanceled" | "AccessDenied",
        [key: string]: any
    }
}

/**
 * Modal action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/modal.html
 */
 export interface ModalActionExecutionResult extends Event {
    EventData: {
        Result: any,
        Canceled: boolean
        [key: string]: any
    }
}

/**
 * File Picker action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/file-picker.html
 */
 export interface FilePickerActionExecutionResult extends Event {
    EventData: {
        Success: boolean,
        MimeType: string,
        /**
         * Either data URI or a URL link
         */
        URI: string
        [key: string]: any
    }
}
