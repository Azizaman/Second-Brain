import React from 'react'

import DisplayDiary from './DisplayDiary'
import Leftbar from './SideBar'

function Diary(){
  return (
    <div className='flex overflow-x-hidden'>
        <div>
            <Leftbar/>
        </div>
        
        <div>
            <DisplayDiary/>
        </div>
    </div>
  )
}

export default Diary;