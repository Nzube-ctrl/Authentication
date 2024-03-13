const http = require("http");
const fs = require("fs");

function findUser(username) {
  const userData = fs.readFileSync("./db.Json", "utf-8");
  const users = JSON.parse(userData);
  return users.find((user) => user.username === username);
}

function getBodyFromStream(req) {
  return new Promise((resolve, reject) => {
    const data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    req.on("end", () => {
      const body = Buffer.concat(data).toString();
      if (body) {
        resolve(JSON.parse(body));
        return;
      }
      resolve({});
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

function authenticate(req, res, next) {
  // const { username, password } = req.body;
  // const user = findUser(req.body.username);
  const { username, password } = req.headers;
  const user = findUser(req.headers.username);

  if (!user) {
    res.statusCode = 401;
    res.end("User not found");
    return;
  }

  if (user.username !== username || user.password !== password) {
    res.statusCode = 401;
    res.end("Invalid username or password");
    return;
  }
  next(req, res);
}

function getBooks(req, res) {
  res.setHeader("Content-type", "Application/json");
  res.end(JSON.stringify({ Books: [{ name: "Harry Potter" }] }));
}

function getAuthors(req, res) {
  res.setHeader("Content-type", "Application/json");
  res.end(JSON.stringify({ Author: [{ name: "J.K Rowling" }] }));
}

const server = http.createServer(async (req, res) => {
  try {
    const body = await getBodyFromStream(req);
    req.body = body;
    //Books Route
    if (req.url === "/books" && req.method === "GET") {
      authenticate(req, res, getBooks);
    } else if (req.url === "/books" && req.method === "POST") {
      authenticate(req, res, getBooks);
    } else if (req.url === "/books" && req.method === "PUT") {
      authenticate(req, res, getBooks);
    } else if (req.url === "/books" && req.method === "PATCH") {
      authenticate(req, res, getBooks);
    } else if (req.url === "/books" && req.method === "DELETE") {
      res.end("Book deleted");
    }
    //Authors Route
    if (req.url === "/authors" && req.method === "GET") {
      authenticate(req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "POST") {
      authenticate(req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "PUT") {
      authenticate(req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "PATCH") {
      authenticate(req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "DELETE") {
      res.end("Author deleted");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(error.message);
  }
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
