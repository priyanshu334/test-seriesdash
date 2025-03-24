"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CalendarClock, CheckCircle, Clock, Search, BookOpen, Award, Calendar, ArrowRight } from 'lucide-react';

// Define types
type TestStatus = 'ongoing' | 'upcoming' | 'past';

interface TestSeries {
  id: number;
  name: string;
  status: TestStatus;
  subject: string;
  duration: string;
  questions: number;
  dueDate: string;
  progress: number;
  instructor: string;
  score?: string;
}

// Extended test series data with more details
const testSeries: TestSeries[] = [
  { 
    id: 1, 
    name: 'Math Test 1: Algebra Fundamentals', 
    status: 'ongoing', 
    subject: 'Mathematics',
    duration: '90 minutes',
    questions: 45,
    dueDate: 'Mar 28, 2025',
    progress: 65,
    instructor: 'Dr. Sarah Miller'
  },
  { 
    id: 2, 
    name: 'Science Test 1: Chemistry Basics', 
    status: 'upcoming', 
    subject: 'Science',
    duration: '75 minutes',
    questions: 30,
    dueDate: 'Apr 05, 2025',
    progress: 0,
    instructor: 'Prof. James Wilson'
  },
  { 
    id: 3, 
    name: 'History Test 1: Ancient Civilizations', 
    status: 'past', 
    subject: 'History',
    duration: '60 minutes',
    questions: 40,
    dueDate: 'Mar 15, 2025',
    progress: 100,
    score: '85/100',
    instructor: 'Dr. Emily Chen'
  },
  { 
    id: 4, 
    name: 'English Test 1: Literature Analysis', 
    status: 'ongoing', 
    subject: 'English',
    duration: '120 minutes',
    questions: 35,
    dueDate: 'Mar 30, 2025',
    progress: 20,
    instructor: 'Prof. Robert Brown'
  },
  { 
    id: 5, 
    name: 'Physics Test 1: Mechanics', 
    status: 'upcoming', 
    subject: 'Physics',
    duration: '90 minutes',
    questions: 25,
    dueDate: 'Apr 10, 2025',
    progress: 0,
    instructor: 'Dr. Alex Johnson'
  },
  { 
    id: 6, 
    name: 'Chemistry Test 1: Periodic Table', 
    status: 'past', 
    subject: 'Chemistry',
    duration: '60 minutes',
    questions: 50,
    dueDate: 'Mar 10, 2025',
    progress: 100,
    score: '92/100',
    instructor: 'Prof. Lisa Zhang'
  },
];

const TestSeriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter tests based on search term
  const filteredTests = testSeries.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge colors
  const getStatusBadge = (status: TestStatus) => {
    switch(status) {
      case 'ongoing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-purple-500 border-purple-200">Upcoming</Badge>;
      case 'past':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-500">Completed</Badge>;
      default:
        return null;
    }
  };

  // Get progress color based on status and completion
  const getProgressColor = (status: TestStatus, progress: number): string => {
    if (status === 'past') return 'bg-green-500';
    if (status === 'ongoing') return 'bg-blue-500';
    return 'bg-gray-200';
  };

  // Render individual test card with more details
  const renderTestCard = (test: TestSeries) => (
    <Card key={test.id} className="mb-4 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {getStatusBadge(test.status)}
              <span className="text-sm text-gray-500">{test.subject}</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900">{test.name}</h2>
          </div>
          {test.status === 'past' && test.score && 
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-700">{test.score}</span>
            </div>
          }
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {test.duration}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
            {test.questions} questions
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Due: {test.dueDate}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Award className="w-4 h-4 mr-2 text-gray-400" />
            {test.instructor}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">
              {test.status === 'ongoing' ? 'Progress' : 
               test.status === 'past' ? 'Completed' : 'Not Started'}
            </span>
            <span className="text-xs font-medium text-gray-700">{test.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(test.status, test.progress)}`}
              style={{ width: `${test.progress}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <Button 
          variant={test.status === 'past' ? 'outline' : 'default'} 
          className={`w-full ${test.status === 'past' ? 'border-gray-200 text-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {test.status === 'ongoing' ? 'Continue Test' : 
           test.status === 'upcoming' ? 'Start Test' : 'View Results'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Count tests by status
  const countByStatus = (status: TestStatus): number => 
    filteredTests.filter(test => test.status === status).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Series</h1>
          <p className="text-gray-500 mt-1">Track and manage your academic assessments</p>
        </div>
        
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tests..."
            className="pl-10 pr-4 py-2 border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">In Progress</p>
                <h3 className="text-3xl font-bold text-gray-900">{countByStatus('ongoing')}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarClock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Upcoming</p>
                <h3 className="text-3xl font-bold text-gray-900">{countByStatus('upcoming')}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Completed</p>
                <h3 className="text-3xl font-bold text-gray-900">{countByStatus('past')}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="ongoing">In Progress</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTests.length > 0 ? (
            filteredTests.map(renderTestCard)
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">No tests found. Try adjusting your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="ongoing" className="space-y-4">
          {filteredTests.filter(test => test.status === 'ongoing').length > 0 ? (
            filteredTests.filter(test => test.status === 'ongoing').map(renderTestCard)
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">No tests in progress.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredTests.filter(test => test.status === 'upcoming').length > 0 ? (
            filteredTests.filter(test => test.status === 'upcoming').map(renderTestCard)
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">No upcoming tests.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {filteredTests.filter(test => test.status === 'past').length > 0 ? (
            filteredTests.filter(test => test.status === 'past').map(renderTestCard)
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">No completed tests.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestSeriesPage;