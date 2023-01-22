import { Event } from "../constants";

export default abstract class ClientActionBase
{

	constructor(protected data: any, protected constructorData: any)
	{}
  
  abstract executeAction(): Promise<Event>;
}
