"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';

const CreateTestSeriesPage = () => {
  const [testTitle, setTestTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // New state for payment option
  const [isPaid, setIsPaid] = useState(false);
  const [testPrice, setTestPrice] = useState('');

  const questionsList = [
    { id: 1, question: 'What is React?', complexity: 'Easy', marks: 5 },
    { id: 2, question: 'What is Next.js?', complexity: 'Medium', marks: 10 },
    { id: 3, question: 'What is TypeScript?', complexity: 'Hard', marks: 15 },
    { id: 4, question: 'Explain React Hooks', complexity: 'Hard', marks: 15 },
    { id: 5, question: 'What are React Components?', complexity: 'Easy', marks: 5 },
  ];

  const handleQuestionSelection = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!testTitle.trim()) {
      alert('Please enter a test title');
      return;
    }
    if (!totalMarks || parseInt(totalMarks) <= 0) {
      alert('Please enter valid total marks');
      return;
    }
    if (!endTime) {
      alert('Please select an end time');
      return;
    }
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }
    
    // Additional validation for paid test
    if (isPaid && (!testPrice || parseFloat(testPrice) <= 0)) {
      alert('Please enter a valid price for the paid test');
      return;
    }

    // Open confirmation dialog
    setIsConfirmDialogOpen(true);
  };

  const confirmCreateTestSeries = () => {
    const payload = {
      testTitle,
      totalMarks: parseInt(totalMarks),
      endTime,
      selectedQuestions,
      isPaid,
      ...(isPaid && { testPrice: parseFloat(testPrice) })
    };

    console.log('Creating test series:', payload);

    // Reset form
    setTestTitle('');
    setTotalMarks('');
    setEndTime('');
    setSelectedQuestions([]);
    setIsPaid(false);
    setTestPrice('');
    setIsConfirmDialogOpen(false);
  };

  const calculateSelectedMarks = () => {
    return selectedQuestions.reduce((total, id) => {
      const question = questionsList.find(q => q.id === id);
      return total + (question ? question.marks : 0);
    }, 0);
  };

  return (
    <div className="p-6 mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-2xl text-blue-800">Create Test Series</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label>Test Title</Label>
            <Input
              placeholder="Enter test title"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Total Marks</Label>
            <Input
              placeholder="Enter total marks"
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              className="focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Payment Option Toggle */}
          <div className="flex items-center space-x-4 mb-4">
            <Label>Make Test Paid</Label>
            <Switch
              checked={isPaid}
              onCheckedChange={setIsPaid}
            />
          </div>

          {/* Conditional Price Input for Paid Tests */}
          {isPaid && (
            <div className="space-y-2 animate-fade-in">
              <Label>Test Price (₹)</Label>
              <Input
                placeholder="Enter test price"
                type="number"
                value={testPrice}
                onChange={(e) => setTestPrice(e.target.value)}
                className="focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-800">Select Questions:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {questionsList.map((q) => (
                <div 
                  key={q.id} 
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-all 
                    ${selectedQuestions.includes(q.id) 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'hover:bg-gray-50'}`}
                >
                  <Checkbox
                    id={`question-${q.id}`}
                    checked={selectedQuestions.includes(q.id)}
                    onCheckedChange={() => handleQuestionSelection(q.id)}
                  />
                  <div>
                    <Label 
                      htmlFor={`question-${q.id}`} 
                      className="cursor-pointer"
                    >
                      {q.question}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {q.complexity} | {q.marks} Marks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Selected Questions: {selectedQuestions.length} | 
              Total Marks: {calculateSelectedMarks()}
              {isPaid && ` | Price: ₹${testPrice}`}
            </p>
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Test Series
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Test Series Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this test series?
              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <p><strong>Test Title:</strong> {testTitle}</p>
                <p><strong>Total Marks:</strong> {totalMarks}</p>
                <p><strong>End Time:</strong> {endTime}</p>
                <p><strong>Selected Questions:</strong> {selectedQuestions.length}</p>
                <p><strong>Test Type:</strong> {isPaid ? 'Paid' : 'Free'}</p>
                {isPaid && <p><strong>Price:</strong> ₹{testPrice}</p>}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreateTestSeries}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateTestSeriesPage;