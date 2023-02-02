import { HUDActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";
import { v4 as uuidCreator } from 'uuid';

export default class ClientActionHUDTest extends ClientActionBase
{	
	private static hudUuid = uuidCreator();
	
	executeAction(): HUDActionExecutionResult 
	{
		const resObject: HUDActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.Success,
			}
		}

		if(this.data.Value.Data?.State === "Show")
		{
			resObject.EventData.HUDKey = ClientActionHUDTest.hudUuid;
		}

		return resObject;
	}
}
