import '@pepperi-addons/cpi-node'
import { ModalOptions } from '@pepperi-addons/cpi-node/build/cpi-side/app/components';
import { AddonsDataSearchParams } from '@pepperi-addons/cpi-node/build/cpi-side/client-api';
import { AddonUUID } from '../addon.config.json'
import { SCHEMA_NAME, ADDON_BLOCK_NAME } from "shared-cpi-automation"

declare global {
    var userEventsSet: Set<string>;
}

export async function load(configuration: any) 
{
	console.log('CPI Automation framework - get list of user events');
	const userEvents: Array<string> = await getUserEventsFromSchema();

	global.userEventsSet = new Set<string>();

	console.log('CPI Automation framework - Subscribe to user events listed in schema');
	await subscribeToUserEvents(userEvents);
}

export const router = Router();



router.post('/subscribe_to_user_events', async (req, res, next) => 
{
	
	try
	{
		await subscribeToUserEvents(req.body.UserEvents);
		res.json({});
	}
	catch(err)
	{
		console.log(err);
		next(err);
	}
});

/** 
	Asynchronously gets all the user events from a schema.
    @return {Promise<Array<string>>} A promise that resolves to an array of strings representing the user events.
*/
async function getUserEventsFromSchema(): Promise<Array<string>> 
{
	let userEvents: Array<string> = [];

	const addonsDataSearchParams: AddonsDataSearchParams = {
		Fields: ["Key"],
		PageSize: -1,
	};

	try
	{
		userEvents = (await pepperi.addons.data.uuid(AddonUUID).table(SCHEMA_NAME).search(addonsDataSearchParams)).Objects.map(userEvent => userEvent.Key!);
	}
	catch(error)
	{
		const errorMessage = `Failed to get user events from "${SCHEMA_NAME}" table. Error: ${error instanceof Error ? error.message : "Unknown error occurred."}`;
		console.error(errorMessage);
	}

	return userEvents;
}

/**
Subscribes to user events and intercepts them for further processing.
@param {Array<string>} userEvents - An array of user events to be subscribed to and intercepted.
*/
async function subscribeToUserEvents(userEvents: Array<string>): Promise<void>
{
	const userEventsNotYetSubscribed = userEvents.filter(userEvent => !global.userEventsSet.has(userEvent));
	
	await addUserEventsToSchema(userEventsNotYetSubscribed);

	console.log(`CPI Automation framework - Adding interceptors for the following User Events: ${JSON.stringify(userEventsNotYetSubscribed)}`);
	for (const userEventName of userEvents) 
	{
		global.userEventsSet.add(userEventName);

		pepperi.events.intercept(userEventName as any, {}, async (data, next, main): Promise<any> => 
		{
			console.log(`CPI Automation framework - Intercepted User Event "${userEventName}".`);

			const { client, clientLoop, timers, clientFactory, ...userEventData } = data;
			const eventData = {
				userEventName: userEventName,
				userEventData: userEventData
			};

			const modalOptions: ModalOptions = {
				addonBlockName: ADDON_BLOCK_NAME,
				allowCancel: false,
				title: ADDON_BLOCK_NAME,
				hostObject: {
					pageKey: "",
					pageParams: eventData
				}
			}

			console.log(`CPI Automation framework - modal body: ${JSON.stringify(modalOptions)}`);

			// Emit CPI test client action
			console.log(`CPI Automation framework - Emitting modal client action.`);

			await data.client?.showModal(modalOptions);

			console.log(`CPI Automation framework - Got back from modal client action.`);

			await next(main);
		});
	}
}

/**
    Asynchronously add the user events to the addon's user_events.
    @param {Array<string>} userEvents - An array of user events to be added.
    @return {Promise<void>} A promise that resolves when the user events have been added to the schema.
*/
async function addUserEventsToSchema(userEvents: Array<string>): Promise<void>
{
	for (const userEvent of userEvents)
	{
		try
		{
			//TODO uncomment this before handover. It is commented just so I won't screw up the distributor I'm working on.
			// await pepperi.addons.data.uuid(AddonUUID).table(schema_name).upsert({Key: userEvent});
		}
		catch(error)
		{
			const errorMessage = `Failed to save user event "${userEvent}" to "${SCHEMA_NAME}" table. Error: ${error instanceof Error ? error.message : "Unknown error occurred."}`;
			console.error(errorMessage);
		}
	}
}
