import { Client, Request } from '@pepperi-addons/debug-server'
import SurveyBuilderTest from './addonsTests/surveyBuilder';


export async function test_survey_builder(client: Client, request: Request) 
{
	const surveyBuilderTester = new SurveyBuilderTest(client);
	await surveyBuilderTester.test();
}
