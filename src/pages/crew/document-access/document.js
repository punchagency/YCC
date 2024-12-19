import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  // State for filters
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        {
          id: 1,
          name: "ISM Code Audit Report",
          category: "Manuals",
          associatedVessel: "Sea Dreamer",
          date: "25/10/2025",
          fileType: "pdf",
        },
        {
          id: 2,
          name: "Crew Certification (STCW)",
          category: "Schematics",
          associatedVessel: "The Black Pearl",
          date: "25/10/2025",
          fileType: "xls",
        },
        {
          id: 3,
          name: "MARPOL Compliance",
          category: "Safety Docs",
          associatedVessel: "Andiamo",
          date: "25/10/2025",
          fileType: "doc",
        },
        {
          id: 4,
          name: "Annual Financial Report",
          category: "Safety Docs",
          associatedVessel: "Andiamo",
          date: "25/10/2025",
          fileType: "pdf",
        },
        {
          id: 5,
          name: "MARPOL Compliance",
          category: "Safety Docs",
          associatedVessel: "Andiamo",
          date: "25/10/2025",
          fileType: "doc",
        },
      ];
      setDocuments(fetchedDocument);
      setFilteredDocument(fetchedDocument); // Initially, all vessels are displayed
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter logic
  const applyFilters = useCallback(() => {
    let filteredData = documents;

    if (selectedVessel) {
      filteredData = filteredData.filter(
        (document) => document.associatedVessel === selectedVessel
      );
    }
    if (selectedCategory) {
      filteredData = filteredData.filter(
        (document) => document.category === selectedCategory
      );
    }

    if (searchText.trim()) {
      filteredData = filteredData.filter((doc) =>
        Object.values(doc).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    setFilteredDocument(filteredData);
  }, [documents, selectedVessel, selectedCategory, searchText]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const categories = [
    ...new Set(documents.map((document) => document.category)),
  ].map((category) => ({ name: category, value: category }));

  const associatedVessels = [
    ...new Set(documents.map((document) => document.associatedVessel)),
  ].map((associatedVessel) => ({
    name: associatedVessel,
    value: associatedVessel,
  }));

  const op = useRef(null);

  const fileTypeBodyTemplate = (rowData) => {
    const fileIcons = {
      pdf: "pi pi-file-pdf text-red-500",
      xls: "pi pi-file-excel text-green-500",
      doc: "pi pi-file-word text-blue-500",
    };

    return <i className={`${fileIcons[rowData.fileType]} text-lg`}></i>;
  };

  const downloadButtonTemplate = () => {
    return (
      <Button
        icon="pi pi-download"
        className="p-button-rounded p-button-text"
        tooltip="Download"
      />
    );
  };
  const goToAddDocumentPage = () => {
    navigate("/crew/task-schedule/document/new");
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left">
          <h3>Documents</h3>
          <p>list of all documents</p>
        </div>
        <div className="sub-header-right sub-header-big-desktop">
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>

          <Dropdown
            value={selectedVessel}
            options={associatedVessels}
            onChange={(e) => setSelectedVessel(e.value)}
            optionLabel="name"
            placeholder="Vessel"
            className="mr-3 "
          />
          <Dropdown
            value={selectedCategory}
            options={categories}
            onChange={(e) => setSelectedCategory(e.value)}
            optionLabel="name"
            placeholder="Category"
            className="mr-3"
          />
          <Button
            label="Add Documents"
            icon="pi pi-plus"
            onClick={goToAddDocumentPage}
            className="p-button-primary"
          />
        </div>

        <div className="sub-header-right sub-header-small-desktop ">
          <Button
            label="Filters"
            className="mr-3"
            severity="secondary"
            outlined
            icon="pi pi-chevron-down"
            iconPos="right" // This will place the icon to the right of the text
            onClick={(e) => op.current && op.current.toggle(e)} // Ensure `op.current` is not null
          />
          <OverlayPanel ref={op}>
            <div className="p-d-flex p-flex-column">
              <Dropdown
                value={selectedVessel}
                options={associatedVessels}
                onChange={(e) => setSelectedVessel(e.value)}
                optionLabel="name"
                placeholder="Vessel"
                className="mr-3 "
              />
              <Dropdown
                value={selectedCategory}
                options={categories}
                onChange={(e) => setSelectedCategory(e.value)}
                optionLabel="name"
                placeholder="Category"
                className="mr-3"
              />
            </div>
          </OverlayPanel>
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            className="p-calendar mr-3"
            placeholder="Date"
            style={{ maxWidth: "111px" }}
            showIcon
          />
          <Button
            label="Add Documents"
            icon="pi pi-plus"
            onClick={goToAddDocumentPage}
            className="p-button-primary"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <DataTable
          value={filteredDocument}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          onRowClick={(e) =>
            navigate(`/crew/task-schedule/document/${e.data.id}`)
          }
          rowClassName="pointer-row"
        >
          <Column field="name" header="Document Name" />
          <Column field="category" header="Category" />
          <Column field="associatedVessel" header="Associated vessel" />
          <Column field="date" header="Date Added" />
          <Column body={fileTypeBodyTemplate} header="File Type" />
          <Column body={downloadButtonTemplate} />
        </DataTable>
      </div>
    </>
  );
};

export default Document;
