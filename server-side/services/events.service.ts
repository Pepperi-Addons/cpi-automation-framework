import { AddonUUID } from '../../addon.config.json'
import ClientActionBase from "../clientActions/clientActionsBase";
import FetchService from "./fetch.service";
import { Client } from "@pepperi-addons/debug-server/dist";
import { ClientActionAndConstructorData, Event, EventResponse } from "../constants";
import CpiSessionService from "./cpiSession.service";
import deepClone from 'lodash.clonedeep'
import { LOGGING_PREFIX } from 'shared-cpi-automation';


//https://pepperi-addons.github.io/client-actions-docs/

export class EventsService 
{
	protected fetchService: FetchService;
	protected cpiSession: CpiSessionService;
	protected isRegisteredToUserEvents = false;

	constructor(protected client: Client, protected clientActionClasses: Array<ClientActionAndConstructorData>)
	{
		this.fetchService = new FetchService();
		this.cpiSession = new CpiSessionService(client, this.fetchService);
	}

	/**
    Asynchronously executes an event sequence.
    @param {Event} eventBody - The event to be executed.
    @return {Promise<Event | EventResponse>} A promise that resolves to the final event in the 
	sequence (in case the last client action does not emit an event) or the final event response.
    */	public async executeEventsSequence(eventBody: Event): Promise<Event | EventResponse> 
	{
		await this.registerToUserEventsIfNecessary();

		const eventResponse = await this.postEvent(eventBody);
		console.log(LOGGING_PREFIX, eventResponse);

		const clientActionRequest = eventResponse.Value;


		if (Object.entries(clientActionRequest).length === 0 /*|| clientActionRequest.Type === 'Finish'*/) 
		{
			this.validateEndOfClientActionsLoop();
			return eventResponse;
		}

		const action: ClientActionBase = this.getClientActionInstance(eventResponse);
		const actionResult: Event = await action.executeAction();

		if (Object.entries(actionResult.EventData).length === 0) 
		{
			this.validateEndOfClientActionsLoop();
			return actionResult;
		}

		return await this.executeEventsSequence(actionResult);
	}

	/**
    Checks if the ClientActionFactory's clientActionClasses array is empty.
    If it is not empty, an error is thrown with the number of actions left in the queue.
    @throws Error if ClientActionFactory.clientActionClasses is not empty
    */
	protected validateEndOfClientActionsLoop(): void
	{
		if(this.clientActionClasses?.length > 0)
		{
			const numberOfActionsLeft = this.clientActionClasses.length;
			const errorMessage = `${LOGGING_PREFIX} ClientActionFactory.clientActionClasses is not empty (${numberOfActionsLeft} action(s) left in the queue) even though there are no further actions.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	/**
    Asynchronously posts an event to the server.
    @param {Event} event - The event to be posted.
    @return {Promise<EventResponse>} A promise that resolves to the server's response to the posted event.
    */
	protected async postEvent(event: Event): Promise<EventResponse>
	{
		const url = `${await this.cpiSession.webApiBaseUrl}/Service1.svc/v1/EmitEvent`;

		const headers = { PepperiSessionToken: await this.cpiSession.accessToken };

		const eventCopy = deepClone(event);

		eventCopy.EventData = JSON.stringify(eventCopy.EventData);

		const postRes = await this.fetchService.post(url, eventCopy, headers);

		postRes.Value = JSON.parse(postRes.Value);

		return postRes;
	}

	/**
     * Create an instance of the class in index 0 of the ClientActionFactory.clientActionClasses array.
     * The reference on the 0 index is popped from the array.
     * @param data 
     * @returns 
     */
	 protected getClientActionInstance(data: any): ClientActionBase
	 {
		 let errorMessage = ''
 
		 if(!this.clientActionClasses)
		 {
			 errorMessage = "ClientActionFactory.clientActionClasses is undefined."
		 }
		 else if(this.clientActionClasses.length === 0)
		 {
			 errorMessage = "ClientActionFactory.clientActionClasses is empty.";
		 }
 
		 if(errorMessage)
		 {
			 throw new Error(`${LOGGING_PREFIX} ${errorMessage}\nGot the following client action request: ${JSON.stringify(data)}`);
		 }
		 
		 // Pop the first client action class
		 const clientActionType = this.clientActionClasses.shift()!;
		 const clientActionInstance = new clientActionType[0](data, clientActionType[1]);
 
		 return clientActionInstance;
	 }
	
	/**
    Registers to the user events, if necessary.
    This method will check if the user events are already registered. If not, it will emit an AddonAPI event to an endpoint that subscribes to the user events.
    The user events names are taken from the constructor data that has the UserEventName property.
    @throws {Error} if the registration to user events fails. The error message includes error message returned from the AddonAPI event.
    */
	protected async registerToUserEventsIfNecessary() 
	{
		if(!this.isRegisteredToUserEvents)
		{
			const constructorsData = this.clientActionClasses.map(classReference => classReference[1]);
			const constructorsDataWithUserEvent = constructorsData.filter(constructorData => constructorData.hasOwnProperty("UserEventName"));
			const userEventNames = constructorsDataWithUserEvent.map(constructorData => constructorData.UserEventName);
			const eventData = { UserEvents : userEventNames};

			const event: Event = {
				EventKey: "AddonAPI",
				EventData: {
					AddonUUID: AddonUUID,
					RelativeURL: '/addon-cpi-simcha/subscribe_to_user_events',
					Method: 'POST',
					Body: eventData
				}
			}
			const res = await this.postEvent(event);
			
			if(!res.Success)
			{
				throw new Error(`${LOGGING_PREFIX} Failed to register to user events: ${res.ErrorCode}: ${res.ErrorMessage}`);
			}
		}

		this.isRegisteredToUserEvents = true;
	}
}
