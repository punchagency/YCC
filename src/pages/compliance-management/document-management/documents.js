import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { OverlayPanel } from "primereact/overlaypanel";
import { type } from "@testing-library/user-event/dist/type";
import { InputText } from "primereact/inputtext";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const menuRef = useRef(null);
  // State for filters
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        {
          id: 1,
          name: "Crew Certification (STCW)",
          type: "Administrator",
          associatedVessel: "Sea Dreamer",
          issuingAuthority: "MCA",
          issueDate: "26/10/2024",
          expiryDate: "25/10/2025",
          status: "Valid",
        },
        {
          id: 2,
          name: "ISM Code Audit Report",
          type: "Crew Certification",
          associatedVessel: "The Black Pearl",
          issuingAuthority: "USCG",
          issueDate: "26/10/2024",
          expiryDate: "25/9/2024",
          status: "Expired",
        },
        {
          id: 3,
          name: "MARPOL Compliance",
          type: "Compliance",
          associatedVessel: "Andiamo",
          issuingAuthority: "Flag State Authority",
          issueDate: "26/9/2024",
          expiryDate: "25/10/2025",
          status: "Expiring Soon",
        },
        {
          id: 4,
          name: "Annual Financial Report",
          type: "Compliance",
          associatedVessel: "Andiamo",
          issuingAuthority: "Flag State Authority",
          issueDate: "26/9/2024",
          expiryDate: "25/10/2025",
          status: "Active",
        },
        {
          id: 5,
          name: "MARPOL Compliance",
          type: "Compliance",
          associatedVessel: "Andiamo",
          issuingAuthority: "Flag State Authority",
          issueDate: "26/9/2024",
          expiryDate: "25/10/2025",
          status: "Valid",
        },
        {
          id: 6,
          name: "ISM Code Audit Report",
          type: "Administrator",
          associatedVessel: "Sea Dreamer",
          issuingAuthority: "MCA",
          issueDate: "26/9/2024",
          expiryDate: "25/10/2025",
          status: "Active",
        },
        {
          id: 7,
          name: "Engine Maintenance Report",
          type: "Maintenance",
          associatedVessel: "Serenity",
          issuingAuthority: "Internal",
          issueDate: "18/10/2024",
          expiryDate: "30/10/2026",
          status: "Valid",
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

    if (selectedAuthority) {
      filteredData = filteredData.filter(
        (document) => document.issuingAuthority === selectedAuthority
      );
    }
    if (selectedDocumentType) {
      filteredData = filteredData.filter(
        (document) => document.type === selectedDocumentType
      );
    }
    if (selectedStatus) {
      filteredData = filteredData.filter(
        (vessel) => vessel.status === selectedStatus
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
  }, [
    documents,
    selectedAuthority,
    selectedDocumentType,
    selectedStatus,
    searchText,
  ]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const issueAuthorities = [
    ...new Set(documents.map((document) => document.issuingAuthority)),
  ].map((issueAuthority) => ({ name: issueAuthority, value: issueAuthority }));

  const types = [...new Set(documents.map((vessel) => vessel.type))].map(
    (type) => ({ name: type, value: type })
  );

  const statuses = [...new Set(documents.map((vessel) => vessel.status))].map(
    (status) => ({ name: status, value: status })
  );

  const op = useRef(null);

  const goToAddDocumentPage = () => {
    navigate("/document-management/documents/new");
  };

  const statusStyles = {
    Active: {
      backgroundColor: "#CAF1D8",
      color: "#188A42",
    },
    Valid: {
      backgroundColor: "#CAF1D8",
      color: "#188A42",
    },
    Expired: {
      backgroundColor: "#EF4444",
      color: "#FFFFFF",
    },
    "Expiring Soon": {
      backgroundColor: "#F59E0B",
      color: "#FFFFFF",
    },
    Default: {
      backgroundColor: "#F0F0F0",
      color: "#000000",
    },
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text"
        onClick={(e) => menuRef.current.toggle(e)}
      />
      <OverlayPanel
        ref={menuRef}
        dismissable
        className="datatable-overlaypanel"
        hideOverlaysOnDocumentScrolling={false}
      >
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-text w-full"
          onClick={(e) => navigate(`/document-management/documents/edit`)}
        />
        <Button
          label="Update"
          icon="pi pi-list-check"
          className="p-button-text w-full"
          onClick={() => console.log("Update", rowData)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log("Delete", rowData)}
        />
        <Button
          label="Renew"
          icon="pi pi-refresh"
          className="p-button-text w-full"
          onClick={() => console.log("Renew", rowData)}
        />
      </OverlayPanel>
    </>
  );

  const skeletonTemplate = () => (
    <>
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="18%" className="mr-2" />
      <Skeleton width="10%" />
    </>
  );

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left">
          {/* Removed double title bar here */}
        </div>
        <div className="sub-header-right sub-header-big-desktop">
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>

          <Dropdown
            value={selectedAuthority}
            options={issueAuthorities}
            onChange={(e) => setSelectedAuthority(e.value)}
            optionLabel="name"
            placeholder="Issuing Authority"
            className="mr-3 "
          />
          <Dropdown
            value={type}
            options={types}
            onChange={(e) => setSelectedDocumentType(e.value)}
            optionLabel="name"
            placeholder="Document type"
            className="mr-3"
          />
          <Dropdown
            value={selectedStatus}
            options={statuses}
            onChange={(e) => setSelectedStatus(e.value)}
            optionLabel="name"
            placeholder="Status"
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
            icon="pi pi-filter"
            iconPos="right" // This will place the icon to the right of the text
            onClick={(e) => op.current && op.current.toggle(e)} // Ensure `op.current` is not null
          />
          <OverlayPanel ref={op} hideOverlaysOnDocumentScrolling={false}>
            <div className="p-d-flex p-flex-column">
              <Dropdown
                value={selectedAuthority}
                options={issueAuthorities}
                onChange={(e) => setSelectedAuthority(e.value)}
                optionLabel="name"
                placeholder="Issuing Authority"
                className="mr-3 "
              />
              <Dropdown
                value={type}
                options={types}
                onChange={(e) => setSelectedDocumentType(e.value)}
                optionLabel="name"
                placeholder="Document type"
                className="mr-3"
              />
              <Dropdown
                value={selectedStatus}
                options={statuses}
                onChange={(e) => setSelectedStatus(e.value)}
                optionLabel="name"
                placeholder="Status"
                className="mr-3"
              />
            </div>
          </OverlayPanel>
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>
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
            navigate(`/document-management/documents/${e.data.id}`)
          }
          rowClassName="pointer-row"
        >
          <Column field="name" header="Document Name" />
          <Column field="type" header="Type" />
          <Column field="associatedVessel" header="Associated vessel" />
          <Column field="issuingAuthority" header="Issuing Authority" />
          <Column field="issueDate" header="Issue Date" />
          <Column field="expiryDate" header="Expiry Date" />
          <Column
            field="status"
            header="Status"
            body={(rowData) => {
              const styles =
                statusStyles[rowData.status] || statusStyles.Default; // Fallback to Default if no match
              return (
                <span
                  style={{
                    ...styles,
                    fontWeight: "bold",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    display: "inline-block",
                  }}
                >
                  {rowData.status}
                </span>
              );
            }}
          />
        </DataTable>
      </div>
    </>
  );
};

export default Documents;
