const express = require('express');
const auth = require('./lib/actions/auth.js');
const teacher = require('./lib/actions/teacher.js');
const room = require('./lib/actions/room.js');
const lab = require('./lib/actions/lab.js');
const elective = require('./lib/actions/electives.js');
const course = require('./lib/actions/course.js');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors({
  origin: "*"
}))

//check authentication of user
app.post('/api/checkAuthentication', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const isAuthenticated = await auth.checkAuthentication(token);
    if (isAuthenticated) {
      res.status(200).json({ message: 'Authenticated' });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const token = await auth.login(email, password);
    res.status(token.status).json({ token: token.token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//register user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    const token = await auth.register(name, email, password);
    res.status(token.status).json({ message: token.token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//get user position
app.post('/api/getPosition', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const result = await auth.getPosition(token);
    res.status(result.status).json({ user: result.user });
  } catch (error) {
    res.status(500).send(error.message);
  }
}); // checkAuthentication(localStorage.getItem('token') || "").then((verify) => {
//   if (verify) {
//     router.push('/dashboard');
//     toast.success("User is already logged in !!");
//   }

// setTimeout(() => setLoading(false), 1000);
// })

// Create a new teacher
app.post('/api/teachers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, initials, email, department, alternateDepartments, timetable, labtable } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and name are required' });
  }

  try {
    const result = await teacher.createTeachers(token, name, initials, email, department, alternateDepartments, timetable, labtable);
    res.status(result.status).json({ teacher: result.teacher });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an existing teacher
app.put('/api/teachers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { originalName, originalDepartment, teacher: teacherData } = req.body;
  if (!token || !originalName || !teacherData) {
    return res.status(400).json({ message: 'Token, original name, and teacher data are required' });
  }

  try {
    const result = await teacher.updateTeachers(token, originalName, originalDepartment, teacherData);
    res.status(result.status).json({ teacher: result.teacher });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create multiple teachers
app.post('/api/teachers/many', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, initials, email, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and names are required' });
  }

  try {
    const result = await teacher.createManyTeachers(token, name, initials, email, department);
    res.status(result.status).json({ teachers: result.teachers });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get list of teachers
app.get('/api/teachers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const result = await teacher.getTeachers(token);
    res.status(result.status).json({ teachers: result.teachers });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Peek a specific teacher
app.post('/api/teachers/peek', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and name are required' });
  }

  try {
    const result = await teacher.peekTeacher(token, name, department);
    res.status(result.status).json({ teacher: result.teacher });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete teachers
app.delete('/api/teachers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { teachers: teachersToDelete } = req.body;
  if (!token || !teachersToDelete) {
    return res.status(400).json({ message: 'Token and teachers are required' });
  }

  try {
    const result = await teacher.deleteTeachers(token, teachersToDelete);
    res.status(result.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new room
app.post('/api/rooms', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, lab, timetable, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and name are required' });
  }

  try {
    const result = await room.createRoom(token, name, lab, timetable, department);
    res.status(result.status).json({ room: result.room });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create multiple rooms
app.post('/api/rooms/many', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, lab, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and names are required' });
  }

  try {
    const result = await room.createManyRoom(token, name, lab, department);
    res.status(result.status).json({ rooms: result.rooms });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an existing room
app.put('/api/rooms', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { originalName, originalDepartment, room: roomData } = req.body;
  if (!token || !originalName || !roomData) {
    return res.status(400).json({ message: 'Token, original name, and room data are required' });
  }

  try {
    const result = await room.updateRoom(token, originalName, originalDepartment, roomData);
    res.status(result.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get list of rooms
app.get('/api/rooms', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const result = await room.getRooms(token);
    res.status(result.status).json({ rooms: result.rooms });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Peek a specific room
app.post('/api/rooms/peek', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and name are required' });
  }

  try {
    const result = await room.peekRoom(token, name, department);
    res.status(result.status).json({ room: result.room });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete rooms
app.delete('/api/rooms', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { rooms: roomsToDelete } = req.body;
  if (!token || !roomsToDelete) {
    return res.status(400).json({ message: 'Token and rooms are required' });
  }

  try {
    const result = await room.deleteRooms(token, roomsToDelete);
    res.status(result.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new course
app.post('/api/courses', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, code, semester, department } = req.body;
  if (!token || !name || !code) {
    return res.status(400).json({ message: 'Token, name, and code are required' });
  }

  try {
    const result = await course.createCourse(token, name, code, semester, department);
    res.status(result.status).json({ course: result.Course });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a course
app.delete('/api/courses', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { courseCode, semester, department } = req.body;
  if (!token || !courseCode || semester === undefined) {
    return res.status(400).json({ message: 'Token, course code, and semester are required' });
  }

  try {
    const result = await course.deleteCourse(token, courseCode, semester, department);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an existing course
app.put('/api/courses', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { originalName, originalDepartment, originalSemester, course: courseData } = req.body;
  if (!token || !originalName || originalSemester === undefined || !courseData) {
    return res.status(400).json({ message: 'Token, original name, original semester, and course data are required' });
  }

  try {
    const result = await course.updateCourse(token, originalName, originalDepartment, originalSemester, courseData);
    res.status(result.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Create a new elective
app.post('/api/electives', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, courses, teachers, rooms, semester, timetable, department } = req.body;
  if (!token || !name) {
    return res.status(400).json({ message: 'Token and name are required' });
  }

  try {
    const result = await elective.createElective(token, name, courses, teachers, rooms, semester, timetable, department);
    res.status(result.status).json({ elective: result.elective });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an existing elective
app.put('/api/electives', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { originalName, originalDepartment, updatedElective } = req.body;
  if (!token || !originalName || !updatedElective) {
    return res.status(400).json({ message: 'Token, original name, and updated elective data are required' });
  }

  try {
    const result = await elective.updateElective(token, originalName, originalDepartment, updatedElective);
    res.status(result.status).json({ elective: result.elective });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Peek a specific elective
app.post('/api/electives/peek', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res.status(400).json({ message: 'Token, name, and semester are required' });
  }

  try {
    const result = await elective.peekElective(token, name, semester, department);
    res.status(result.status).json({ elective: result.elective });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get list of electives
app.get('/api/electives', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { semester, department } = req.query;
  if (!token || semester === undefined) {
    return res.status(400).json({ message: 'Token and semester are required' });
  }

  try {
    const result = await elective.getElectives(token, parseInt(semester), department);
    res.status(result.status).json({ electives: result.electives });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an elective
app.delete('/api/electives', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res.status(400).json({ message: 'Token, name, and semester are required' });
  }

  try {
    const result = await elective.deleteElective(token, name, semester, department);
    res.status(result.status).json({ elective: result.elective });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new lab
// app.post('/api/labs', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   const { name, semester, batches, teachers, rooms, timetables, department } = req.body;
//   if (!token || !name) {
//     return res.status(400).json({
//       messag // checkAuthentication(localStorage.getItem('token') || "").then((verify) => {
//       //   if (verify) {
//       //     router.push('/dashboard');
//       //     toast.success("User is already logged in !!");
//       //   }

//       // setTimeout(() => setLoading(false), 1000);
//       // })e: 'Token and name are required' });
//     }

//     try {
//       const result = await lab.createLab(token, name, semester, batches, teachers, rooms, timetables, department);
//       res.status(result.status).json({ lab: result.data });
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });

// Update an existing lab
app.put('/api/labs', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { originalName, originalSemester, lab: labData, originalDepartment } = req.body;
  if (!token || !originalName || originalSemester === undefined || !labData) {
    return res.status(400).json({ message: 'Token, original name, original semester, and lab data are required' });
  }

  try {
    const result = await lab.updateLab(token, originalName, originalSemester, labData, originalDepartment);
    res.status(result.status).json({ lab: result.data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Peek a specific lab
app.post('/api/labs/peek', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, semester, department } = req.body;
  if (!token || !name || semester === undefined) {
    return res.status(400).json({ message: 'Token, name, and semester are required' });
  }

  try {
    const result = await lab.peekLab(token, name, semester, department);
    res.status(result.status).json({ lab: result.data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get list of labs
app.get('/api/labs', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { department, semester } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const result = await lab.getLabs(token, department, semester ? parseInt(semester) : null);
    res.status(result.status).json({ labs: result.data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete labs
app.delete('/api/labs', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { labs: labsToDelete } = req.body;
  if (!token || !labsToDelete) {
    return res.status(400).json({ message: 'Token and labs are required' });
  }

  try {
    const result = await lab.deleteLabs(token, labsToDelete);
    res.status(result.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
