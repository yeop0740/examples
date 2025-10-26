import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  // duration: '5s',
  iterations: 50,
};

export default function () {
  const res = http.post(
    'http://localhost:3000/post/v4',
    JSON.stringify({
      title: 'Hello,',
      contents: 'World!',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMmUzNmJkNi03NDI0LTQ0ODctYTgyZS05OTFjNGE5OTcyMzEiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzYxMzU3OTkyLCJleHAiOjE3NjEzNjE1OTJ9.LkNBmt75aDe6ZCvStSMqFm91X9MQcg3fRu6UgX2bcIg',
      },
    },
  );
  // console.log(res)

  check(res, {
    'is status 201': (r) => r.status === 201,
    // '401': (r) => r.status === 401,
  });
}
