import { ActionExecutionResult } from "../constants";

//https://pepperi-addons.github.io/client-actions-docs/
export default abstract class ClientActionBase
{

	constructor(protected data: any)
	{}
  
  abstract executeAction(): Promise<ActionExecutionResult>;

  abstract negativeTest(): Promise<ActionExecutionResult>;

}

