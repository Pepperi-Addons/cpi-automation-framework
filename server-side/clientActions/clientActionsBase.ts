//https://pepperi-addons.github.io/client-actions-docs/
export default abstract class ClientActionBase implements IClientAction
{

	constructor(protected data: any)
	{}
  
  abstract executeAction(): Promise<ActionExecutionResult>;

  abstract negativeTest(): Promise<ActionExecutionResult>;

}

export interface IClientAction
{
    executeAction(): Promise<ActionExecutionResult>;

    negativeTest(): Promise<ActionExecutionResult>;
}

export interface ActionExecutionResult
{
  success: boolean; resObject: any
}
