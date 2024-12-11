import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import LeftMenu from '../../components/menu';
import AdminHeader from '../../components/header';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import PDFIcon from '../../assets/images/pdf.svg';


const EditDocument = () => {

  const [documentName, setDocumentName] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [associatedVessel, setAssociatedVessel] = useState(null);
  const [issueDate, setIssueDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [uploadDate, setUploadDate] = useState(null);
  const [issuingAuthority, setIssuingAuthority] = useState(null);
  const [renewalDate, setRenewalDate] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const currentDate = new Date().toLocaleDateString("en-US");

  const navigate = useNavigate()

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newUploadedFiles = files.map((file) => ({
      name: file.name,
      type: file.type || '',
      url: URL.createObjectURL(file), // Create a temporary URL for images
    }));

    // Update state with selected files
    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
  };

  // Remove a file from the uploaded list
  const removeFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };
  const [uploadedFile] = useState([
    {
      name: 'Crew Certification (STCW)',
      type: 'application/pdf',
      url: 'path/to/example.pdf',
    }
  ]); 
  const downloadAllFiles = () => {
    uploadedFile.forEach((file) => {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    });
  };

  const documentNames = [
    { name: "Crew Certification (STCW)" },
    { name: "MARPOL Compliance" }
  ];

  const documentTypes = [
    { name: "Crew Certification" },
    { name: "Maintenance" }
  ];

  const associateVessels = [
    { name: "The Black Pearl" },
    { name: "Sea Dreamer" }
  ];

  const authorities = [
    { name: "Flag State Authority" },
    { name: "USCG" }
  ]

  const goDocumentPage = () => {
    navigate("/document-management/documents");
  };




  return (
    <main className="flex h-screen page">
      <LeftMenu role="Captain/Manager" />
      <div className="w-full right-panel-component">
        <AdminHeader />
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/document-management/documents">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Crew Certification (STCW)</h3>
              <p>All informations are below</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              label="Cancel"
              icon="pi pi-times-circle"
              severity="secondary"
              outlined
              className="p-button-secondary mr-3"
            />
            <Button
              onClick={goDocumentPage}
              label="Save Changes"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
          </div>
        </div>
        <div className='card-wrapper-gap'>
          <div className="card">
            <div className="card-wraper">
              <div className="form-container">
                <h5>Document Details</h5>
                <form>
                  <div className="grid">
                    <div className="col-4">
                      <label htmlFor="documentName">Document Name</label>
                      <Dropdown
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.value)}
                        options={documentNames}
                        optionLabel="name"
                        placeholder={documentNames.length > 0 ? documentNames[0].name : "Select"}
                        className="w-full mt-2"
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="documentType">Document Type</label>
                      <Dropdown
                        id="documentType"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.value)}
                        options={documentTypes}
                        optionLabel="name"
                        placeholder={documentTypes.length > 0 ? documentTypes[0].name : "Select"}
                        className="w-full mt-2"
                      />
                    </div>


                    <div className="col-4">
                      <label htmlFor="documeassociatedVesselntName">Associated vessel</label>
                      <Dropdown
                        id="associatedVessel"
                        value={associatedVessel}
                        onChange={(e) => setAssociatedVessel(e.value)}
                        options={associateVessels}
                        optionLabel="name"
                        placeholder={associateVessels.length > 0 ? associateVessels[0].name : "Select"}
                        className="w-full mt-2"
                      />
                    </div>

                    <div className="col-4">
                      <label htmlFor="issueDate">Issue Date</label>
                      <Calendar
                        id="issueDate"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.value)}
                        showIcon
                        placeholder={currentDate}
                        className="w-full mt-2 p-input-calender"
                      />
                    </div>

                    <div className="col-4">
                      <label htmlFor="issuexpiryDateDate">Expiry Date</label>
                      <Calendar
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.value)}
                        showIcon
                        placeholder={currentDate}
                        className="w-full mt-2 p-input-calender"
                      />
                    </div>

                    <div className="col-4">
                      <label htmlFor="uploadDate">Upload Date</label>
                      <Calendar
                        id="uploadDate"
                        value={uploadDate}
                        onChange={(e) => setUploadDate(e.value)}
                        showIcon
                        placeholder={currentDate}
                        className="w-full mt-2 p-input-calender"
                      />
                    </div>

                    <div className="col-6">
                      <label htmlFor="issuingAuthority">Associated vessel</label>
                      <Dropdown
                        id="issuingAuthority"
                        value={issuingAuthority}
                        onChange={(e) => setIssuingAuthority(e.value)}
                        options={authorities}
                        optionLabel="name"
                        placeholder={authorities.length > 0 ? authorities[0].name : "Select"}
                        className="w-full mt-2"
                      />
                    </div>

                    <div className="col-6">
                      <label htmlFor="renewalDate">Next Renewal</label>
                      <Calendar
                        id="renewalDate"
                        value={renewalDate}
                        onChange={(e) => setRenewalDate(e.value)}
                        showIcon
                        placeholder={currentDate}
                        className="w-full mt-2 p-input-calender"
                      />
                    </div>

                    <div className="col-6 flex">
                      <div className="p-grid p-dir-col p-mt-3">
                        {uploadedFile.map((file, index) => {
                          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

                          return (
                            <div key={index} className="p-col-12 p-md-6 p-lg-4 p-d-flex p-ai-center p-jc-between">
                              <div className="p-d-flex p-ai-center flex">
                                {isPdf ? (
                                  <>
                                   
                                    <img src={PDFIcon} className="file-icon mr-2" />
                                    <span className="flex align-items-center">{file.name}</span>
                                  </>
                                ) : (
                                  <img src={file.url} alt={file.name} className="file-icon p-mr-2" style={{ width: '50px', height: '50px' }} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-d-flex p-jc-end">
                      <Button
                        icon="pi pi-download"
                        label="Download"
                        className="p-button-outlined p-button-sm p-mt-3 ml-6 border-blue-300"
                        onClick={downloadAllFiles}
                      />
                    </div>
                    </div>

                    <div className="upload-container">
                      <div className="flex align-content-center gap-4 mt-3">
                        <label htmlFor="file-upload" className="custom-upload-button">
                          <i className="pi pi-upload mr-2"></i>Upload
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.gif"
                          className="file-upload-input"
                          onChange={handleFileSelect}
                        />
                      </div>
                      <label htmlFor="uploadDocuments" className="mt-2 font-semibold text-lg">
                        Select Files to Upload
                      </label>
                      <label htmlFor="uploadDocuments" className="mt-2">
                        or Drag and Drop, Copy and Paste Files
                      </label>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {uploadedFiles.map((file, index) => {
                          const isImage =
                            file.type.includes("image") ||
                            file.name.toLowerCase().endsWith(".jpg") ||
                            file.name.toLowerCase().endsWith(".jpeg") ||
                            file.name.toLowerCase().endsWith(".png") ||
                            file.name.toLowerCase().endsWith(".gif");

                          return (
                            <div key={index} className="file-item">
                              {isImage ? (
                                <img src={file.url} alt={file.name} className="file-icon" />
                              ) : (
                                <i className="pi pi-file-pdf file-icon"></i>
                              )}
                              <span
                                className="uploadfiles"
                                onClick={() => removeFile(file.name)}
                              >
                                <i className="pi pi-times"></i>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditDocument;
