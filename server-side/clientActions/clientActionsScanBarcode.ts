import { ScanBarcodeActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionBarcodeScanTest extends ClientActionBase 
{
	getBarcode(barcode: number, success = true, errorMessage: "" | "UserCanceled" | "AccessDenied" = ""): ScanBarcodeActionExecutionResult
	{
		const result: ScanBarcodeActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: success,
				Barcode: barcode,
				ErrorMessage: errorMessage
			}
		};

		return result;
	}
}
