import { EventResponse } from "../constants";

export default abstract class ClientActionBase
{
	constructor(protected data: EventResponse)
	{}
}
