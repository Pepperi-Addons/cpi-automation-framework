import { DialogActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionDialogTest extends ClientActionBase 
{
	executeAction(): Promise<DialogActionExecutionResult>
	{
		return Promise.resolve({
			EventKey: this.data.Value.Callback,
			EventData: {
				SelectedAction: this.data.Value.Data.Actions[0].Key
			}
		})
	}

	negativeTest(): Promise<DialogActionExecutionResult>
	{
		return Promise.resolve({
			EventKey: this.data.Value.Callback,
			EventData: {
				SelectedAction: "rand-negative-string-for-test"
			}
		})
	}
}
