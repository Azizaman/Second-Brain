import React from "react";
import AddDocumentButton from "./AddDocumentButton";
import DocumentCard from "./DocumentCard";
import Leftbar from "./SideBar";

const Documents = () => {
  return (
    <div className="flex">
      <div>
        <Leftbar/>
      </div>
      <div className="ml-10 my-10">
        <div className="space-y-10 mb-10">
            <AddDocumentButton/>
        </div>
        <div>
          <DocumentCard/>
        </div>
      </div>
    </div>
  );
};

export default Documents;
