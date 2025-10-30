'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/change-pathways', label: 'Theory of Change Explorer' },
    { href: '/framework-explorer', label: 'Strategic Elements' },
    { href: '/ecosystem-map', label: 'Ecosystem Map' },
  ];

  return (
    <div className="bg-white border-b" style={{ borderColor: '#E6DED0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex justify-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                  ${isActive ? 'text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
                style={{
                  backgroundColor: isActive ? '#4A7C7E' : undefined,
                  color: !isActive ? '#2B1810' : undefined,
                  border: !isActive ? '1px solid #E6DED0' : undefined
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
