import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 50,
    // duration: '5s',
    iterations: 50,
}

export default function () {
    const res = http.post('http://localhost:3000/post/v3', JSON.stringify({
        "title": "Hello,",
        "contents": "World!"
    }), { headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMmUzNmJkNi03NDI0LTQ0ODctYTgyZS05OTFjNGE5OTcyMzEiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzYxMTQwMzU4LCJleHAiOjE3NjExNDM5NTh9.vn2x_42I9_2mtp9Z4an-oDZfGpBNp9l-vJg_7do1ywg'}});
    // console.log(res)

    check(res, {
        'is status 201': (r) => r.status === 201,
        '401': (r) => r.status === 401,
    });
}
