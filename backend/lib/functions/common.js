"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToTable = convertStringToTable;
exports.convertTableToString = convertTableToString;
exports.scoreTeachers = scoreTeachers;
exports.scoreRooms = scoreRooms;
var freeFactor = 0.1; //higher the number more continuous allocation is discouraged
function convertStringToTable(timetableString) {
    if (timetableString)
        return timetableString.split(";").map(function (row) { return row.split(","); });
    else
        return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;".split(";").map(function (row) { return row.split(","); });
}
function convertTableToString(timetable) {
    if (timetable)
        return timetable.map(function (row) { return row.join(","); }).join(";");
    return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;";
}
function scoreTeachers(teacherTab, teacherLab) {
    var scoredTable = [];
    var teacherTable = convertStringToTable(teacherTab);
    var teacherLabTT = convertStringToTable(teacherLab);
    for (var i = 0; i < teacherLabTT.length; i++) {
        for (var j = 0; j < teacherLabTT[i].length; j++) {
            if (teacherLabTT[i][j] !== "0") {
                teacherTable[i][j] = teacherLabTT[i][j];
            }
        }
    }
    for (var i = 0; i < teacherTable.length; i++) {
        var arr = [];
        for (var i_1 = 0; i_1 < teacherTable.length; i_1++) {
            arr.push(100);
        }
        scoredTable[i] = arr;
        for (var j = 0; j < teacherTable[i].length; j++) {
            if (teacherTable[i][j] != "") {
                scoredTable[i][j] = -1;
                for (var k = 0; k < j; k++) {
                    scoredTable[i][k] = scoredTable[i][k] * (Math.pow((1 - freeFactor), (teacherTable[i].length - (j - k))));
                }
                for (var k = j + 1; k < teacherTable[i].length; k++) {
                    scoredTable[i][k] = scoredTable[i][k] * (Math.pow((1 - freeFactor), (teacherTable[i].length - (k - j))));
                }
            }
        }
    }
    return scoredTable;
}
function scoreRooms(roomTab) {
    var scoredTable = [];
    var roomTable = convertStringToTable(roomTab);
    for (var i = 0; i < roomTable.length; i++) {
        var arr = [];
        for (var j = 0; j < roomTable[i].length; j++) {
            if (roomTable[i][j] !== "0") {
                arr.push(-1);
            }
            else {
                arr.push(0);
            }
        }
        scoredTable.push(arr);
    }
    return scoredTable;
}
