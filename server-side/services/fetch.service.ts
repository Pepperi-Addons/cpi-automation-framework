import fetch from "node-fetch";
import deepClone from 'lodash.clonedeep'

export default class FetchService
{
	async post(url: string, body?: any, headers?:{[key: string]: string}): Promise<any>
	{
		const bodyStr = JSON.stringify(body);
		const mergedHeaders = {
			...headers,
			"Content-Type": "application/json",
		}
		const fetchResult = await fetch(url, {
			method: "POST",
			body: bodyStr,
			headers: mergedHeaders,
		});

		const buff = await fetchResult.arrayBuffer().then(Buffer.from);

		try
		{
			return JSON.parse(buff.toString())
		}
		catch (err) 
		{
			throw new Error(`Failed to POST: ${err instanceof Error ? err.message : "Unknown error occurred."}`);
		}
	}

	async postEvent(url: string, body?: any, headers?:{[key: string]: string}): Promise<any>
	{
		const bodyCopy = deepClone(body);
		bodyCopy.EventData = JSON.stringify(bodyCopy.EventData);

		const postRes = await this.post(url, bodyCopy, headers);

		postRes.Value = JSON.parse(postRes.Value);

		return postRes;
	}
}