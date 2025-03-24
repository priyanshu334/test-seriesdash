"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Comprehensive type definitions
interface Test {
  testName: string;
  totalMarks: number;
  obtainedMarks: number;
  subject: string;
  date: string;
}

interface StudentPaymentRecord {
  date: string;
  amount: number;
  method: 'Online' | 'Cash' | 'Cheque';
  receiptNumber: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface StudentDetails {
  name: string;
  testsGiven: number;
  amountPaid: number;
  tests: Test[];
  contactInfo: ContactInfo;
  paymentHistory: StudentPaymentRecord[];
  performanceMetrics: {
    averageScore: number;
    topSubject: string;
    weakestSubject: string;
  };
}

const StudentPage = () => {
  const params = useParams();
  const { id } = params as { id: keyof typeof students };

  const students: Record<string, StudentDetails> = {
    '1': {
      name: 'John Doe',
      testsGiven: 5,
      amountPaid: 500,
      contactInfo: {
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Learning Lane, Education City, ST 12345'
      },
      tests: [
        { 
          testName: 'Math Diagnostic', 
          totalMarks: 100, 
          obtainedMarks: 85, 
          subject: 'Mathematics',
          date: '2024-02-15'
        },
        { 
          testName: 'Science Comprehensive', 
          totalMarks: 100, 
          obtainedMarks: 90, 
          subject: 'Science',
          date: '2024-03-20'
        }
      ],
      paymentHistory: [
        {
          date: '2024-01-10',
          amount: 250,
          method: 'Online',
          receiptNumber: 'RCP-2024-001'
        },
        {
          date: '2024-02-15',
          amount: 250,
          method: 'Cash',
          receiptNumber: 'RCP-2024-002'
        }
      ],
      performanceMetrics: {
        averageScore: 87.5,
        topSubject: 'Science',
        weakestSubject: 'Mathematics'
      }
    },
    // ... other student records remain similar
  };

  const student = students[id];

  if (!student) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Student Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">The requested student record does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate performance metrics
  const calculatePerformance = (tests: Test[]) => {
    const totalScore = tests.reduce((sum, test) => sum + test.obtainedMarks, 0);
    const averageScore = totalScore / tests.length;
    const performanceGrade = 
      averageScore >= 90 ? 'Excellent' :
      averageScore >= 80 ? 'Very Good' :
      averageScore >= 70 ? 'Good' :
      averageScore >= 60 ? 'Average' : 'Needs Improvement';

    return { averageScore, performanceGrade };
  };

  const { averageScore, performanceGrade } = calculatePerformance(student.tests);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Profile</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Performance</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">{student.name}</h2>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {student.contactInfo.email}</p>
                  <p><strong>Phone:</strong> {student.contactInfo.phone}</p>
                  <p><strong>Address:</strong> {student.contactInfo.address}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="space-y-2">
                  <p><strong>Tests Completed:</strong> {student.testsGiven}</p>
                  <p><strong>Average Score:</strong> {averageScore.toFixed(2)}%</p>
                  <Badge 
                    variant={
                      performanceGrade === 'Excellent' ? 'default' :
                      performanceGrade === 'Very Good' ? 'secondary' :
                      performanceGrade === 'Good' ? 'outline' : 'destructive'
                    }
                  >
                    {performanceGrade}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.tests.map((test, index) => {
                    const percentage = (test.obtainedMarks / test.totalMarks) * 100;
                    return (
                      <TableRow key={index}>
                        <TableCell>{test.testName}</TableCell>
                        <TableCell>{test.subject}</TableCell>
                        <TableCell>{test.date}</TableCell>
                        <TableCell>
                          {test.obtainedMarks} / {test.totalMarks}
                        </TableCell>
                        <TableCell>
                          <Progress 
                            value={percentage} 
                            className="w-24"
                            indicatorColor={
                              percentage >= 90 ? 'bg-green-500' :
                              percentage >= 80 ? 'bg-blue-500' :
                              percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Receipt Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.method}</Badge>
                      </TableCell>
                      <TableCell>{payment.receiptNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-between items-center">
                <p><strong>Total Paid:</strong> ₹{student.amountPaid}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Request Invoice</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Generate Invoice</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to generate an invoice for {student.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Generate</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentPage;