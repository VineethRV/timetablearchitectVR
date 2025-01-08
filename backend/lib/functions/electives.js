"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeslots = exports.weekdays = void 0;
exports.getIntersection = getIntersection;
var common_1 = require("./common");
exports.weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
exports.timeslots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30",
];
function getIntersection(teachers, rooms) {
    var intersection = exports.weekdays.map(function () { return exports.timeslots.map(function () { return 0; }); });
    teachers.map(function (teacher) {
        var teacherScore = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
        intersection.map(function (row, i) {
            row.map(function (value, j) {
                if (teacherScore[i][j] < 0 || value < 0)
                    return -1;
                return value + teacherScore[i][j];
            });
        });
    });
    rooms.map(function (room) {
        var roomScore = (0, common_1.scoreRooms)(room.timetable);
        intersection.map(function (row, i) {
            return row.map(function (value, j) { return (roomScore[i][j] < 0 ? -1 : value); });
        });
    });
    return intersection;
}
