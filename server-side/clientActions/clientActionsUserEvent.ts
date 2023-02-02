import { ADDON_BLOCK_NAME, LOGGING_PREFIX } from "shared-cpi-automation";
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
			const errorMessage = `${LOGGING_PREFIX} ${this.errorPrefix} Expected userEventName to equal "CpiAutomationFramework", but found "${actualUserEventName}"`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	protected validateModalActionEmittedByUserEvent(): void
	{
		
		let errorMessage = ''
		if(this.data.Value.Data?.AddonBlockName !== ADDON_BLOCK_NAME)
		{
			errorMessage = `${LOGGING_PREFIX} ${this.errorPrefix} Expected AddonBlockName to equal "CpiAutomationFramework", but found "${this.data.Value.Data?.AddonBlockName}"`
		}

		else if(this.data.Value.Data?.Title !== ADDON_BLOCK_NAME)
		{
			errorMessage = `${LOGGING_PREFIX} ${this.errorPrefix} Expected Title to equal "CPI Automation Framework", but found "${this.data.Value.Data?.Title}"`;
		}

		if(errorMessage)
		{
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
