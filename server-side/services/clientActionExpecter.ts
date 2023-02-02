import { Client } from "@pepperi-addons/debug-server/dist";
import CpiSessionService from "./cpiSession.service";
import FetchService from "./fetch.service";
import deepClone from 'lodash.clonedeep'
import { DialogActionExecutionResult, EventResponse,
	EventResponseDialog, Event, EventResponseModal,
	GeoLocationActionExecutionResult, EventResponseGeoLocation,
	HUDActionExecutionResult, EventResponseHud,
	ModalActionExecutionResult, EventResponseNavigation,
	ScanBarcodeActionExecutionResult } from "../constants";
import { EventsService } from "./events.service";
import { AddonUUID } from "../../addon.config.json"
import { ADDON_BLOCK_NAME, LOGGING_PREFIX } from "shared-cpi-automation";

export default class ClientActionExpecter<T extends Event>
{
	protected fetchService: FetchService;
	protected cpiSession: CpiSessionService;

	constructor(protected client: Client, protected eventBody: T)
	{
		this.fetchService = new FetchService();
		this.cpiSession = new CpiSessionService(client, this.fetchService);
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `DialogActionExecutionResult` events, and the expected `EventResponseDialog`.
    * 
    * @return {Promise<{eventService: EventsService<DialogActionExecutionResult>, eventResult: EventResponseDialog}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `DialogActionExecutionResult` events, and the expected `EventResponseDialog`.
    */
	public async expectingDialogClientAction(): Promise<{eventService: EventsService<DialogActionExecutionResult>, eventResult: EventResponseDialog}>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponseDialog>('Dialog');
		const newEventService = new EventsService<DialogActionExecutionResult>(this.client);

		return {eventService: newEventService, eventResult: eventResponse};
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `GeoLocationActionExecutionResult` events, and the expected `EventResponseGeoLocation`.
    * 
    * @return {Promise<{eventService: EventsService<GeoLocationActionExecutionResult>, eventResult: EventResponseGeoLocation}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `GeoLocationActionExecutionResult` events, and the expected `EventResponseGeoLocation`.
    */
	public async expectingGeoLocationClientAction(): Promise<{eventService: EventsService<GeoLocationActionExecutionResult>, eventResult: EventResponseGeoLocation}>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponseGeoLocation>('GeoLocation');
		const newEventService = new EventsService<GeoLocationActionExecutionResult>(this.client);

		return {eventService: newEventService, eventResult: eventResponse};
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `HUDActionExecutionResult` events, and the expected `EventResponseHud`.
    * 
    * @return {Promise<{eventService: EventsService<HUDActionExecutionResult>, eventResult: EventResponseHud}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `HUDActionExecutionResult` events, and the expected `EventResponseHud`.
    */
	public async expectingHudClientAction(): Promise<{eventService: EventsService<HUDActionExecutionResult>, eventResult: EventResponseHud}>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponseHud>('HUD');
		const newEventService = new EventsService<HUDActionExecutionResult>(this.client);

		return {eventService: newEventService, eventResult: eventResponse};
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `ModalActionExecutionResult` events, and the expected `EventResponseModal`.
    * 
    * @return {Promise<{eventService: EventsService<ModalActionExecutionResult>, eventResult: EventResponseModal}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `ModalActionExecutionResult` events, and the expected `EventResponseModal`.
    */
	public async expectingModalClientAction(): Promise<{eventService: EventsService<ModalActionExecutionResult>, eventResult: EventResponseModal}>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponseModal>('Modal');
		const newEventService = new EventsService<ModalActionExecutionResult>(this.client);

		return {eventService: newEventService, eventResult: eventResponse};
	}

	/**
    * Returns a Promise that resolves to the expected `EventResponseNavigation`.
    * 
    * @return {Promise<EventResponseNavigation>}
    * A Promise that resolves to the expected `EventResponseNavigation`.
    */
	public async expectingNavigationClientAction(): Promise<EventResponseNavigation>
	{
		return await this.getExpectedEventResponse<EventResponseNavigation>('Navigation');
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `ScanBarcodeActionExecutionResult` events, and the expected `EventResponse`.
    * 
    * @return {Promise<{eventService: EventsService<ScanBarcodeActionExecutionResult>, eventResult: EventResponse}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `ScanBarcodeActionExecutionResult` events, and the expected `EventResponse`.
    */
	public async expectingScanBarcodeClientAction(): Promise<{eventService: EventsService<ScanBarcodeActionExecutionResult>, eventResult: EventResponse}>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponse>('Barcode');
		const newEventService = new EventsService<ScanBarcodeActionExecutionResult>(this.client);
    
		return {eventService: newEventService, eventResult: eventResponse};
	}

	/**
    * Returns a Promise that resolves to an object containing an instance of the `EventsService` class
    * specifically for `Event` events, and the expected `EventResponseModal`.
    * 
    * @return {Promise<{eventService: EventsService<Event>, eventResult: EventResponseModal}>}
    * A Promise that resolves to an object containing an instance of the `EventsService` class specifically for `Event` events, and the expected `EventResponseModal`.
    */
	public async expectingUserEvent(userEventName: string): Promise<{eventService: EventsService<Event>, eventResult: EventResponseModal}>
	{
		await this.registerToUserEvent(userEventName);

		const eventResponse = await this.getExpectedEventResponse<EventResponseModal>('Modal');
		const newEventService = new EventsService<Event>(this.client);
        
		this.validateUserEvent(eventResponse, userEventName);

		return {eventService: newEventService, eventResult :eventResponse};
	}

	/**
    * Returns a Promise that resolves to the expected `EventResponse`.
    * 
    * @return {Promise<EventResponse>}
    * A Promise that resolves to the expected `EventResponse`.
    */
	public async expectingFinish(): Promise<EventResponse>
	{
		const eventResponse = await this.getExpectedEventResponse<EventResponse>('Finish');
		return eventResponse;
	}

	/**
    Retrieves an expected event response from the tested addon's CPI-side.
    @template U - The type of the expected event response. It should extend {@link EventResponse}.
    @param {string} expectedClientActinType - The expected type of the client action.
    @returns {Promise<U>} A promise that resolves to the expected event response.
    @throws {Error} If failed posting the requested event.
    @throws {Error} If the retrieved event response's type does not match the expected type.
    */
	protected async getExpectedEventResponse<U extends EventResponse> (expectedClientActinType: string): Promise<U>
	{
		const eventResponse = await this.postEvent(this.eventBody) as U;
		if(!eventResponse.Success)
		{
			throw new Error(`${LOGGING_PREFIX} Failed getting the expected client action: ${eventResponse.ErrorCode}: ${eventResponse.ErrorMessage}`);
		}

		if (eventResponse.Value.Type !== expectedClientActinType) 
		{
			throw new Error(`${LOGGING_PREFIX} Expected a ${expectedClientActinType} client action but got "${eventResponse.Value.Type}".`);
		}

		return eventResponse;
	}

	/**
     * Validate the properties of an EventResponseModal object against a user event name.
     *
     * @param eventResponse - The EventResponseModal object to be validated.
     * @param userEventName - The user event name to be compared against the eventResponse object.
     *
     * @throws Error if the eventResponse object does not match the expected AddonBlockName, Title, or userEventName.
     * The error message includes the property that does not match the expected value.
     */
	protected validateUserEvent(eventResponse: EventResponseModal, userEventName: string): void
	{
		let errorMessage = '';

		if (eventResponse.Value.Data?.AddonBlockName !== ADDON_BLOCK_NAME) 
		{
			errorMessage = `${LOGGING_PREFIX} Expected AddonBlockName to equal "CpiAutomationFramework", but found "${eventResponse.Value.Data?.AddonBlockName}"`;
		}
		else if (eventResponse.Value.Data?.Title !== ADDON_BLOCK_NAME) 
		{
			errorMessage = `${LOGGING_PREFIX} Expected Title to equal "CPI Automation Framework", but found "${eventResponse.Value.Data?.Title}"`;
		}
		else if (eventResponse.Value.Data?.HostObject?.pageParams?.userEventName !== userEventName) 
		{
			errorMessage = `${LOGGING_PREFIX} Expected userEventName to equal "${userEventName}", but found "${eventResponse.Value.Data?.HostObject?.pageParams?.userEventName}"`;
		}

		if (errorMessage) 
		{
			console.error(errorMessage);
			throw new Error(errorMessage);
		}        
	}

	/**
    Asynchronously posts an event to the server.
    @param {Event} event - The event to be posted.
    @return {Promise<EventResponse>} A promise that resolves to the server's response to the posted event.
    */
	protected async postEvent(event: Event): Promise<EventResponse>
	{
		const url = `${await this.cpiSession.webApiBaseUrl}/Service1.svc/v1/EmitEvent`;

		const headers = { PepperiSessionToken: await this.cpiSession.accessToken };

		const eventCopy = deepClone(event);

		eventCopy.EventData = JSON.stringify(eventCopy.EventData);

		const postRes = await this.fetchService.post(url, eventCopy, headers);

		postRes.Value = JSON.parse(postRes.Value);

		return postRes;
	}

	/**
    Registers to the user event.
    Asynchronously emit an AddonAPI event to an endpoint that subscribes to the user events.
    @param {string} userEventName - The user event name to register to.
    @throws {Error} if the registration to user event fails. The error message includes error message returned from the AddonAPI event.
    */
	protected async registerToUserEvent(userEventName: string): Promise<void>
	{
		const eventData = { UserEvents : [userEventName]};

		const event: Event = {
			EventKey: "AddonAPI",
			EventData: {
				AddonUUID: AddonUUID,
				RelativeURL: '/addon-cpi-simcha/subscribe_to_user_events',
				Method: 'POST',
				Body: eventData
			}
		}
		const res = await this.postEvent(event);
        
		if(!res.Success)
		{
			throw new Error(`${LOGGING_PREFIX} Failed to register to user event: ${res.ErrorCode}: ${res.ErrorMessage}`);
		}
	}
}
