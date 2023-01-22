import ClientActionBase from "../clientActions/clientActionsBase";
import FetchService from "./fetch.service";
import { Client } from "@pepperi-addons/debug-server/dist";
import { ClientActionBaseReference, Event, EventResponse } from "../constants";
import CpiSessionService from "./cpiSession.service";
import deepClone from 'lodash.clonedeep'


//https://pepperi-addons.github.io/client-actions-docs/

export class EventsService 
{
	protected fetchService: FetchService;
	protected cpiSession: CpiSessionService;

	constructor(protected client: Client, protected clientActionClasses: Array<ClientActionBaseReference>)
	{
		this.fetchService = new FetchService();
		this.cpiSession = new CpiSessionService(client, this.fetchService);
	}

	/**
    Asynchronously executes an event sequence.
    @param {Event} eventBody - The event to be executed.
    @return {Promise<Event | EventResponse>} A promise that resolves to the final event in the 
	sequence (in case the last client action does not emit an event) or the final event response.
    */	public async executeEventSequence(eventBody: Event): Promise<Event | EventResponse> 
	{
		const eventResponse = await this.postEvent(eventBody);
		console.log(eventResponse);

		const clientActionRequest = eventResponse.Value;
		//stop condition -- if actions returns empty recursion returns to the previous iteration
		if (Object.entries(clientActionRequest).length === 0 || clientActionRequest.Type === 'Finish') 
		{
			this.validateEndOfClientActionsLoop();
			return eventResponse;
		} // note that the callback EmitEvent does not return any values;

		const action: ClientActionBase = this.getClientActionInstance(eventResponse);
		const actionResult: Event = await action.executeAction();

		if (Object.entries(actionResult.EventData).length === 0) 
		{
			this.validateEndOfClientActionsLoop();
			return actionResult;
		}

		return await this.executeEventSequence(actionResult);
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
			throw new Error(`ClientActionFactory.clientActionClasses is not empty (${numberOfActionsLeft} action(s) left in the queue) even though there are no further actions.`);
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
			 throw new Error(`${errorMessage}\nGot the following client action request: ${JSON.stringify(data)}`);
		 }
		 
		 // Pop the first client action class
		 const clientActionType = this.clientActionClasses.shift()!;
		 const clientActionInstance = new clientActionType(data);
 
		 return clientActionInstance;
	 }
}
