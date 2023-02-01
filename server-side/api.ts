import { Client, Request } from '@pepperi-addons/debug-server'
import { DialogActionExecutionResult, Event, ModalActionExecutionResult } from './constants';
import { EventsService } from './services/events.service'

import { expect } from 'chai'


export async function test(client: Client, request: Request) 
{

	const initialEventBody: Event = {
		EventKey: "OnClientSurveyLoad",
		EventData: {
			"SurveyKey": "05456092-08e4-40fd-8584-f6eb0c365e28"
		}
	}


	const initialEventsService = new EventsService(client);
	const {eventService, eventResult} = await initialEventsService.postEvent(initialEventBody).expectingUserEvent("OnSurveyDataLoad");
	console.log(JSON.stringify(eventResult));

	const firstUserActionResponse: ModalActionExecutionResult = {
		EventKey: eventResult.Value.Callback,
		EventData: {
			Canceled: false,
			Result: {}
		}
	};

	const {eventService: eventService2, eventResult: eventResult2} = await eventService.postEvent(firstUserActionResponse).expectingDialogClientAction();
	console.log(JSON.stringify(eventResult2));

	const result: DialogActionExecutionResult = {
		EventKey: eventResult2.Value.Callback,
		EventData: {
			SelectedAction: eventResult2.Value.Data.Actions[0].Key!
		}
	};

	const {eventService: eventService3, eventResult: eventResult3} = await eventService2.postEvent(result).expectingUserEvent("OnSurveyViewLoad");
	console.log(JSON.stringify(eventResult3));

	const secondUserActionResponse: ModalActionExecutionResult = {
		EventKey: eventResult3.Value.Callback,
		EventData: {
			Canceled: false,
			Result: {}
		}
	};

	const finishEvent = eventService3.postEvent(secondUserActionResponse).expectingFinish();
	console.log(JSON.stringify(finishEvent));


	
}

// describe('testing something', () => {
	
// 	it('Test 1 - more than one account show account selection', async () => {

// 		const client = await triggerEvent('OpenSalesOrder');
// 		const action: ClientActionBase = client.step(/*single entry from array*/);

// 		const action = client.state;

// 		// expect a account list selection
// 		expect(action).to.be.instanceOf('OpenModalAction');
// 		expect(action.Data.Name).to.be.equal('ResourcePicker');
// 		expect(action.Date.HostObject).to.be.deep.equal({
// 			Resource: 'accounts'
// 		});

// 		// select a single account and contiune
// 		const newAction = action.hostEvent.emit('')





// 	})

// 	it('Test 1 - one catalog', () => {





// 	})

// 	it('Test 1 - validate / no validate', () => {





// 	})
// })
