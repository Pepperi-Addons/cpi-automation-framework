import { NavigationActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";
//response class for navigate client action:
//https://pepperi-addons.github.io/client-actions-docs/actions/navigation.html
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