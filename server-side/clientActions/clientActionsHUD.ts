import { HUDActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";
//class for client actions hud class response - according to hud state:
//https://pepperi-addons.github.io/client-actions-docs/actions/hud.html

export default class ClientActionHUDTest extends ClientActionBase
{	
	negativeTest(): Promise<HUDActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}
	
	async executeAction(): Promise<HUDActionExecutionResult> 
	{
		const resObject: HUDActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.Success,
			}
		}

		if(this.data.value.Data.State === "Show")
		{
			const hudKey = (await global["HUDKey"].toUpperCase()) as string;
			resObject.EventData.HUDKey = hudKey;
		}

		return resObject;
	}
}
