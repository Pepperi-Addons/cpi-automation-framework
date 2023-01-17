import { ModalActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";

export default class ClientActionModalTest extends ClientActionBase 
{
	executeAction(): Promise<ModalActionExecutionResult>
	{
		const result: ModalActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Canceled: false,
				Result: {
					action: "on-save",
					data: {
						selectedObjectKeys: [
							"410f0c5a-9428-40e2-abaf-cb06ac493abd",
							"a5289673-c5c8-4bbd-aa5d-1ba0dc272e3c"
					  	]
					}
				}
			}
		};

		return Promise.resolve(result);
	}

	negativeTest(): Promise<ModalActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}

}
