// import {default as axios} from "axios";
// import FormData from 'form-data';
// import assert from "assert";


// const getSession = () => {
//     const session = process.env.AOC_SESSION;
//     assert(!!session, `AOC_SESSION env variable missing`);
//     return session;
// }


// export const downloadInput = (day, year) => {
//     const session = getSession();
//     return axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
//         headers: {
//         cookie: `session=${session}`
//     }}).then(r => r.data);
// }

// export const attemptSubmitAnswer = (day, year, part = 1 | 2, answer) => {
//     const data = new FormData();
//     const session = getSession();
//     data.append('level', `${part}`);
//     data.append('answer', `${answer}`);

//     // https://adventofcode.com/2018/day/4/answer
//     return axios.post(`https://adventofcode.com/${year}/day/${day}/answer`, {
//         data: new URLSearchParams({
//             level: `${part}`,
//             answer: `${answer}`
//         }),
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             cookie: `session=${session}`
//         },
//     }).then(r => {
//         const response = r.data;
//         console.log(`ATTEMPT RESPONSE`, response);
//         const bad = response.includes(`hints on the`);
//         if (bad) {
//             return {success: false, response};
//         } else {
//             return {success: true, response};
//         }
//     })
// }
