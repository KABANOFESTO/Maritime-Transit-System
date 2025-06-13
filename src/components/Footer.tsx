'use client';

import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6">
        {/* Divider Line */}
        <div className="border-t border-gray-300"></div>
        
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 space-y-2 md:space-y-0">
          <div className="text-sm text-gray-900">
            <p>Optinet Limited registered in Africa</p>
            <p>Company number 0785206899</p>
          </div>
          <div className="text-sm text-gray-900 text-left md:text-right">
            <p>Copyright © Optinet</p>
            <p>All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}