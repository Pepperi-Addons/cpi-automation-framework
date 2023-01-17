import ClientActionBase, { ActionExecutionResult, IClientAction } from "./clientActionsBase";
import ClientActionGeoLocationTest from "./clientActionsGeoLocation";

export default class ClientActionGeoLocationWithTimeoutTest extends ClientActionGeoLocationTest
{

	async executeAction(): Promise<ActionExecutionResult> 
	{
		await setTimeout(function()
		{
			console.log("timeouting for GeoLocation Client"); 
		}, 10000);//wait 10 seconds

		return super.executeAction();
	}

	negativeTest(): Promise<ActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}
}
