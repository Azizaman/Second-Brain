
import React from 'react'
import Showingnotes from './showing-notes'
import Leftbar from './SideBar'
import {AddnotesButton} from './AddnotesButton'

export function Notes() {
  return (
    <div className='flex '>
        <div>
            <Leftbar/>

        </div>
        <div className='ml-10 my-10'>
          <div className='space-y-10 mb-10'>
          <AddnotesButton/>

          </div>
          <div>
          <Showingnotes/>

          </div>
          
            

        </div>
    </div>
  )
}

export default Notes