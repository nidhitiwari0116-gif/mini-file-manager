          
         
const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require("os");

const publicPath = path.join(__dirname, "public");
const dataPath = path.join(__dirname, "data");

// Create data folder if it does not exist
fs.mkdirSync(dataPath, { recursive: true });

const server = http.createServer((req, res) => {
    // Serve HTML page
    if (req.method === "GET" && req.url === "/") {
        const filepath = path.join(publicPath, "index.html");

        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading HTML file");
            }

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.end(data);
        });
    }

    // Serve CSS
    else if (req.method === "GET" && req.url === "/style.css") {
        const filepath = path.join(publicPath, "style.css");

        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading CSS file");
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            res.end(data);
        });
    }

    // Serve JavaScript
    else if (req.method === "GET" && req.url === "/app.js") {
        const filepath = path.join(publicPath, "app.js");

        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading JavaScript file");
            }

            res.writeHead(200, {
                "Content-Type": "application/javascript"
            });
            res.end(data);
        });
    }

    // Create a new file
    else if (req.method === "POST" && req.url === "/api/createFile") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const fileData = JSON.parse(body);
                const filename = fileData.fileName;
                const filecontent = fileData.filecontent;

                // Validate filename
                if (
                    typeof filename !== "string" ||
                    !/^[a-zA-Z0-9_-][a-zA-Z0-9._-]*$/.test(filename) ||
                    filename === "." ||
                    filename === ".." ||
                    typeof filecontent !== "string"
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    return res.end(JSON.stringify({
                        message: "Please enter a valid filename and content"
                    }));
                }

                const filepath = path.join(dataPath, filename);

                fs.writeFile(filepath, filecontent, (err) => {
                    if (err) {
                        res.writeHead(500, {
                            "Content-Type": "application/json"
                        });
                        return res.end(JSON.stringify({
                            message: "Error creating file"
                        }));
                    }

                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "File created successfully"
                    }));
                });
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Invalid request data"
                }));
            }
        });
    }

    // Get list of files
    else if (req.method === "GET" && req.url === "/api/files") {
        fs.readdir(dataPath, (err, files) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify({
                    message: "Error reading files"
                }));
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({ files }));
        });
    }

    // Get system information
    else if (req.method === "GET" && req.url === "/api/systemInfo") {
        const systemInfo = {
            platform: os.platform(),
            architecture: os.arch(),
            hostname: os.hostname(),
            totalMemory: (os.totalmem() / (1024 ** 3)).toFixed(2) + " GB",
            freeMemory: (os.freemem() / (1024 ** 3)).toFixed(2) + " GB",
            uptime: (os.uptime() / 3600).toFixed(2) + " hours"
        };

        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(systemInfo));
    }

    // Handle unknown routes
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.end("404 - Page not found");
    }
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});
 
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          // //Load Node's HTTP module so we can create a server without express.
// const http = require('http');
// //Load the file system module for file operations.
// const fs = require('fs');
// //Load the path modules for safe file and folder paths.
// const path = require('path');
// // Load the operating system module for basic system information.
// const os = require('os');

// // keep user-created files inside tthe data folder 


// // create the HTTP server req containss the request; res sends the res 
// const server = http.createServer((req,res)=>{
//     //Serve index.htmlfor the home page.
//     if(req.method === 'GET' && req.url === '/')return serveFile(res,'index.html','text/html');
//         // Server CSS when the browser requests / style.css.
//         if (req.method === 'GET'&& req.url === '/style.css') return serveFile(res,'style.css','text/css');
//         // Serve browsee Javascript when the browser request /app.js.
//         if(req.method === 'GET' && req.url === '/app.js') return serveFile(res,'app.js','application/javascript');

//         if(req.method === 'POST' && req.url === '/api/ files'){
//             // read the JSON body first.
//             return readBody(req,(error,body)=>{
//                 // Reject malfound JSON.
//                 if(error) return sendJSON (res,400,{
//                     error: 'Invalid JSON.' });
//                     // extract the two values sent by the frontend.
//             })
//         }
// })
// if(req.method==="GET"&&req.url==="/style.css"){
//     const filepath=path.join(__dirname,"public","style.css");
//     fs.readFile(filepath,"utf8",(error,data)=>{
//         if(error){
//             res.end("Something went wrong in reading style.css file");
//         }
//         else{
//             res.setHeader({"content-type":"text/css"});
//             res.end(data);
//         }

//         if(req.method==="GET"&&req.url==="/app.js"){
//             const filepath=path.join(__dirname,"public","app.js");
//             fs.readFile(filepath,"utf8",(err,data)=>{
//                 if(err){
//                     res.end("Something went wrong is reading js file");
//                 }else{
//                     res.setHeader("content-type","application/javascript");
//                     res.end(data);
//                 }
//             });
//         }
//     })

// }
// // keep frontend files inside the public folder.
// // const PUBLIC_DIR=path.join(__dirname, 'public');

// // function serveFile(res, filename,contentType){
// //     // build the path to the requested frontend file.
// //     const filepath = path.join(PUBLIC_DIR,filename);
// //     // read the file from disk.
// //     fs.readFile
// // }

// // start listening for browser requests on port 3000.
// server.listen(3000,() => console.log('Mini File Manager: http://localhost:3000'));
