import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import dotenv from "dotenv";
import assert from "node:assert";
import * as fs from "fs";

dotenv.config();

const client = new CloudWatchLogsClient({
  profile: process.env.AWS_PROFILE,
  region: process.env.AWS_REGION,
});

const input = {
  logGroupName: process.env.LOG_GROUP_NAME,
  startTime: 1736209488887,
  endTime: 1736209488888,
  filterPattern: "migrate",
  limit: 1,
};

const LOG_GROUP_NAME = process.env.LOG_GROUP_NAME;
const FILTER_PATTERN = "migrate";

function createInput(
  logGroupName: string,
  startTime: number,
  endTime: number,
  filterPattern: string,
  limit: number,
  nextToken?: string
) {
  return {
    logGroupName,
    startTime,
    endTime,
    filterPattern,
    limit,
    nextToken,
  };
}

async function getLogs(
  logGroupName: string,
  startTime: number,
  endTime: number,
  filterPattern: string,
  limit: number
) {
  const logs = new Array<string>();

  // 토큰이 존재한다면 반복한다. 처음 요청은 무조건 시작
  const firstInput = createInput(
    logGroupName,
    startTime,
    endTime,
    filterPattern,
    limit
  );

  const command = new FilterLogEventsCommand(input);
  const response = await client.send(command);
  const r =
    response.events === undefined
      ? []
      : response.events
          .map((event) => event.message)
          .filter((message) => message !== undefined);
  logs.push(...r);
  let i = 1;
  // 첫 번째 응답에 nextToken 이 undefined 이라면, 해당 응답만 return
  // 첫 번째 응답이 nextToken 이 undefined 가 아니라면, 첫 번째 응답의 nextToken 이 나올 때 까지 반복(만약 동일한 nextToken 이 나온다면, 해당 응답의 로그는 추가하지 않는다)

  let nextToken = response.nextToken;
  while (nextToken && i++ < 3) {
    const nextInput = createInput(
      firstInput.logGroupName,
      firstInput.startTime,
      firstInput.endTime,
      firstInput.filterPattern,
      firstInput.limit,
      nextToken
    );

    const command = new FilterLogEventsCommand(nextInput);
    const nextResponse = await client.send(command);
    const s =
      nextResponse.events === undefined
        ? []
        : nextResponse.events
            .map((event) => event.message)
            .filter((message) => message !== undefined);
    logs.push(...s);
    nextToken = nextResponse.nextToken;
  }

  return logs;
}

function getDateFormat() {
  const now = new Date(new Date().getTime() + 9 * 60 * 60);
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const date = now.getUTCDate().toString().padStart(2, "0");
  return `${year}${month}${date}`;
}

function getFileName() {
  return `goondori_${getDateFormat()}.log`;
}

assert(LOG_GROUP_NAME !== undefined);

function save(data: string[], filename: string) {
  const logs = data.join("\n");
  try {
    fs.writeFileSync(filename, logs + "\n", "utf-8");
    console.log(`${filename} saved.`);
  } catch (e) {
    console.log(e);
  }
}

getLogs(
  LOG_GROUP_NAME,
  new Date("2025-01-07T09:00:00.000Z").getTime(),
  new Date("2025-01-07T12:00:00.000Z").getTime(),
  FILTER_PATTERN,
  1000
)
  .then((result) => {
    const inputs = result.filter((log) => !log.includes("Error"));
    console.log(inputs[1]);
    const tokens = inputs[1].split(" ");
    for (let i = 0; i < tokens.length; i++) {
      //   if (i === 4) {
      //     console.log(JSON.parse(tokens[i]));
      //   } else {
      //     console.log(tokens[i]);
      //   }
      console.log(tokens[i]);
    }
    // save(result, getFileName());
  })
  .catch(console.log);

/**
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '29c50279-8df6-4d4f-8b46-6325220743d2',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  events: [
    {
      eventId: '38718765422940072550082292162140582943734640071714930831',
      ingestionTime: 1736209489181,
      logStreamName: '2025/01/07/[$LATEST]b330f65f19304078bc8194bb7e36ea51',
      message: '2025-01-07T00:24:48.887Z\t3fd3038e-756a-4ba7-a279-41bb89c41388\tINFO\t[2025-01-07T09:24:48.887+09]',
      timestamp: 1736209488887
    }
  ],
  nextToken: 'Bxkq6kVGFtq2y_MoigeqscPOdhXVbhiVtLoAmXb5jCq',
  searchStatistics: {
    approximateTotalLogStreamCount: 294044,
    completedLogStreamCount: 0
  },
  searchedLogStreams: []
}
 */
