import { ModalActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";

export default class ClientActionUserEvent extends ClientActionBase
{
	executeAction(): ModalActionExecutionResult
	{		

		const result: ModalActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Canceled: false,
				Result: {}
			}
		};

		return result;
	}
}
