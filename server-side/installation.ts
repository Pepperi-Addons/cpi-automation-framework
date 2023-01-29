
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, errorMessage:{the reason why it is false}}
The error Message is important! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server';
import { AddonDataScheme, PapiClient, Relation } from '@pepperi-addons/papi-sdk';
import { ADDON_BLOCK_NAME, SCHEMA_NAME } from 'shared-cpi-automation';
import {AddonUUID} from '../addon.config.json'

export async function install(client: Client, request: Request): Promise<any> 
{
	const resultObject = {success: true, resultObject: {}};
	let relation: Relation | undefined = undefined;
	let schema: AddonDataScheme | undefined = undefined;

	const papiClient: PapiClient = createPapiClient(client);

	// try
	// {
	// 	relation = await upsertAddonBlockRelation(papiClient);
	// }
	// catch(error)
	// {
	// 	handleError(error, "relation", resultObject);
	// }

	try
	{
		schema = await createUserEventsSchema(papiClient);
	}
	catch(error)
	{
		handleError(error, "schema", resultObject);
	}
	
	resultObject.resultObject = { CreatedSchema: schema};

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

function handleError(error: unknown, resourceName: string, resultObject: any): void 
{
	const errorMessage = error instanceof Error ? error.message : `An unknown error occurred trying to upsert a ${resourceName}.`;
		console.error(errorMessage);
		resultObject.success = false;
		resultObject.errorMessage = resultObject.errorMessage ? `${resultObject.errorMessage}\n${errorMessage}`: errorMessage;
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

async function upsertAddonBlockRelation(papiClient: PapiClient): Promise<Relation>
{
	const addonBlockRelation: Relation = {
		RelationName: "AddonBlock",
		Name: ADDON_BLOCK_NAME,
		Description: "CPI Automation Framework addon block",
		Type: "NgComponent",
		SubType: "NG14",
		AddonUUID: AddonUUID,
		AddonRelativeURL: "",
		ComponentName: "",
		ModuleName: "",
		ElementsModule: "",
		ElementName: "",
	}; 
	
	return await papiClient.addons.data.relations.upsert(addonBlockRelation);
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
