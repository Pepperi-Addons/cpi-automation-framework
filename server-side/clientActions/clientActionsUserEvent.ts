import { ADDON_BLOCK_NAME } from "shared-cpi-automation";
import { ClientActionUserEventConstructorData, EventResponse, ModalActionExecutionResult } from "../constants";
import ClientActionModalTest from "./clientActionsModal";

export default class ClientActionUserEvent extends ClientActionModalTest 
{
	protected readonly errorPrefix = "User Event handler error -";

	constructor(protected data: EventResponse, protected constructorData: ClientActionUserEventConstructorData) 
	{
		super(data, constructorData);
		this.validateModalActionEmittedByUserEvent();
	}

	executeAction(): Promise<ModalActionExecutionResult>
	{		
		this.validateUserEventMatchesExpectedUserEventName();

		const result: ModalActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Canceled: false,
				Result: {}
			}
		};

		return Promise.resolve(result);
	}

	protected validateUserEventMatchesExpectedUserEventName(): void
	{
		const actualUserEventName = this.data.Value.Data?.HostObject?.pageParams?.userEventName;

		if(actualUserEventName !== this.constructorData.UserEventName)
		{
			throw new Error(`${this.errorPrefix} Expected userEventName to equal "CpiAutomationFramework", but found "${actualUserEventName}"`);
		}
	}

	protected validateModalActionEmittedByUserEvent(): void
	{
		
		if(this.data.Value.Data?.AddonBlockName !== ADDON_BLOCK_NAME)
		{
			throw new Error(`${this.errorPrefix} Expected AddonBlockName to equal "CpiAutomationFramework", but found "${this.data.Value.Data?.AddonBlockName}"`);
		}

		if(this.data.Value.Data?.Title !== ADDON_BLOCK_NAME)
		{
			throw new Error(`${this.errorPrefix} Expected Title to equal "CPI Automation Framework", but found "${this.data.Value.Data?.Title}"`);
		}
	}
}
