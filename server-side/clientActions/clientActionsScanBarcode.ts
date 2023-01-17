import { ScanBarcodeActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";
//client actions barcode scan class for responses:
//https://pepperi-addons.github.io/client-actions-docs/actions/scan-barcode.html
export default class ClientActionBarcodeScanTest extends ClientActionBase 
{
	executeAction(): Promise<ScanBarcodeActionExecutionResult> 
	{
		const result: ScanBarcodeActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.Success,
				Barcode: 12345678,
				ErrorMessage: ""
			}
		};

		return Promise.resolve(result);
	}

	negativeTest(): Promise<ScanBarcodeActionExecutionResult> 
	{
		const result: ScanBarcodeActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: false,
				Barcode: 12345678,
				ErrorMessage: "UserCanceled"
			}
		};

		return Promise.resolve(result);
	}
}
