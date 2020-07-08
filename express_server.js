const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const { signedCookies } = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieParser())
app.set("view engine", "ejs");

let shortURL = "";

const generateRandomString = () => {
  shortURL = Math.random().toString(36).substring(7);
  return shortURL;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['name']};
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies['name']
}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['name']};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
  console.log(urlDatabase);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params);
  
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = longURL;
  let templateVars = { username: req.cookies['name']
}

  res.redirect("/urls"), templateVars;
});


app.post("/login", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  res.cookie('name', username)
  console.log('Cookies: ', req.cookies)
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('name');
  res.redirect("/urls");
//for loop

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});