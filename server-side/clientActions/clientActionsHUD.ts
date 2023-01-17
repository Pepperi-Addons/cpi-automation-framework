import ClientActionBase, { ActionExecutionResult, IClientAction } from "./clientActionsBase";
//class for client actions hud class response - according to hud state:
//https://pepperi-addons.github.io/client-actions-docs/actions/hud.html

export default class ClientActionHUDTest extends ClientActionBase
{	
	negativeTest(): Promise<ActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}
	
	async executeAction(): Promise<ActionExecutionResult> 
	{
		let returnObj = { success: this.data.Success, resObject: {} };

		switch (this.data.value.Data.State) 
		{
		case "Show":
			const HUDKey = (await global["HUDKey"].toUpperCase()) as string;
			returnObj = {
				success: this.data.Success,
				resObject: { Success: this.data.Success, HUDKey: HUDKey },
			};
			break;
		case "Poll":
		case "Hide":
			returnObj = {
				success: this.data.Success,
				resObject: { Success: this.data.Success },
			};
			break;
		default:
			break;
		}

		return returnObj;
	}
}
