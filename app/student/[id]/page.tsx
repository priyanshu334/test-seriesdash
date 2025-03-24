"use client"
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StudentPage = () => {
  const params = useParams();
  const { id } = params as { id: keyof typeof students };

  const students = {
    '1': { name: 'John Doe', testsGiven: 5, amountPaid: 500, tests: [
      { testName: 'Math Test', totalMarks: 100, obtainedMarks: 85 },
      { testName: 'Science Test', totalMarks: 100, obtainedMarks: 90 },
    ] },
    '2': { name: 'Jane Smith', testsGiven: 3, amountPaid: 300, tests: [
      { testName: 'English Test', totalMarks: 100, obtainedMarks: 75 },
    ] },
    '3': { name: 'Alice Johnson', testsGiven: 7, amountPaid: 700, tests: [
      { testName: 'History Test', totalMarks: 100, obtainedMarks: 88 },
      { testName: 'Geography Test', totalMarks: 100, obtainedMarks: 92 },
    ] },
  };

  const student = students[id];

  if (!student) {
    return <div className="p-6 text-red-500">Student not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>
      <Card className="mb-6">
        <CardContent className="space-y-4">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Tests Given:</strong> {student.testsGiven}</p>
          <p><strong>Amount Paid:</strong> ₹{student.amountPaid}</p>
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold mb-4">Test Performance</h2>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Obtained Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.tests.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.testName}</TableCell>
                  <TableCell>{test.totalMarks}</TableCell>
                  <TableCell>{test.obtainedMarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPage;