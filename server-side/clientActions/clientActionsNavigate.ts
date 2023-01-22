import { NavigationActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionDialogTest extends ClientActionBase 
{
	
	executeAction(): Promise<NavigationActionExecutionResult> 
	{
		return Promise.resolve({
			EventKey: this.data.Value.Callback,
			EventData: {}
		});
	}

	negativeTest(): Promise<NavigationActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}

}