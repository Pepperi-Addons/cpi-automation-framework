import { Event } from "../constants";

export default abstract class ClientActionBase
{

	constructor(protected data: any)
	{}
  
  abstract executeAction(): Promise<Event>;

  abstract negativeTest(): Promise<Event>;

}

