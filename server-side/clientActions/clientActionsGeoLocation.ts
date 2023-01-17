import { GeoLocationActionExecutionResult } from "../constants";
import ClientActionBase from "./clientActionsBase";

/** account geo data for tests */
//class for geo location client action responses:
//https://pepperi-addons.github.io/client-actions-docs/actions/geo-location.html
interface accountGeoData {
  City: string;
  Country: string;
  Street: string;
  Latitude?: number;
  Longitude?: number;
}

const accountData1: accountGeoData = {
	City: "Havelberg",
	Country: "Germany",
	Street: "Pritzwalker Str.70",
	Latitude: 52.83634,
	Longitude: 12.0816,
};

const accountData2: accountGeoData = {
	City: "Rostock",
	Country: "Germany",
	Street: "Seidenstraße 5",
	Latitude: 54.0902,
	Longitude: 12.14491,
};

const accountData3: accountGeoData = {
	City: "Wedemark",
	Country: "Germany",
	Street: "Langer Acker 1",
	Latitude: 52.51669,
	Longitude: 9.73096,
};

const accountData4: accountGeoData = {
	City: "Radeberg",
	Country: "Germany",
	Street: "Pulsnitzer Str. 33",
	Latitude: 51.12013,
	Longitude: 13.92224,
};

const accountDataArr: accountGeoData[] = [
	accountData1,
	accountData2,
	accountData3,
	accountData4,
];

export default class ClientActionGeoLocationTest extends ClientActionBase 
{
	executeAction(): Promise<GeoLocationActionExecutionResult> 
	{
		const randIndex = Math.floor(Math.random() * 3) + 1;
		const randAccuracy = Math.floor(Math.random() * 100) + 1;

		return Promise.resolve({
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.Success,
				Longitude: accountDataArr[randIndex].Longitude!,
				Latitude: accountDataArr[randIndex].Latitude!,
				Accuracy: randAccuracy,
			}
		});
	}

	negativeTest(): Promise<GeoLocationActionExecutionResult>
	{
		return Promise.resolve({
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.false,
				Longitude: 0,
				Latitude: 0,
				Accuracy: 0,
				ErrorMessage: "Error"
			}
		});
	}
}
