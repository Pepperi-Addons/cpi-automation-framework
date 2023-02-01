import { Client } from "@pepperi-addons/debug-server/dist";
import { Event } from "../constants";
import ClientActionExpecter from './clientActionExpecter';

//https://pepperi-addons.github.io/client-actions-docs/

export class EventsService<T extends Event>
{
	constructor(protected client: Client)
	{}

	public postEvent(eventBody: T) 
	{
		return new ClientActionExpecter<T>(this.client, eventBody);
	}
}
