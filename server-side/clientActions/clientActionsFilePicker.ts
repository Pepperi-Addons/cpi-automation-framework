import { FilePickerActionExecutionResult  } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionFilePickerTest extends ClientActionBase 
{
	executeAction(MIME: string, URI: string): FilePickerActionExecutionResult
	{
		const result: FilePickerActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: true,
				MimeType: MIME,
				URI: URI
			}
		};

		return result;
	}
}
