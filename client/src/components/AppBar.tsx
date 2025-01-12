import React from 'react';
import LoginButton from './LoginButton';
import { ModeToggle } from './mode-toggle';

function AppBar() {
  return (
    <div className="border-b border-gray-300 dark:border-gray-600 border-[0.5px]">
      <div className="flex justify-between items-center py-8 px-6">
        {/* Title */}
        <div className="text-black dark:text-white font-bold text-xl">
          Second Brain
        </div>
        {/* Buttons */}
        <div className="space-x-8">
          <LoginButton />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default AppBar;
