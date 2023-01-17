import { IClientAction } from "../clientActions/clientActionsBase";
import FetchService from "./fetch.service";
import ClientActionFactory from "./clientActionFactory";
import jwtDecode from "jwt-decode";
import { Client } from "@pepperi-addons/debug-server/dist";
import { PapiClient } from "@pepperi-addons/papi-sdk";

//https://pepperi-addons.github.io/client-actions-docs/

export interface ClientAction 
{
  Callback: string; //callback UUID
  Type: string; //action Type
  Data?: any; //Not mandatory due to barcode not having this
}

export class EventsService 
{
	protected fetchService: FetchService;
	protected papiClient: PapiClient;

	private readonly WEB_API_ADDON_UUID = "00000000-0000-0000-0000-0000003eba91";

	constructor(protected client: Client)
	{
		this.fetchService = new FetchService();

		this.papiClient =  new PapiClient({
			baseURL: client.BaseURL,
			token: client.OAuthAccessToken,
			addonUUID: client.AddonUUID,
			actionUUID: client.ActionUUID,
			addonSecretKey: client.AddonSecretKey,
		});
	}

	async getAccessToken(webAPIBaseURL: string): Promise<string> 
	{
		const url = webAPIBaseURL + "/Service1.svc/v1/CreateSession";
		const body = { "accessToken": this.client.OAuthAccessToken, "culture": "en-US" };

		let accessToken = undefined;

		while(!accessToken)
		{
			const res = await this.fetchService.post(url, body)
      accessToken = res["AccessToken"];
		}

		return accessToken;
	}

  async getWebAPIBaseURL(): Promise<string>
	{
		let environment = jwtDecode(this.client.OAuthAccessToken)["pepperi.datacenter"];

		const webappAddon = await this.papiClient.addons.installedAddons.addonUUID(this.WEB_API_ADDON_UUID).get();
		environment = environment == "sandbox" ? "sandbox." : "";

		const baseURL = `https://webapi.${environment}pepperi.com/${webappAddon.Version}/webapi`;

		return baseURL;
	}

	//basic emitEvent endpoint - emits an event on cpi-level
	async emitEvent(webAPIBaseURL: string, accessToken: string, body: any) 
	{
		const url = `${webAPIBaseURL}/Service1.svc/v1/EmitEvent`;
		const headers = { PepperiSessionToken: accessToken };

		const emitEvent = await this.fetchService.postEvent(url, body, headers);

		return emitEvent;
	}

	//client actions event loops for positive tests -> recursive function that call the interceptors for client actions related tests
	async runEventLoop( webAPIBaseURL: string, accessToken: string, initialEventBody: any ): Promise<void> 
	{
		const eventResponse = await this.emitEvent(webAPIBaseURL, accessToken, initialEventBody);

		const clientActionRequest = eventResponse.Value;
		console.log(eventResponse);
		//stop condition -- if actions returns empty recursion returns to the previous iteration
		if (Object.entries(clientActionRequest).length === 0) 
		{
			return;
		} // note that the callback EmitEvent does not return any values;

		const action: IClientAction = ClientActionFactory.getClientActionInstance(eventResponse);
		const resTest = await action.executeAction();

		const testedOptions = {
			EventKey: clientActionRequest.Callback,
			EventData: resTest.resObject,
		};
		if (Object.entries(resTest.resObject).length === 0) 
		{
			return;
		}

		await this.runEventLoop(webAPIBaseURL, accessToken, testedOptions);
	}


	//function for emitting client event with somewhat of a timeout
	// async EmitClientEventWithTimeout( webAPIBaseURL: string, accessToken: string, options): Promise<void> 
	// {
	// 	const map = global["map"] as Map<string, any>;
	// 	const res = await this.EmitEvent(webAPIBaseURL, accessToken, options);
	// 	const parsedActions = JSON.parse(res.Value);
	// 	console.log(parsedActions);
	// 	const Type = parsedActions.Type;
	// 	//stop condition -- if actions returns empty recursion returns to the previous iteration
	// 	if (Object.entries(parsedActions).length === 0) 
	// 	{
	// 		return;
	// 	} // note that the callback EmitEvent does not return any values;
	// 	const action = (await this.generateClientActionWithTimeout(
	// 		res
	// 	)) as ClientActionBase;
	// 	const parsedData = await this.parseActionDataForTest(action.data);
	// 	switch (Type) 
	// 	{
	// 	case "GeoLocation":
	// 		map.set(parsedActions.Callback, action.data);
	// 		break;
	// 	default:
	// 		break;
	// 	}
	// 	const resTest = await action.executeAction(action.data);
	// 	const result = resTest.resObject;
	// 	const testedOPtions = {
	// 		EventKey: parsedActions.Callback,
	// 		EventData: JSON.stringify(result),
	// 	};
	// 	global["map"] = map;
	// 	if (Object.entries(result).length === 0) 
	// 	{
	// 		return;
	// 	}
	// 	await this.EmitClientEvent(webAPIBaseURL, accessToken, testedOPtions);
	// }


	// //generates client action class with timeout
	// async generateClientActionWithTimeout(data: any): Promise<ClientActionBase> 
	// {
	// 	const Data = data;
	// 	const value = JSON.parse(Data.Value);
	// 	const actionType = value.Type;
	// 	let action;
	// 	switch (actionType) 
	// 	{
	// 	case "GeoLocation":
	// 		action = new ClientActionGeoLocationWithTimeoutTest(Data, actionType);
	// 		break;
	// 	default:
	// 		break;
	// 	}
	// 	return action;
	// }

	//parsing data for test
	// async parseActionDataForTest(data: string)
	// {
	// 	const parsedData = JSON.parse(data);
	// 	const parsedValue = JSON.parse(parsedData.Value);
	// 	return parsedValue;
	// }
}
