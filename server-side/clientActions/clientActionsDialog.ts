import { DialogActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionDialogTest extends ClientActionBase 
{
	executeAction(): Promise<DialogActionExecutionResult>
	{
		const result: DialogActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				SelectedAction: this.data.Value.Data?.Actions[0].Key
			}
		};

		return Promise.resolve(result);
	}
}
