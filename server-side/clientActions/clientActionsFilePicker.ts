import { FilePickerActionExecutionResult  } from "../constants";
import ClientActionBase from "./clientActionsBase";


export default class ClientActionModalTest extends ClientActionBase 
{
	executeAction(): Promise<FilePickerActionExecutionResult>
	{
		const result: FilePickerActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: true,
				MimeType: "image/jpeg",
				URI: "data:image/jpeg;base64,[BASE64 ENCODED DATA]"
			}
		};

		return Promise.resolve(result);
	}

	negativeTest(): Promise<FilePickerActionExecutionResult> 
	{
		throw new Error("Method not implemented.");
	}

}
