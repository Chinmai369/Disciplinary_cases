import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = ({ isCollapsed: externalIsCollapsed, onCollapseChange }) => {
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;
  
  const handleCollapse = () => {
    const newState = !isCollapsed;
    if (onCollapseChange) {
      onCollapseChange(newState);
    } else {
      setInternalCollapsed(newState);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/cases/new',
      label: 'Add New Case',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      path: '#',
      label: 'Reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-gray-50 border-r border-gray-200 shadow-lg h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
      {/* Menu Header */}
      <div className="h-24 flex items-center border-b border-gray-300 bg-white px-4">
        <div className="flex items-center justify-between w-full">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <div className="w-5 h-0.5 bg-gray-600"></div>
                <div className="w-5 h-0.5 bg-gray-600"></div>
                <div className="w-5 h-0.5 bg-gray-600"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <p className="text-xs text-gray-500 mt-0.5">Navigation</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="flex flex-col gap-1">
                <div className="w-5 h-0.5 bg-gray-600"></div>
                <div className="w-5 h-0.5 bg-gray-600"></div>
                <div className="w-5 h-0.5 bg-gray-600"></div>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
              title="Collapse Menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={handleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all ml-auto"
              title="Expand Menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Search Section */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-b border-gray-300 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      )}
      
      {/* Menu Items */}
      <nav className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="space-y-0">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item, index) => {
            const active = isActive(item.path);
            
            const MenuItem = item.path === '#' ? 'div' : Link;
            const itemProps = item.path === '#' ? {} : { to: item.path };
            
            return (
              <div key={item.label} className="border-b border-gray-200">
                <MenuItem
                  {...itemProps}
                  className={`
                    group flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 relative
                    ${item.path === '#' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${
                      active
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className={`flex-shrink-0 transition-colors ${
                    active 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.path === '#' && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </>
                  )}
                </MenuItem>
              </div>
            );
          })) : (
            !isCollapsed && (
              <div className="px-4 py-8 text-center border-b border-gray-200">
                <p className="text-sm text-gray-500">No results found</p>
              </div>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Menu;

