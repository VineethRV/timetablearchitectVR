"use strict";
let freeFactor = 0.1; //higher the number more continuous allocation is discouraged
function scoreTeachers(teacherTable) {
    let scoredTable = [];
    for (let i = 0; i < teacherTable.length; i++) {
        let arr = [];
        for (let i = 0; i < teacherTable.length; i++) {
            arr.push(100);
        }
        scoredTable[i] = arr;
        for (let j = 0; j < teacherTable[i].length; j++) {
            if (teacherTable[i][j] != "") {
                scoredTable[i][j] = -1;
                for (let k = 0; k < j; k++) {
                    scoredTable[i][k] = scoredTable[i][k] * ((1 - freeFactor) ** (teacherTable[i].length - (j - k)));
                }
                for (let k = j + 1; k < teacherTable[i].length; k++) {
                    scoredTable[i][k] = scoredTable[i][k] * ((1 - freeFactor) ** (teacherTable[i].length - (k - j)));
                }
            }
        }
    }
    return scoredTable;
}
