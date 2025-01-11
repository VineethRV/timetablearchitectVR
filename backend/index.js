const express = require("express");
const auth = require("./lib/actions/auth.js");
const teacher = require("./lib/actions/teacher.js");
const room = require("./lib/actions/room.js");
const lab = require("./lib/actions/lab.js");
const elective = require("./lib/actions/electives.js");
const electiveF=require("./lib/functions/electives.js")
const course = require("./lib/actions/course.js");
const cors = require("cors");
const app = express();
const port = 3000;
const { adminRouter } = require("./routes/admin.js");
const { userRouter } = require("./routes/user.js");
const { authRouter } = require("./routes/auth.js");
const { orgRouter } = require("./routes/org.js");
const labF = require("./lib/functions/lab.js");
const { sendVerificationEmail } = require("./lib/emailutils.js");
const { leaderRouter } = require("./routes/leader.js");
const { chatRouter } = require('./routes/chatbot.js')
const { suggestTimetable, saveTimetable,getTimetable,recommendCourse } = require("./lib/functions/makeTimetable");
const panel=require('./lib/functions/admin')
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/org", orgRouter);
app.use("/api/leader",leaderRouter);
app.use('/api/chatbot',chatRouter)

//check authentication of user
app.post("/api/checkAuthentication", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const isAuthenticated = await auth.checkAuthentication(token);
    if (isAuthenticated) {
      res.json({ status: 200, message: "Authenticated" });
    } else {
      res.json({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    res.json({ status: 500, message: "Server error" });
  }
});

//login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(200)
      .json({ status: 400, message: "Email and password are required" });
  }

  try {
    const token = await auth.login(email, password);
    res.status(200).json({ status: token.status, message: token.token });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

//register user
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(200)
      .json({ status: 400, message: "Name, email and password are required" });
  }
  try {
    const token = await auth.register(name, email, password);
    await sendVerificationEmail(name, email);
    res.status(200).json({ status: token.status, message: token.token });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

//get user position
app.post("/api/getPosition", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await auth.getPosition(token);
    res.status(200).json({ status: result.status, message: result.user });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create a new teacher
app.post("/api/teachers", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const {
    name,
    initials,
    email,
    department,
    alternateDepartments,
    timetable,
    labtable,
  } = req.body;

  // Check if token or name is missing
  if (!token || !name) {
    return res
      .status(400)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    // Assuming teacher.createTeachers is a function that handles the teacher creation
    const result = await teacher.createTeachers(
      token,
      name,
      initials,
      email,
      department,
      alternateDepartments,
      timetable,
      labtable
    );
    res.status(200).json({ status: result.status, message: result.teacher });
  } catch (error) {
    console.error("Error creating teacher:", error); // Log the error for debugging
    res
      .status(500)
      .json({ status: 500, message: error.message || "Internal server error" });
  }
});

// Update an existing teacher
app.put("/api/teachers", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { originalName, originalDepartment, teacher: teacherData } = req.body;
  if (!token || !originalName || !teacherData) {
    return res.status(200).json({
      status: 400,
      message: "Token, original name, and teacher data are required",
    });
  }

  try {
    const result = await teacher.updateTeachers(
      token,
      originalName,
      originalDepartment,
      teacherData
    );
    res.status(200).json({ status: result.status, message: result.teacher });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create multiple teachers
app.post("/api/teachers/many", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, initials, email, department } = req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and names are required" });
  }

  try {
    const result = await teacher.createManyTeachers(
      token,
      name,
      initials,
      email,
      department
    );
    res.status(200).json({ status: result.status, message: result.teachers });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get list of teachers
app.get("/api/teachers", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }
  try {
    const result = await teacher.getTeachers(token);
    res.status(200).json({ status: result.status, message: result.teachers });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});3

// Peek a specific teacher
app.post("/api/teachers/peek", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, department } = req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    const result = await teacher.peekTeacher(token, name, department);
    res.status(200).json({ status: result.status, message: result.teacher });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Delete teachers
app.delete("/api/teachers", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { teachers: teachersToDelete } = req.body;
  if (!token || !teachersToDelete) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and teachers are required" });
  }

  try {
    const result = await teacher.deleteTeachers(token, teachersToDelete);
    res.status(200).json({
      status: result.status,
      message: "Teachers deleted successfully",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create a new room
app.post("/api/rooms", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, lab, timetable, department } = req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    const result = await room.createRoom(
      token,
      name,
      lab,
      timetable,
      department
    );
    res.status(200).json({ status: result.status, message: result.room });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create multiple rooms
app.post("/api/rooms/many", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, lab, department } = req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and names are required" });
  }

  try {
    const result = await room.createManyRoom(token, name, lab, department);
    res.status(200).json({ status: result.status, message: result.rooms });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Update an existing room
app.put("/api/rooms", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { originalName, originalDepartment, room: roomData } = req.body;
  if (!token || !originalName || !roomData) {
    return res.status(200).json({
      status: 400,
      message: "Token, original name, and room data are required",
    });
  }

  try {
    const result = await room.updateRoom(
      token,
      originalName,
      originalDepartment,
      roomData
    );
    res.status(200).json({ status: result.status, message: result.room });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get list of rooms
app.get("/api/rooms", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await room.getRooms(token);
    res.status(200).json({ status: result.status, message: result.rooms });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Peek a specific room
app.post("/api/rooms/peek", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, department } = req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    const result = await room.peekRoom(token, name, department);
    res.status(200).json({ status: result.status, message: result.room });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Delete rooms
app.delete("/api/rooms", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { rooms: roomsToDelete } = req.body;
  if (!token || !roomsToDelete) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and rooms are required" });
  }

  try {
    const result = await room.deleteRooms(token, roomsToDelete);
    res
      .status(200)
      .json({ status: result.status, message: "Rooms deleted successfully" });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});
// Create a new course
app.post("/api/courses", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, code, semester,bfactor,credits, department } = req.body
  if (!token || !name || !code) {
    return res
      .status(200)
      .json({ status: 400, message: "Token, name, and code are required" });
  }

  try {
    const result = await course.createCourse(
      token,
      name,
      code,
      credits,
      bfactor,
      semester,
      department
    );
    res.status(200).json({ status: result.status, message: result.course });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Delete a course
app.delete("/api/courses", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { courseCode, semester, department } = req.body;
  if (!token || !courseCode || semester === undefined) {
    return res.status(200).json({
      status: 400,
      message: "Token, course code, and semester are required",
    });
  }
  try {
    const result = await course.deleteCourse(
      token,
      courseCode,
      semester,
      department
    );
    res
      .status(200)
      .json({ status: result.status, message: "Course deleted successfully" });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Update an existing course
app.put("/api/courses", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const {
    originalName,
    originalDepartment,
    originalSemester,
    course: courseData,
  } = req.body;
  if (
    !token ||
    !originalName ||
    originalSemester === undefined ||
    !courseData
  ) {
    return res.status(200).json({
      status: 400,
      message:
        "Token, original name, original semester, and course data are required",
    });
  }
  try {
    const result = await course.updateCourse(
      token,
      originalName,
      originalDepartment,
      originalSemester,
      courseData
    );
    res
      .status(200)
      .json({ status: result.status, message: "Course updated successfully" });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create a new elective
app.post("/api/electives", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, courses, teachers, rooms, semester, timetable, department } =
    req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    const result = await elective.createElective(
      token,
      name,
      courses,
      teachers,
      rooms,
      semester,
      timetable,
      department
    );
    res.status(200).json({ status: result.status, message: result.elective });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Update an existing elective
app.put("/api/electives", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { originalName, originalDepartment, updatedElective } = req.body;
  if (!token || !originalName || !updatedElective) {
    return res.status(200).json({
      status: 400,
      message: "Token, original name, and updated elective data are required",
    });
  }

  try {
    const result = await elective.updateElective(
      token,
      originalName,
      originalDepartment,
      updatedElective
    );
    res.status(200).json({ status: result.status, message: result.elective });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Peek a specific elective
app.post("/api/electives/peek", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, semester, department } = req.body;
  console.log(token,name,semester)
  if (!token || !name || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token, name, and semester are required" });
  }

  try {
    const result = await elective.peekElective(
      token,
      name,
      semester,
      department
    );
    res.status(200).json({ status: result.status, message: result.elective });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get list of electives
app.get("/api/electives", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { semester, department } = req.query;
  if (!token || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and semester are required" });
  }

  try {
    const result = await elective.getElectives(
      token,
      parseInt(semester),
      department
    );
    res.status(200).json({ status: result.status, message: result.electives });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Delete an elective
app.delete("/api/electives", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token, name, and semester are required" });
  }

  try {
    const result = await elective.deleteElective(
      token,
      name,
      semester,
      department
    );
    res.status(200).json({
      status: result.status,
      message: "Elective deleted successfully",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Create a new lab
app.post("/api/labs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, semester, batches, teachers, rooms, timetables, department } =
    req.body;
  if (!token || !name) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and name are required" });
  }

  try {
    const result = await lab.createLab(
      token,
      name,
      semester,
      batches,
      teachers,
      rooms,
      timetables,
      department
    );
    res.status(200).json({ status: result.status, message: result.data });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Update an existing lab
app.put("/api/labs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const {
    originalName,
    originalSemester,
    lab: labData,
    originalDepartment,
  } = req.body;
  if (!token || !originalName || originalSemester === undefined || !labData) {
    return res.status(200).json({
      status: 400,
      message:
        "Token, original name, original semester, and lab data are required",
    });
  }

  try {
    const result = await lab.updateLab(
      token,
      originalName,
      originalSemester,
      labData,
      originalDepartment
    );
    res.status(200).json({ status: result.status, message: result.data });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Peek a specific lab
app.post("/api/labs/peek", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token, name, and semester are required" });
  }

  try {
    const result = await lab.peekLab(token, name, semester, department);
    res.status(200).json({ status: result.status, message: result.data });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get list of labs
app.get("/api/labs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { department, semester } = req.query;
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await lab.getLabs(
      token,
      department,
      semester ? parseInt(semester) : null
    );
    res.status(200).json({ status: result.status, message: result.data });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Delete labs
app.delete("/api/labs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { labs: labsToDelete } = req.body;
  if (!token || !labsToDelete) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and labs are required" });
  }

  try {
    const result = await lab.deleteLabs(token, labsToDelete);
    res
      .status(200)
      .json({ status: result.status, message: "Labs deleted successfully" });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get list of courses
app.get("/api/courses", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { semester, department } = req.query;
  if (!token || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and semester are required" });
  }

  try {
    const result = await course.getCourses(
      token,
      parseInt(semester),
      department
    );
    res.status(200).json({ status: result.status, message: result.courses });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Peek a specific course
app.post("/api/courses/peek", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token, name, and semester are required" });
  }

  try {
    const result = await course.peekCourse(token, name, semester, department);
    res.status(200).json({ status: result.status, message: result.course });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

app.post("/api/getLabRecommendation", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { courses, teachers, rooms,blocks } = req.body;
  if (!token || !courses || !teachers || !rooms) {
    return res.status(200).json({
      status: 400,
      message: "Token, courses, teachers, and rooms are required",
    });
  }
  try {
    const result = await labF.getRecommendations(token, {
      courses,
      teachers,
      rooms,
    },
    blocks);
    res
      .status(200)
      .json({ status: result.status, timetable: result.timetable });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});
app.post("/api/recommendLab", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { Lteachers, Lrooms, blocks } = req.body;
  console.log("token:",token,"Teachers: ",Lteachers,"Labs: ",Lrooms,blocks)
  if (!token || !Lteachers || !Lrooms) {
    return res.status(200).json({
      status: 400,
      message: "Token, Lteachers, and Lrooms are required",
    });
  }

  try {
    const result = await labF.recommendLab(token, Lteachers, Lrooms, blocks);
    res.status(200).json({ status: result.status, timetable: result.timetable });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});


app.get("/api/sections", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { semester } = req.query;
  if (!token || semester === undefined) {
    return res
      .status(200)
      .json({ status: 400, message: "Token and semester are required" });
  }
  try {
    const result = await getTimetable(
      token,
      parseInt(semester)
    );
    res.status(200).json({ status: result.status, message: result.section });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

app.post("/api/saveTimetable",async (req,res)=>{
  const token = req.headers.authorization?.split(" ")[1];
  const { name,batch,courses, teachers, rooms,electives,labs, semester, defaultRooms,timetable,roomTimetable } = req.body;
  if(!name||!batch||!courses||!teachers||!rooms||!semester||!timetable||!roomTimetable)
    return res.status(200).json({
      status: 400,
      message: "Token, name,batch,courses, teachers, rooms, semester and timetable  are required",
    });
    try {
      const result = await saveTimetable(token,name,batch,courses, teachers, rooms,electives,labs, semester, defaultRooms,timetable,roomTimetable);
      res.status(200).json({ status: result.status});
    } catch (error) {
      res.status(200).json({ status: 500, message: "Server error" });
    }
})

app.post("/api/suggestTimetable", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { blocks, courses, teachers, rooms, semester, preferredRooms } = req.body;
  console.log(blocks,courses,teachers,rooms,semester,preferredRooms)
  if (!token || !blocks || !courses || !rooms || !teachers  || semester === undefined) {
    return res.status(200).json({
      status: 400,
      message: "Token, blocks, courses, teachers, rooms, and semester are required",
    });
  }
  console.log(blocks, courses, teachers, rooms, semester, preferredRooms)
  try {
    const result = await suggestTimetable(token, blocks, courses, teachers, rooms, semester, preferredRooms);
    res.status(200).json({ status: result.status, returnVal: result.returnVal });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get teacher percentage
app.get("/api/teacherPercentage", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await panel.getTeacherPercentage(token);
    res.status(200).json({ status: result.status, percentage: result.percentage, rank: result.rank, score: result.score, department: result.department });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get room percentage
app.get("/api/roomPercentage", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await panel.getRoomPercentage(token);
    res.status(200).json({ status: result.status, percentage: result.percentage, rank: result.rank, score: result.score, department: result.department });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Get lab percentage
app.get("/api/labPercentage", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await panel.getLabPercentage(token);
    res.status(200).json({ status: result.status, percentage: result.percentage, rank: result.rank, score: result.score, department: result.department });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

app.post("/api/recommendCourse", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { teacher, room, blocks } = req.body;
  if (!token || !teacher || !blocks) {
    return res.status(200).json({
      status: 400,
      message: "Token, teacher, and blocks are required",
    });
  }
  try {
    const result = await recommendCourse(token, teacher, room, blocks);
    res.status(200).json({ status: result.status, timetable: result.timetable });
  } catch (error) {
    res.status(200).json({ status: 500, message: error });
  }
});


app.post("/api/getIntersection", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { teachers, rooms } = req.body;
  if (!token || !teachers || !rooms) {
    return res.status(200).json({
      status: 400,
      message: "Token, teachers, and rooms are required",
    });
  }

  try {
    const result = await electiveF.getIntersection(teachers, rooms);
    res.status(200).json({ status: result.status, intersection: result.intersection });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

app.get("/api/accessCode", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await auth.accessCode(token);
    res.status(200).json({ status: result.status, accessCode: result.accessCode });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});
app.get("/health", (_, res) => {
  return res.json({
    msg: "Server is healthy !!",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
