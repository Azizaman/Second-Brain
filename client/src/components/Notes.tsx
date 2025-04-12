import React from 'react'
import Showingnotes from './showing-notes'
import Leftbar from './SideBar'
import { AddnotesButton } from './AddnotesButton'

export function Notes() {
  return (
    <div className="w-full min-h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-auto">
        <Leftbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-12 lg:px-24 py-8 overflow-y-auto">
        <div className="space-y-10 mb-10">
          <AddnotesButton />
        </div>
        <Showingnotes />
      </div>
    </div>
  )
}

export default Notes;
