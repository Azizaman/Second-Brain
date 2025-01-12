import React from 'react'
import AddDocumentButton from './AddDocumentButton'
import DocumentCard from './DocumentCard'
import AppBar from './AppBar'
import Leftbar from './SideBar'

const Documents = () => {
  return (
    <div>
      <div className=''>
      <AppBar />

      </div>
      
      <div className='flex   '>
        <div className='w-56'>
        <Leftbar/>

        </div>
      
      <div>
      <AddDocumentButton/>
      <DocumentCard/>

      </div>
      

      </div>
      
    </div>
  )
}

export default Documents