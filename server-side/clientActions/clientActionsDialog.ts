import ClientActionBase, { ActionExecutionResult } from "./clientActionsBase";
//client actions class including responses for Dialog client actions
export default class ClientActionDialogTest extends ClientActionBase 
{
	executeAction(): Promise<ActionExecutionResult>
	{

		//response below is according to dialog responses:
		//https://pepperi-addons.github.io/client-actions-docs/actions/dialog.html
		return Promise.resolve({
			success: this.data.Success,
			resObject: {
				SelectedAction: this.data.Value.Data.Actions[0].Key, // need to test
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
