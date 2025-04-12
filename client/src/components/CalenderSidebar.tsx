import React from 'react'
import Leftbar from './SideBar'
import MyCalendar from './MyCalendar'

const CalenderSidebar = () => {
  return (
    <div>
        <div className='flex'>
            <div>
                <Leftbar/>
            </div>
            <div className=' w-full mr-6'>
                <MyCalendar/>
            </div>
        </div>
    </div>
  )
}

export default CalenderSidebar