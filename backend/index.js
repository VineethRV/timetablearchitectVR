const express = require("express");
const auth = require("./lib/actions/auth.js");
const onboard = require("./lib/actions/onboarding.js");
const teacher = require("./lib/actions/teacher.js");
const room = require("./lib/actions/room.js");
const lab = require("./lib/actions/lab.js");
const elective = require("./lib/actions/electives.js");
const course = require("./lib/actions/course.js");
const cors = require("cors");
const { default: PrismaClientManager } = require("./lib/pgConnect.js");
const { statusCodes } = require("./lib/types/statusCodes.js");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");

const prisma = PrismaClientManager.getInstance().getPrismaClient();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//check authentication of user
app.post("/api/checkAuthentication", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const isAuthenticated = await auth.checkAuthentication(token);
    if (isAuthenticated) {
      res.status(200).json({ status: 200, message: "Authenticated" });
    } else {
      res.status(200).json({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
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

// Send verification email
app.post("/api/sendVerificationEmail", async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res
      .status(200)
      .json({ status: 400, message: "Username and email are required" });
  }

  try {
    const result = await auth.sendVerificationEmail(username, email);
    res.status(200).json({
      status: result ? 200 : 500,
      message: result ? "Email sent" : "Failed to send email",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Check if user exists
app.post("/api/checkUserExists", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(200).json({ status: 400, message: "Email is required" });
  }

  try {
    const exists = await auth.checkUserExists(email);
    res.status(200).json({
      status: 200,
      message: exists ? "User exists" : "User does not exist",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Change password
app.post("/api/changePassword", async (req, res) => {
  const { verificationToken, email, newPassword } = req.body;
  if (!verificationToken || !email || !newPassword) {
    return res.status(200).json({
      status: 400,
      message: "Verification token, email, and new password are required",
    });
  }

  try {
    const result = await auth.changePassword(
      verificationToken,
      email,
      newPassword
    );
    res.status(200).json({
      status: result.status,
      message:
        result.status === 200
          ? "Password changed"
          : "Failed to change password",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Verify OTP
app.post("/api/verifyOTP", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(200)
      .json({ status: 400, message: "Email and OTP are required" });
  }

  try {
    const result = await auth.verifyOTP(email, otp);
    res.status(200).json({ status: result.status, message: result.token });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Forget OTP
app.post("/api/forgetOTP", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(200).json({ status: 400, message: "Email is required" });
  }

  try {
    const result = await auth.forgetOTP(email);
    res.status(200).json({
      status: result.status,
      message: result.status === 200 ? "OTP sent" : "Failed to send OTP",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

// Verify email
app.post("/api/verifyEmail", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(200).json({ status: 400, message: "Token is required" });
  }

  try {
    const result = await auth.verifyEmail(token);
    res.status(200).json({
      status: result ? 200 : 500,
      message: result ? "Email verified" : "Failed to verify email",
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: "Server error" });
  }
});

//onboarding

app.post("/api/onboard", async (req, res) => {
  const { name, sections, teachers, students, depts_list } = req.body;

  // Validate request body
  if (!name || !sections || !teachers || !students || !depts_list) {
    return res.json({
      status: 400,
      message:
        "Name, number of sections, number of teachers, number of students, and department list are required",
    });
  }

  try {
    // Call the onboarding function
    const result = await onboard.onboarding(
      name,
      sections,
      teachers,
      students,
      depts_list
    );

    // Handle the response based on the result
    if (result.status === statusCodes.CREATED) {
      res.json({
        status: result.status,
        message: "Organization onboarded successfully",
      });
    } else {
      res.json({
        status: result.status,
        message: "Internal server error",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ status: 500, message: "Server error" });
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
});

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
  const { name, code, semester, department } = req.body;
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
    const result = await course.getCourses(token, parseInt(semester), department);
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

app.post("/request_access", async (req, res) => {
  const { invite_code, level } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const organisation = await prisma.organisation.findFirst({
      where: {
        invite_code,
      },
      select: {
        id: true,
      },
    });

    const { userId } = jwt.decode(token);

    const _ = prisma.accessRequest.findFirst({
      where: {
        userId,
        orgId: organisation.id,
      },
    });

    if (_) return { status: statusCodes.BAD_REQUEST };

    await prisma.accessRequest.create({
      data: {
        userId,
        orgId: organisation.id,
        level,
      },
    });

    return res.json({
      status: statusCodes.OK,
    });
  } catch (e) {
    return res.json({ status: statusCodes.INTERNAL_SERVER_ERROR });
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
