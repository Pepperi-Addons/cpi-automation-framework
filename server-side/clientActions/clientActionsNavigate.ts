import { NavigationActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionDialogTest extends ClientActionBase 
{
	
	executeAction(): Promise<NavigationActionExecutionResult> 
	{
		const result: NavigationActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {}
		}

		return Promise.resolve(result);
	}
}
