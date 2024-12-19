import React, { useState } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from 'primereact/password';
import { FileUpload } from 'primereact/fileupload';

const AddUser = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [selectedJobRole, setSelectedJobRole] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [personalAddress, setPersonalAddress] = useState(null);
  const [professionalAddress, setProfessionalAddress] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
  const [selectedAllergies, setSelectedAllergies] = useState(null);

  const nationalities = [
    { name: "American", code: "US" },
    { name: "Indian", code: "IN" },
    { name: "British", code: "UK" },
    { name: "Australian", code: "AU" },
  ];

  const jobRoles = [
    { name: "Engineer", code: "SE" },
    { name: "Administrator", code: "PM" },
    { name: "Head of Department", code: "HR" },
    { name: "Captain", code: "DS" },
    { name: "Crew Manager", code: "DS" },
  ];

  const departments = [
    { name: "Engineering", code: "ENG" },
    { name: "Exterior", code: "EXt" },
    { name: "Interior", code: "Int" },
    { name: "Chef", code: "CHEF" },
  ];

  const experiences = [
    { name: "1-2 years", code: "1-2" },
    { name: "3-5 years", code: "3-5" },
    { name: "6-10 years", code: "6-10" },
    { name: "10+ years", code: "10+" },
  ];

  const certifications = [
    { name: "PMP", code: "PMP" },
    { name: "AWS Certified", code: "AWS" },
    { name: "Scrum Master", code: "SM" },
    { name: "Google Cloud Certified", code: "GCC" },
  ];

  const goUserPage = () => {
    navigate("/crew-management/crews");
  };

  const handleCancel = () => {
    navigate("/crew-management/crews"); // Navigate to the desired page
  };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFilePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFileClick = (e) => {
//     e.preventDefault(); 
//     document.getElementById("upload-cv").click(); 
//   };

  return (
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          <div className="sub-header-left sub-header-left-with-arrow">
            <div className="arrow">
              <Link to="/crew-management/crews">
                <i className="pi pi-angle-left"></i>
              </Link>
            </div>
            <div className="content">
              <h3>Create a New User</h3>
              <p>Enter the user detail and create an user</p>
            </div>
          </div>
          <div className="sub-header-right">
            <Button
              label="Cancel"
              icon="pi pi-times-circle"
              severity="secondary"
              outlined
              className="p-button-secondary mr-3"
              onClick={handleCancel} // Add onClick handler
            />
            <Button
              onClick={goUserPage}
              label="Save"
              icon="pi pi-save"
              className="p-button-primary"
              type="button"
            />
          </div>
        </div>
        <div className="card-wrapper-gap">
          <TabView className="v-tab">
            <TabPanel header="Personal Information">
              <div className="form-container">
                <h3>Personal Information</h3>
                <hr className="border-line"></hr>
                <form>
                    <div className="grid">
                      <div className="col-12">
                        <label htmlFor="name">Full Name</label>
                        <InputText
                          id="name"
                          placeholder="Enter full name"
                          className="w-full mt-2 p-inputtext p-component"
                        />
                      </div>
                      <div className="col-12 md:col-6">
                        <label htmlFor="dob">Date of Birth</label>
                        <Calendar
                          id="dob"
                          value={date}
                          onChange={(e) => setDate(e.value)}
                          showIcon
                          placeholder="Date of birth"
                          className="w-full mt-2 p-input-calender"
                        />
                      </div>
                      <div className="col-12 md:col-6">
                        <label htmlFor="nationality">Nationality</label>
                        <Dropdown
                          id="nationality"
                          value={selectedNationality}
                          onChange={(e) => setSelectedNationality(e.value)}
                          options={nationalities}
                          optionLabel="name"
                          placeholder="Select a nationality"
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="col-12 md:col-6">
                        <label htmlFor="phone">Phone</label>
                        <InputText
                          id="phone"
                          placeholder="Phone no"
                          className="w-full mt-2 p-inputtext p-component"
                        />
                      </div>
                      <div className="col-12 md:col-6">
                        <label htmlFor="phone">Email</label>
                        <InputText
                          id="email"
                          placeholder="Enter Email"
                          className="w-full mt-2 p-inputtext p-component"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="address">Address (optional)</label>
                        <InputTextarea
                          id="address"
                          value={personalAddress}
                          onChange={(e) => setPersonalAddress(e.target.value)}
                          rows={5}
                          className="w-full mt-2 p-inputtext p-component"
                          placeholder="Address"
                        />
                      </div>
                    </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel header="Professional Information">
              <div className="form-container">
                <h3>Professional Information</h3>
                <hr className="border-line"></hr>
                <form className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="job-role">Job Role</label>
                    <Dropdown
                      id="job-role"
                      value={selectedJobRole}
                      onChange={(e) => setSelectedJobRole(e.value)}
                      options={jobRoles}
                      optionLabel="name"
                      placeholder="Select a job role"
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="department">Department</label>
                    <Dropdown
                      id="department"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.value)}
                      options={departments}
                      optionLabel="name"
                      placeholder="Select a department"
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="experience">Years of Experience</label>
                    <Dropdown
                      id="experience"
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.value)}
                      options={experiences}
                      optionLabel="name"
                      placeholder="Select experience"
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="certifications">Certifications</label>
                    <Dropdown
                      id="certifications"
                      value={selectedCertification}
                      onChange={(e) => setSelectedCertification(e.value)}
                      options={certifications}
                      optionLabel="name"
                      placeholder="Select a certification"
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="address">Address (optional)</label>
                    <InputTextarea
                      id="address"
                      value={professionalAddress}
                      onChange={(e) => setProfessionalAddress(e.target.value)}
                      rows={5}
                      className="w-full mt-2 p-inputtext p-component"
                      placeholder="Address"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="upload-cv">Upload Documents’ (with the integration of an AI Agent these certificates would be selected and added to the profile)</label>
                    <div className="flex upload-cv-component">
                        {/* <div className="upload-cv-image">
                            {filePreview && (
                            <div className="mt-2">
                                <img
                                src={filePreview}
                                alt="File preview"
                                className="w-20 mr-3"
                                />
                            </div>
                            )}
                        </div>
                        <div className="custom-file-upload">
                            <input
                            id="upload-cv"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf, .docx"
                            hidden
                            />
                            <Button
                            label="Upload"
                            icon="pi pi-upload"
                            className="p-button-secondary mt-2"
                            onClick={handleFileClick}
                            />
                        </div> */}

                        <FileUpload mode="basic" name="demo[]"  accept=".pdf,.xls" url="/api/upload" maxFileSize={1000000} className="mt-2"/>
                    </div>
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel header="Medical Information">
              <div className="form-container">
                <h3>Medical Information</h3>
                <hr className="border-line"></hr>
                <form className="grid">
                  <div className="col-12">
                    <label htmlFor="allergies">Allergies</label>
                    <Dropdown
                      id="allergies"
                      value={selectedAllergies}
                      onChange={(e) => setSelectedAllergies(e.value)}
                      options={[
                        { name: "Yes", code: "yes" },
                        { name: "No", code: "no" },
                      ]}
                      optionLabel="name"
                      placeholder="Select Yes or No"
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="restrictions">Medical Restrictions</label>
                    <InputTextarea
                      id="restrictions"
                      value={personalAddress}
                      onChange={(e) => setPersonalAddress(e.target.value)}
                      rows={5}
                      className="w-full mt-2 p-inputtext p-component"
                      placeholder="Medical restrictions or details"
                    />
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel header="Emergency Contact">
              <div className="form-container">
                <h3>Emergency Contact</h3>
                <hr className="border-line"></hr>
                <form className="grid">
                  <div className="col-12">
                    <label htmlFor="name">Name</label>
                    <InputText
                      id="name"
                      placeholder="Enter name"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="relationship">Relationship</label>
                    <InputText
                      id="relationship"
                      placeholder="12 Years"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <InputText
                      id="contactNumber"
                      placeholder="STCW Basic Safety Training (BST)"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel header="Account Information">
              <div className="form-container">
                <h3>Account Information</h3>
                <hr className="border-line"></hr>
                <form className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="name">Username</label>
                    <InputText
                      id="Username"
                      placeholder="Enter Username"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <label htmlFor="relationship">Password</label>
                    <Password
                            id="password"
                            name="password"
                            feedback={false}
                            toggleMask
                            placeholder="Password"
                            required
                            className="w-full mt-2" 
                        />
                  </div>
                  <div className="col-12">
                  <label htmlFor="experience">Account Type</label>
                    <Dropdown
                      id="experience"
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.value)}
                      options={[
                        { name: "Admin", code: "admin" },
                        { name: "Dispatch Manager", code: "manager" },
                      ]}
                      optionLabel="name"
                      placeholder="Select account type"
                      className="w-full mt-2"
                    />
                  </div>
                </form>
              </div>
            </TabPanel>
          </TabView>
        </div>
    </>
  );
};

export default AddUser;
