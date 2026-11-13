export const studentName = "Rahul";

export const studentMarks = [85, 90, 78, 92];

export function calculateTotal(marks) {
    let total = 0;

    for (const mark of marks) {
        total = total + mark;
    }

    return total;
}