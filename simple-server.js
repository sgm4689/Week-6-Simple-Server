/*
- For this demo,  we are jamming all of our web service logic into one file.
- Hopefully, this makes it easier to understand what all the JS is doing.
- However, DO NOT use this approach in Project 1!
- Instead, use the very nicely architected approach of multiple JS files that we have
- been doing in the HW assignments!

*/

const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

let jokesArray;

// request handlers
const handlerNotFound = (request,response) => {
    const statusCode = 404;
    response.writeHead(statusCode, {'content-type': 'text/html'});
    response.write('<html><body><h1>404 - Not Found!</h1></body></html>');//I is gud programmar
    response.end();
}

const handlerGetAllJokes = (request, response) => {
    const statusCode = 200;
    response.writeHead(statusCode, {'content-type': 'application/json', 'Access-Control-Allow-Origin':'*'});
    response.write(JSON.stringify(jokesArray));
    response.end();
}

const handlerGetRandomJokes = (request, response) => {
    const statusCode = 200;
    response.writeHead(statusCode, {'content-type': 'application/json', 'Access-Control-Allow-Origin':'*'});
    response.writeHead();
    response.write(JSON.stringify(jokesArray[Math.floor(Math.random() * jokesArray.length)]));
    response.end();
}


const urlStruct = {
  
    'GET' : {
        '/getAllJokes':handlerGetAllJokes,
        '/getRandomJokes':handlerGetRandomJokes
    },
    'POST' : {},
    'Head' : {},
    notFound: handlerNotFound
    
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const pathname = parsedUrl.pathname;
    const httpMethod = request.method;
    const params = query.parse(parsedUrl.query);
    
    console.log(`pathname = ${pathname}`);
    console.log(`httpMethod = ${httpMethod}`);
    console.log(`params = ${Object.keys(params)}`);
    
    if (urlStruct[httpMethod][pathname])
        urlStruct[httpMethod][pathname](request,response);
        
        else
            urlStruct.notFound(request,response);
}

// urlStruct

// onRequest


let init = () => {
	// load jokes
	const jokeFile = fs.readFileSync(`${__dirname}/jokes.json`);
    jokesArray = JSON.parse(jokeFile).jokes;
    console.log(`There are ${jokesArray.length} jokes`);
    
	// create server
	http.createServer(onRequest).listen(port);
	console.log(`Listening on 127.0.0.1: ${port}`);
}

init();
