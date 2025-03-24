
"use client"
import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const router = useRouter();

  const students = [
    { id: '1', name: 'John Doe', testsGiven: 5, amountPaid: 500 },
    { id: '2', name: 'Jane Smith', testsGiven: 3, amountPaid: 300 },
    { id: '3', name: 'Alice Johnson', testsGiven: 7, amountPaid: 700 },
  ];

  const handleStudentClick = (id: string) => {
    router.push(`/student/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enrolled Students</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Tests Given</th>
            <th className="border border-gray-300 px-4 py-2">Amount Paid</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="text-center hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">{student.testsGiven}</td>
              <td className="border border-gray-300 px-4 py-2">{student.amountPaid}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleStudentClick(student.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
