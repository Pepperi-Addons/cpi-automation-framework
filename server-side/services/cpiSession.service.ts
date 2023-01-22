import FetchService from "./fetch.service";
import jwtDecode from "jwt-decode";
import { Client } from "@pepperi-addons/debug-server/dist";
import { PapiClient } from "@pepperi-addons/papi-sdk";

export default class CpiSessionService
{
	private  papiClient: PapiClient;

	private _accessToken = '';
	private _webApiBaseUrl = '';

	private readonly WEB_API_ADDON_UUID = "00000000-0000-0000-0000-0000003eba91";

	constructor(private client: Client, private fetchService: FetchService)
	{
		this.papiClient =  new PapiClient({
			baseURL: client.BaseURL,
			token: client.OAuthAccessToken,
			addonUUID: client.AddonUUID,
			actionUUID: client.ActionUUID,
			addonSecretKey: client.AddonSecretKey,
		});
	}

	protected async getAccessToken(webAPIBaseURL: string): Promise<string> 
	{
		const url = webAPIBaseURL + "/Service1.svc/v1/CreateSession";
		const body = { "accessToken": this.client.OAuthAccessToken, "culture": "en-US" };

		let accessToken = undefined;
		let counter = 0;
		const maxNumberOfAttempts = 10;

		// Use maxNumberOfAttempts to stop after too long an attempt to create a session.
		while(!accessToken && counter < maxNumberOfAttempts)
		{
			const res = await this.fetchService.post(url, body)
			accessToken = res["AccessToken"];

			// Sleep for 2 secs, to not make too many calls.
			if(!accessToken)
			{
				await new Promise(r => setTimeout(r, 2000));
			}

			counter++;
		}

		if(!accessToken)
		{
			throw new Error(`${maxNumberOfAttempts} tries to create a session failed.`);
		}

		return accessToken;
	}

	protected async getWebAPIBaseURL(): Promise<string>
	{
		let environment = jwtDecode(this.client.OAuthAccessToken)["pepperi.datacenter"];

		const webappAddon = await this.papiClient.addons.installedAddons.addonUUID(this.WEB_API_ADDON_UUID).get();
		environment = environment == "sandbox" ? "sandbox." : "";

		const baseURL = `https://webapi.${environment}pepperi.com/${webappAddon.Version}/webapi`;

		return baseURL;
	}

	public get webApiBaseUrl() 
	{
		return (async () => 
		{
			if(!this._webApiBaseUrl)
			{
				this._webApiBaseUrl = await this.getWebAPIBaseURL();
			}
			
			return this._webApiBaseUrl;
		})();
	}

	public get accessToken() 
	{
		return (async () => 
		{
			if(!this._accessToken)
			{
				this._accessToken = await this.getAccessToken(await this.webApiBaseUrl);
			}

			return this._accessToken;
		})();
	}
}
