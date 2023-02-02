
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, errorMessage:{the reason why it is false}}
The error Message is important! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server';
import { AddonDataScheme, PapiClient } from '@pepperi-addons/papi-sdk';
import { SCHEMA_NAME } from 'shared-cpi-automation';
import { AddonUUID } from '../addon.config.json'

export async function install(client: Client, request: Request): Promise<any> 
{
	const resultObject = {success: true, resultObject: {}};
	// let schema: AddonDataScheme | undefined = undefined;

	// const papiClient: PapiClient = createPapiClient(client);

	// try
	// {
	// 	schema = await createUserEventsSchema(papiClient);
	// }
	// catch(error)
	// {
	// 	const errorMessage = error instanceof Error ? error.message : `An unknown error occurred trying to upsert a schema.`;
	// 	console.error(errorMessage);
	// 	resultObject.success = false;
	// }
	
	// if(resultObject.success)
	// {
	// 	resultObject.resultObject = { CreatedSchema: schema};
	// }

	return resultObject;
}

function createPapiClient(client: Client): PapiClient {
	return new PapiClient({
		baseURL: client.BaseURL,
		token: client.OAuthAccessToken,
		actionUUID: client.ActionUUID,
		addonSecretKey: client.AddonSecretKey,
		addonUUID: client.AddonUUID,
	})
}

export async function uninstall(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
}

async function createUserEventsSchema(papiClient: PapiClient): Promise <AddonDataScheme>
{
	const schema: AddonDataScheme = {
		Name: SCHEMA_NAME,
		AddonUUID: AddonUUID,
		Type: 'data',
		SyncData: {
			Sync: true
		},
		Fields:
		{
			Key:{
				Type: "String"
			}
		}
	}

	return await papiClient.addons.data.schemes.post(schema);
}
