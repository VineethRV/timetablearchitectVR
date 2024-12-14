"use strict";
function scoreTeachers(teacherTable) {
    const scoredTable = [];
    for (const day of teacherTable) {
        const scoredDay = [];
        for (let i = 0; i < day.length; i++) {
            const period = day[i];
            let score = 0;
            if (period != "") {
                if (i == 0) {
                    if (i + 1 < day.length && day[i + 1] === "f") {
                        scoredDay.push(2);
                    }
                    else {
                    }
                }
            }
            else {
                scoredDay.push(-1);
            }
        }
    }
    return scoredTable;
}
