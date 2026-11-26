const express = require("express");
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) => res.render("page", { title:"Home", message:"Welcome to our Express website." }));
app.get("/about", (req,res) => res.render("page", { title:"About", message:"This website demonstrates Express routes and EJS." }));
app.get("/contact", (req,res) => res.render("page", { title:"Contact", message:"Email: hello@example.com" }));
app.get("/login", (req,res) => res.render("login", { message:"" }));
app.post("/login", (req,res) => {
  const { email } = req.body;
  res.render("page", { title:"Login submitted", message:`Form received for ${email}. This is a demo; no password is stored.` });
});

// GET Route - Display Registration Form
app.get("/register", (req, res) => {
    res.render("register", { message: "" });
});


// POST Route - Handle Registration Form
app.post("/register", (req, res) => {

    const {
        name,
        email,
        phone,
        course,
        password,
        confirmPassword
    } = req.body;

    // Check whether all fields are filled
    if (!name || !email || !phone || !course ||
        !password || !confirmPassword) {

        return res.status(400).render("register", {
            message: "Please fill in all the fields."
        });
    }

    // Check phone number
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).render("register", {
            message: "Please enter a valid 10-digit phone number."
        });
    }

    // Check password length
    if (password.length < 6) {
        return res.status(400).render("register", {
            message: "Password must contain at least 6 characters."
        });
    }

    // Check whether passwords match
    if (password !== confirmPassword) {
        return res.status(400).render("register", {
            message: "Passwords do not match!"
        });
    }

    // Display successful registration message
    res.render("page", {
        title: "Registration Successful",
        message: `Welcome to CampusConnect, ${name}! Your registration form was submitted successfully.`
    });

});


app.listen(3002, () => console.log("Express Routing: http://localhost:3002"));
