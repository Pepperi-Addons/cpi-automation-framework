import { Event, EventResponse } from "../constants";

export default abstract class ClientActionBase
{
	constructor(protected data: EventResponse, protected constructorData: any)
	{}
  
  abstract executeAction(): Promise<Event>;
}
