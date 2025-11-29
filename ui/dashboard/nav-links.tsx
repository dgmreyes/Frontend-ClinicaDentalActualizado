'use client';

import { getUser } from '@/actions/auth';
import {
  UserGroupIcon,
  CalendarIcon,
  HomeIcon,
  ShoppingCartIcon,
  NumberedListIcon

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    staffOnly: false 
  },
  {
    name: 'Agenda',
    href: '/dashboard/agenda',
    icon: CalendarIcon,
    staffOnly: false
  },
  { 
    name: 'Historial de Citas', 
    href: '/dashboard/historial', 
    icon: NumberedListIcon,
    staffOnly: false 
  },
  { 
    name: 'Pacientes', 
    href: '/dashboard/pacientes', 
    icon: UserGroupIcon, 
    staffOnly: true 
  },
];

export default function NavLinks() {
    const [user, setUser] = useState<any>(null);
    const Pathname = usePathname();
    
    useEffect(() => {
        const userData = getUser();
        console.log('User data in NavLinks:', userData);
        setUser(userData);
    }, []);

    const roleName = user?.role?.name || '';
    const isStaff = roleName === 'Dentista' || roleName === 'Asistente';


    const visibleLinks = links.filter(link => {
      
        if (link.staffOnly && !isStaff) {
            return false;
        }

        return true;
    });

  return (
    <>

      {visibleLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium
             hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
             ${Pathname === link.href ? 'bg-sky-100 text-blue-600' : 'text-gray-600'}`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}