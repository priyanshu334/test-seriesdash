"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Student interface for type safety
interface Student {
  id: string;
  name: string;
  testsGiven: number;
  amountPaid: number;
  email?: string;
  joinDate?: string;
}

const UsersPage: React.FC = () => {
  const router = useRouter();

  // Initial students data
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      testsGiven: 5, 
      amountPaid: 500,
      email: 'john.doe@example.com',
      joinDate: '2023-01-15'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      testsGiven: 3, 
      amountPaid: 300,
      email: 'jane.smith@example.com',
      joinDate: '2023-02-20'
    },
    { 
      id: '3', 
      name: 'Alice Johnson', 
      testsGiven: 7, 
      amountPaid: 700,
      email: 'alice.johnson@example.com',
      joinDate: '2023-03-10'
    },
  ]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle student detail navigation
  const handleStudentClick = (id: string) => {
    router.push(`/student/${id}`);
  };

  // Filtered and sorted students
  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        
        if (valueA === undefined || valueB === undefined) return 0;
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }
        
        return 0;
      });
  }, [students, searchTerm, sortBy, sortDirection]);

  // Sort column handler
  const handleSort = (column: keyof Student) => {
    if (sortBy === column) {
      // Toggle sort direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="w-full mt-10 mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-2xl">Enrolled Students</span>
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as keyof Student)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="testsGiven">Tests Given</SelectItem>
                <SelectItem value="amountPaid">Amount Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('name')} 
                className="cursor-pointer hover:bg-gray-100"
              >
                Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('testsGiven')} 
                className="cursor-pointer hover:bg-gray-100"
              >
                Tests Given {sortBy === 'testsGiven' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('amountPaid')} 
                className="cursor-pointer hover:bg-gray-100"
              >
                Amount Paid {sortBy === 'amountPaid' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.testsGiven}</TableCell>
                <TableCell>${student.amountPaid.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleStudentClick(student.id)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No students found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersPage;