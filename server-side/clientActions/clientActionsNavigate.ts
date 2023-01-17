import ClientActionBase, { ActionExecutionResult } from "./clientActionsBase";
//response class for navigate client action:
//https://pepperi-addons.github.io/client-actions-docs/actions/navigation.html
export default class ClientActionDialogTest extends ClientActionBase 
{
	executeAction(): Promise<ActionExecutionResult> 
	{
		return Promise.resolve({
			success: this.data.Success,
			resObject: {
			},
		});
	}

	negativeTest(): Promise<ActionExecutionResult>
	{
		return Promise.resolve({
			success: false,
			resObject: {
				SelectedAction: "rand-negative-string-for-test",
			},
		});
	}
}