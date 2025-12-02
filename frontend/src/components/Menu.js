import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/cases/new',
      label: 'Add New Case',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      path: '#',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`bg-white shadow-lg h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      
      <nav className="py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            
            const MenuItem = item.path === '#' ? 'div' : Link;
            const itemProps = item.path === '#' ? {} : { to: item.path };
            
            return (
              <MenuItem
                key={item.label}
                {...itemProps}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${item.path === '#' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                  ${
                    active
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.label : ''}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
              </MenuItem>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Menu;

