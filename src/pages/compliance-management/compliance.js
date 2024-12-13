import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { OverlayPanel } from "primereact/overlaypanel";
import { type } from "@testing-library/user-event/dist/type";
import { InputText } from "primereact/inputtext";

const Compliance = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  const op = useRef(null);

  // State for filters
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const fetchedDocument = [
        {
          id: 1,
          name: "Sea Dreamer",
          type: "Flag State",
          issuingAuthority: "USCG",
          outcome: "Passed",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "InCompliance",
        },
        {
          id: 2,
          name: "Serenity",
          type: "ISM Code Audit",
          issuingAuthority: "MCA",
          outcome: "Passed with Observation",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "CompliancePending",
        },
        {
          id: 3,
          name: "Odyssey",
          type: "PSC",
          issuingAuthority: "Port State Control Officer",
          outcome: "Failed",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "InCompliance",
        },
        {
          id: 4,
          name: "Harmony",
          type: "MARPOL",
          issuingAuthority: "MCA",
          outcome: "Passed with Observation",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "NonCompliance",
        },
        {
          id: 5,
          name: "Harmony",
          type: "Compliance",
          issuingAuthority: "MCA",
          outcome: "Passed with Observation",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "NonCompliance",
        },
        {
          id: 6,
          name: "Sea Breeze",
          type: "Compliance",
          issuingAuthority: "MCA",
          outcome: "Passed with Obs..",
          date: "20/10/2024",
          nextDate: "30/10/2024",
          status: "CompliancePending",
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

    if (selectedOutcome) {
      filteredData = filteredData.filter(
        (vessel) => vessel.outcome === selectedOutcome
      );
    }
    if (selectedDate) {
      filteredData = filteredData.filter(
        (vessel) => vessel.date === selectedDate
      );
    }
    if (selectedStatus) {
      filteredData = filteredData.filter(
        (vessel) => vessel.status === selectedStatus
      );
    }

    setFilteredDocument(filteredData);
  }, [documents, selectedOutcome, selectedDate, selectedStatus]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Dropdown options
  const outcomes = [
    ...new Set(documents.map((document) => document.outcome)),
  ].map((outcome) => ({ name: outcome, value: outcome }));

  const dates = [...new Set(documents.map((document) => document.date))].map(
    (date) => ({ name: date, value: date })
  );

  const statuses = [...new Set(documents.map((document) => document.status))].map(
    (status) => ({ name: status, value: status })
  );

  const goToAddCompliancePage = () => {
    navigate("/compliance-management/compliance/new");
  };

  const statusStyles = {
    InCompliance: {
      backgroundColor: "#94E0ED",
      color: "#047F94",
    },
    CompliancePending: {
      backgroundColor: "#F59E0B",
      color: "#FFFFFF",
    },
    NonCompliance: {
      backgroundColor: "#3B82F6",
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
      >
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-text w-full"
          onClick={(e) => navigate(`/compliance-management/compliance/edit`)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-text w-full"
          onClick={() => console.log("Delete", rowData)}
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
          <h3>Compliance</h3>
          <p>list of all Compliance</p>
        </div>
        <div className="sub-header-right sub-header-big-desktop">
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>
          <Dropdown
            value={selectedOutcome}
            options={outcomes}
            onChange={(e) => setSelectedOutcome(e.value)}
            optionLabel="name"
            placeholder="Outcome"
            className="mr-3 "
          />
          <Dropdown
            value={selectedDate}
            options={dates}
            onChange={(e) => setSelectedDate(e.value)}
            optionLabel="name"
            placeholder="Date"
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
            label="Add Compliance"
            icon="pi pi-plus"
            onClick={goToAddCompliancePage}
            className="p-button-primary"
          />
        </div>
        <div className="sub-header-right sub-header-small-desktop ">
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>
          <Button
            label="Filters"
            className="mr-3"
            severity="secondary"
            outlined
            icon="pi pi-filter"
            iconPos="right" // This will place the icon to the right of the text
            onClick={(e) => op.current && op.current.toggle(e)} // Ensure `op.current` is not null
          />
          <OverlayPanel ref={op}>
            <div className="p-d-flex p-flex-column">
              <Dropdown
                value={selectedOutcome}
                options={outcomes}
                onChange={(e) => setSelectedOutcome(e.value)}
                optionLabel="name"
                placeholder="Outcome"
                className="mr-3 "
              />
              <Dropdown
                value={selectedDate}
                options={dates}
                onChange={(e) => setSelectedDate(e.value)}
                optionLabel="name"
                placeholder="Date"
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
          <Button
            label="Add Compliance"
            icon="pi pi-plus"
            onClick={goToAddCompliancePage}
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
            navigate(`/compliance-management/compliance/${e.data.id}`)
          }
          rowClassName="pointer-row"
        >
          <Column field="name" header="Vessel Name" />
          <Column field="type" header="Type" />
          <Column field="date" header="Date" />
          <Column field="issuingAuthority" header="Issuing Authority" />
          <Column field="outcome" header="Outcome" />
          <Column field="nextDate" header="Next Date" />
          <Column
            field="status"
            header="Status"
            body={(rowData) => {
              const styles =
                statusStyles[rowData.status] || statusStyles.Default;
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
          <Column
            body={loading ? skeletonTemplate : actionBodyTemplate}
            style={{ width: "10%" }}
          />
        </DataTable>
      </div>
    </>
  );
};

export default Compliance;
