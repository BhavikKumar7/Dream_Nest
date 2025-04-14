// const express = require("express");
// const router = require("express").Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("uploading file now\n"+ req + "\n" + file);
//     cb(null, "public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });


// function updateJsonData(payload){
//   fs.readFile("./data.json", "utf8", (err,data)=>{
//     if(err){
//       console.log("error while updating data" ,err);
//       return;
//     }
//     try{
//       let det = JSON.parse(data);
//       console.log("fetched data" + det);
//       det.users.push(payload);

//       fs.writeFile("./data.json", JSON.stringify(det, null, 2), "utf8", (err)=>{
//         if(err){
//           console.log("error while writing the data");
//           return;
//         }
//         console.log("data written successfully");
//       })


//     }catch(err){
//       console.log("error while assigning data");
//     }
//   })
// }

// function getData(){
//   const data = fs.readFileSync("./data.json", "utf8");
//   return JSON.parse(data);
// }


// router.post("/register", upload.single("profileImage"), async (req, res) => {
//   try {

//     const { firstName, lastName, email, password } = req.body;
//     const profileImage = req.file;

//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     if (!profileImage) {
//       return res.status(400).send("No file uploaded");
//     }

//     const profileImagePath = `uploads/${profileImage.filename}`;

//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = {
//       id: Date.now().toString(),
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       profileImagePath,
//       tripList: [],
//       wishList: [],
//       propertyList: [],
//       reservationList: [],
//     };

//     updateJsonData(newUser);

//     res.status(200).json({ message: "User registered successfully!", user: newUser });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Registration failed!", error: err.message });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required!" });
//     }

//     const users = getData().users;

//     const user = users.find((user) => user.email === email);
//     if (!user) {
//       return res.status(409).json({ message: "User doesn't exist!" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid Credentials!" });
//     }

//     const token = jwt.sign({ id: user.id }, "secret");
//     const { password: _, ...userWithoutPassword } = user;

//     res.status(200).json({ token, user: userWithoutPassword });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("uploading file now\n" + req + "\n" + file);
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Helper Functions
function updateJsonData(payload) {
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.log("error while updating data", err);
      return;
    }
    try {
      let det = JSON.parse(data);
      console.log("fetched data" + det);
      det.users.push(payload);

      fs.writeFile("./data.json", JSON.stringify(det, null, 2), "utf8", (err) => {
        if (err) {
          console.log("error while writing the data");
          return;
        }
        console.log("data written successfully");
      });
    } catch (err) {
      console.log("error while assigning data");
    }
  });
}

function getData() {
  const data = fs.readFileSync("./data.json", "utf8");
  return JSON.parse(data);
}

// Middleware to check role (for protected routes)
function checkRole(role) {
  return (req, res, next) => {
    const { user } = req;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Permission Denied!" });
    }
    next();
  };
}

// Register Route
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const profileImage = req.file;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    const profileImagePath = `uploads/${profileImage.filename}`;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
      role,  // Store the role (user or host)
      tripList: [],
      wishList: [],
      propertyList: [],
      reservationList: [],
    };

    updateJsonData(newUser);

    res.status(200).json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed!", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const users = getData().users;

    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "secret");  // Include role in JWT
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
