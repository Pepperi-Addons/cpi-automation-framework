import { EventResponseUserEvent, UserEventExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class UserEvent extends EventResult
{
	constructor(protected eventsService: EventsService, protected data: EventResponseUserEvent)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data
	}

	/**
	 * Passes an empty result to the event.
	 * @returns {Promise<EventResult>} - A promise that resolves to the resulting EventResult.
	 */
	public async setEmptyResult(): Promise<EventResult>
	{
		return await this.setResult({})
	}

	public async setResult(resultToSet: UserEventExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;

	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
