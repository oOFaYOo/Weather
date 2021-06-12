const http = require("http");
const fs = require("fs");

let server = new http.Server();

// server.listen(80, "127.0.0.1");
server.listen(process.env.PORT ? process.env.PORT : 80);

server.on("request", function (req, res) {
    if(req.method === "GET" && req.url === "/"){
        res.setHeader("Content-Type", "text/html");
        let stream = fs.createReadStream("mainPage.html");
        stream.pipe(res);
        stream.on("end", ()=> res.end());
        return;
    }

    if (req.url.split(".")[req.url.split(".").length - 1] === "js") {
        res.setHeader('Content-Type', "text/javascript");
    } else {
        res.setHeader("Content-Type", req.headers.accept.split(",")[0]);
    }
    let stream = fs.createReadStream(`./${req.url}`);
    stream.pipe(res);
    stream.on("end", () => res.end());
    return;
});


