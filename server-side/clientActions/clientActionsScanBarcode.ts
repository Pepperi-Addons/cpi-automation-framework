import ClientActionBase, { ActionExecutionResult } from "./clientActionsBase";
//client actions barcode scan class for responses:
//https://pepperi-addons.github.io/client-actions-docs/actions/scan-barcode.html
export default class ClientActionBarcodeScanTest extends ClientActionBase 
{
	executeAction(): Promise<ActionExecutionResult> 
	{
		return Promise.resolve({
			success: this.data.Success,
			resObject: {
				Success: this.data.Success,
				Barcode: 12345678,
				ErrorMessage: "",
			},
		});
	}

	negativeTest(): Promise<ActionExecutionResult> 
	{
		return Promise.resolve({
			success: false,
			resObject: {
				Success: false,
				Barcode: 910111213,
				ErrorMessage: "Failure for automation test",
			},
		});
	}
}
