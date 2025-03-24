"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const CreateTestSeriesPage = () => {
  const [testTitle, setTestTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const questionsList = [
    { id: 1, question: 'What is React?' },
    { id: 2, question: 'What is Next.js?' },
    { id: 3, question: 'What is TypeScript?' },
  ];

  const handleQuestionSelection = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const payload = {
      testTitle,
      totalMarks,
      endTime,
      selectedQuestions,
    };
    console.log(payload);
    alert('Test Series Created!');
    setTestTitle('');
    setTotalMarks('');
    setEndTime('');
    setSelectedQuestions([]);
  };

  return (
    <div className="p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Test Series</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Test Title"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
          />
          <Input
            placeholder="Total Marks"
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />
          <Input
            placeholder="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <div>
            <h3 className="font-semibold mb-2">Select Questions:</h3>
            {questionsList.map((q) => (
              <div key={q.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  checked={selectedQuestions.includes(q.id)}
                  onCheckedChange={() => handleQuestionSelection(q.id)}
                />
                <span>{q.question}</span>
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} className="bg-green-500 text-white">Create Test Series</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTestSeriesPage;