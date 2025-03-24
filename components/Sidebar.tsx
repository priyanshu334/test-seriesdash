"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, ClipboardList, LayoutDashboard } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Student Details', href: '/users', icon: Home },
    { name: 'Add a Question', href: '/addQuestion', icon: PlusCircle },
    { name: 'Create a Test', href: '/testseries', icon: ClipboardList },
  ];

  return (
    <Card className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4 space-y-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </Card>
  );
};

export default Sidebar;
