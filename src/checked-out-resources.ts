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

    var result : [] = (root as any).querySelectorAll("tr.patFuncEntry").map((row:any) => {
      const get = (clazz:string) : string => {
        const selector = row.querySelector(clazz);
        return selector ? selector.structuredText : null;
      };
      const getAtt = (clazz:string, att:string) : string => {
        const selector = row.querySelector(clazz);
        return selector && selector.attributes ? selector.attributes[att] : null;
      };

      const renewed = get(".patFuncRenewCount");

      const { title, acknowledgements } = splitTitleAndAcknowledgements(get(".patFuncTitleMain"));

      const status = get(".patFuncStatus").replace(renewed, "").replace(/(\d\d-\d\d)-(\d\d)/, "20$2-$1").trim();
      const dueMatch = /DUE\s+(\d{4}-\d{2}-\d{2})/.exec(status);
      const due = dueMatch ? dueMatch[1] : null;

      return {
        who: cred.name,
        title,
        acknowledgements,
        image: generateImageUrls(getAtt(".patFuncTitle a", "href")),
        status,
        due,
        renewed,
      };
    });

    result.sort((a:any, b:any) => a.due < b.due ? -1 : (a.due === b.due ? 0 : 1));

    return result;
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

function generateImageUrls(href : string) {
  if (href) {
    var matches = /\/record=([a-zA-Z0-9]+)~/.exec(href);
    if (matches) {
      return {
        thumb: llcoopUrl(`/bookjacket?recid=${matches[1]}&size=0`),
        normal: llcoopUrl(`/bookjacket?recid=${matches[1]}&size=1`),
      };
    }
  }
  return null;
}

function splitTitleAndAcknowledgements(s : string) {
  const slash = s.indexOf(" / ");
  if (slash >= 0) {
    return {
      title: s.substring(0, slash),
      acknowledgements: s.substring(slash + 3).split(" ; ")
    };
  }
  return { title: s };
}