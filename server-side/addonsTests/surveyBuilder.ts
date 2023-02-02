import { Client } from "@pepperi-addons/debug-server/dist";
import ClientActionDialogTest from "../clientActions/clientActionsDialog";
import ClientActionUserEvent from "../clientActions/clientActionsUserEvent";
import { DialogActionExecutionResult, Event, ModalActionExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";


export default class SurveyBuilderTest
{
	constructor(protected client: Client)
	{}
	public async test()
	{

		const initialEventBody: Event = {
			EventKey: "OnClientSurveyLoad",
			EventData: {
				"SurveyKey": "05456092-08e4-40fd-8584-f6eb0c365e28"
			}
		}
		const initialEventsService = new EventsService(this.client);

		// Emit "OnClientSurveyLoad" event, expecting "OnSurveyDataLoad" user event
		const {eventService, eventResult} = await initialEventsService.emitEvent(initialEventBody).expectingUserEvent("OnSurveyDataLoad");
		const firstUserActionResponse: ModalActionExecutionResult = new ClientActionUserEvent(eventResult).executeAction();
    
		// Emit a response for the "OnSurveyDataLoad" user event, expecting dialog client action
		const {eventService: eventService2, eventResult: eventResult2} = await eventService.emitEvent(firstUserActionResponse).expectingDialogClientAction();
		const result: DialogActionExecutionResult = new ClientActionDialogTest(eventResult2).selectActionK(0);
    
		// Emit a response for the dialog client action, expecting "OnSurveyViewLoad" user event
		const {eventService: eventService3, eventResult: eventResult3} = await eventService2.emitEvent(result).expectingUserEvent("OnSurveyViewLoad");
		const secondUserActionResponse: ModalActionExecutionResult = new ClientActionUserEvent(eventResult3).executeAction();
        
		// Emit a response for the "OnSurveyViewLoad" user event, expecting finish event
		const finishEvent = eventService3.emitEvent(secondUserActionResponse).expectingFinish();
		console.log(JSON.stringify(finishEvent));

	}
}
