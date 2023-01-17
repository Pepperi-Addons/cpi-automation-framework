import { Client, Request } from '@pepperi-addons/debug-server'
import ClientActionBase from './clientActions/clientActionsBase';
import ClientActionDialogTest from './clientActions/clientActionsDialog';
import { ActionExecutionResult } from './constants';
import ClientActionFactory from './services/clientActionFactory';
import { EventsService } from './services/events.service'

export async function test(client: Client, request: Request) 
{
	ClientActionFactory.clientActionClasses = [ClientActionDialogTest, ClientActionFinish]

	const eventsService = new EventsService(client);
	const webApiBaseUrl = await eventsService.getWebAPIBaseURL();
	const accessToken = await eventsService.getAccessToken(webApiBaseUrl);

	const initialEventBody: any = {
		EventKey: "OnClientSurveyLoad",
		EventData: {
			SurveyKey: "05456092-08e4-40fd-8584-f6eb0c365e28"
		}
	}
	// initialEventBody.EventData = JSON.stringify(initialEventBody.EventData);
	eventsService.runEventLoop(webApiBaseUrl, accessToken, initialEventBody)
}

class ClientActionFinish extends ClientActionBase
{
	executeAction(): Promise<ActionExecutionResult> 
	{

		const result: ActionExecutionResult = {

				EventKey: this.data.Value.Callback,
				EventData: {}
		};

		return Promise.resolve(result);
	}

	negativeTest(): Promise<ActionExecutionResult> 
	{
		throw new Error('Method not implemented.');
	}

}

