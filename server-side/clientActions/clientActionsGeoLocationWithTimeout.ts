import { GeoLocationActionExecutionResult } from "../constants";
import ClientActionGeoLocationTest from "./clientActionsGeoLocation";

export default class ClientActionGeoLocationWithTimeoutTest extends ClientActionGeoLocationTest
{
	async returnRandomLocationAsync(): Promise<GeoLocationActionExecutionResult> 
	{
		await setTimeout(function()
		{
			console.log("timeouting for GeoLocation Client"); 
		}, 10000);//wait 10 seconds

		return super.returnRandomLocation();
	}
}
