import React from "react";
import AddDocumentButton from "./AddDocumentButton";
import DocumentCard from "./DocumentCard";
import AppBar from "./AppBar";
import Leftbar from "./SideBar";

const Documents = () => {
  return (
    <div>
      
      <div>
        
      </div>

      
      <div className="flex">
       
        <div className="w-56 fixed">
          <Leftbar />
        </div>

        
        <div className="ml-56 w-full">
          <div className="mt-10 ml-5">
          <AddDocumentButton />

          </div>
          <div>
          <DocumentCard />

          </div>
          
          
          
        </div>
      </div>
    </div>
  );
};

export default Documents;
