import { Client, Request } from '@pepperi-addons/debug-server'
import ClientActionDialogTest from './clientActions/clientActionsDialog';
import ClientActionUserEvent from './clientActions/clientActionsUserEvent';
import { ClientActionAndConstructorData, Event } from './constants';
import { EventsService } from './services/events.service'

export async function test(client: Client, request: Request) 
{
	const clientActionsArray: Array<ClientActionAndConstructorData> = [[ClientActionUserEvent, {UserEventName: "OnSurveyDataLoad"}],
																		[ClientActionDialogTest, {}],
																		[ClientActionUserEvent, {UserEventName: "OnSurveyViewLoad"}]
																	]
	const eventsService = new EventsService(client, clientActionsArray);

	const initialEventBody: Event = {
		EventKey: "OnClientSurveyLoad",
		EventData: {
			"SurveyKey": "05456092-08e4-40fd-8584-f6eb0c365e28"
		}
	}
	const res = await eventsService.executeEventsSequence(initialEventBody)
}
