import { DialogActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionDialogTest extends ClientActionBase 
{
	selectActionK(k: number): DialogActionExecutionResult
	{
		const result: DialogActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				SelectedAction: this.data.Value.Data?.Actions[k].Key
			}
		};

		return result;
	}
}
