import ClientActionBase, { IClientAction } from "../clientActions/clientActionsBase";

export default class ClientActionFactory
{
	/**
     * The clientActionClasses array is treated like a queue of client action handlers.
     * Each time a client action is needed, the first (index 0) client action is popped.
     * The client actions are used in the order in which they are sorted in the array.
     * 
     * To populate it, pass an array of references to classes that inherit from ClientActionBase.
     * For example:
     * 
     * ClientActionFactory.clientActionClasses = [clientActionDialog, clientActionGeoLocation];
     */
	public static clientActionClasses: Array<Pick<typeof ClientActionBase, keyof typeof ClientActionBase> & (new(data) => IClientAction)> = []

	/**
     * Create an instance of the class in index 0 of the ClientActionFactory.clientActionClasses array.
     * The reference on the 0 index is popped from the array.
     * @param data 
     * @returns 
     */
	public static getClientActionInstance(data: any): IClientAction
	{
		let errorMessage = ''
        
        if(!ClientActionFactory.clientActionClasses)
		{
			errorMessage = "ClientActionFactory.clientActionClasses is undefined."
		}
		else if(ClientActionFactory.clientActionClasses.length === 0)
		{
			errorMessage = "ClientActionFactory.clientActionClasses is empty.";
		}

        if(errorMessage)
        {
            throw new Error(`${errorMessage}\nGot the following client action request: ${JSON.stringify(data)}`);
        }
        
		// Pop the first client action class
		const clientActionType = ClientActionFactory.clientActionClasses.shift()!;
		const clientActionInstance = new clientActionType(data);

		return clientActionInstance;
	}
}