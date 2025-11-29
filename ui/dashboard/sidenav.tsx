'use client'
import NavLinks from '@/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { getUser, logout } from '@/actions/auth';
import routeraction from 'next/navigation';

export default function SideNav() {
const router = routeraction.useRouter();

  const handleLogout = () => {
    logout(); // Borra cookies
    router.push('/signup'); // Redirige al login
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
  className="
    mb-2 flex h-24 items-center justify-center rounded-md
    p-4 md:h-40
    bg-linear-to-r md:bg-linear-to-b
    from-[#fdfdfd] to-[#6969ec]
  "
>
</div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        <form action={handleLogout}>
          <button
            type="submit"
            className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
