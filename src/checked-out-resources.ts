const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
import { parse } from 'node-html-parser';

const llcoopUrl = (pathAndQuery: string) => "https://sam.llcoop.org" + pathAndQuery;

const getCheckedOutItems = async (cred: LLCoopCredentials) => {
  const url = llcoopUrl("/patroninfo");
  const fetch = require('fetch-cookie/node-fetch')(nodeFetch, new tough.CookieJar());
  const response = await fetch(url, { method: "POST", body: `code=${cred.barcode}&pin=${cred.pin}`, headers: {"Content-Type":"application/x-www-form-urlencoded"} });
  const text = await response.text();
  const match = /\/patroninfo\~S\d+\/\d+\/items/ig.exec(text);
  if (match) {
    const itemsUrl = llcoopUrl(match[0]);

    const itemsResponse = await fetch(itemsUrl);
    const root = parse(await itemsResponse.text());

    return (root as any).querySelectorAll("tr.patFuncEntry").map((row:any) => {
      const get = (clazz:string) : string => {
        const selector = row.querySelector(clazz);
        return selector ? selector.structuredText : null;
      };

      const renewed = get(".patFuncRenewCount");

      return {
        who: cred.name,
        title: get(".patFuncTitleMain"),
        status: get(".patFuncStatus").replace(renewed, "").replace(/(\d\d-\d\d)-(\d\d)/, "20$2-$1").trim(),
        renewed,
      };
    });
  }
  return [];
};

export const handler = async (event: any = {}) : Promise <any> => {
  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }

  const args = JSON.parse(event.body);
  const response = { results: new Array(args.credentials.length) };

  try {
    await Promise.all(
      args.credentials.map(async (cred: LLCoopCredentials, i: number) => {
        const x = await getCheckedOutItems(cred);
        response.results[i] = x;
      })
    );

    const flat = response.results.reduce((a,b) => a.concat(b), []);

    return { statusCode: 200, body: JSON.stringify({results:flat}) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify(err)};
  }
};

interface LLCoopCredentials {
  name: string;
  barcode: string;
  pin: string;
}