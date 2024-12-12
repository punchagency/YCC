import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/header";
import LeftMenu from "../../components/menu";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { useEffect, useRef, useState } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { OverlayPanel } from "primereact/overlaypanel";
import { Menu } from "primereact/menu";
import Pdf from "../../assets/images/pdf.svg";
import Csv from "../../assets/images/csv.svg";
import Xlsx from "../../assets/images/xls.svg";

export default function ReportDetails() {
  const [date, setDate] = useState(null);
  const menuRef = useRef(null);
  const menuRight = useRef(null);
  const op = useRef(null);
  const navigate = useNavigate();
  const { reportType } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick] = useState(true);
  const [loading, setLoading] = useState(true);
  const items = [
    {
      label: ".PDF",
      icon: <img src={Pdf} alt="PDF icon" />,
    },
    {
      label: ".CSV",
      icon: <img src={Csv} alt="CSV icon" />,
    },
    {
      label: ".XLSX",
      icon: <img src={Xlsx} alt="XLSX icon" />,
    },
  ];
  const reportData = {
    "document-compliance-report": {
      title: "Document Compliance Report",
    },
    "compliance-alert-report": {
      title: "Compliance Alert Report",
    },
    "maintenance-task-report": {
      title: "Maintenance Task Report",
    },
    "maintenance-schedule-report": {
      title: "Maintenance Schedule Report",
    },
    "vessel-profile-report": {
      title: "Vessel Profile Report",
    },
    "expense-report": {
      title: "Expense Report",
    },
    "invoice-summary-report": {
      title: "Invoice Summary Report",
    },
    "financial-overview": {
      title: "Financial Overview",
    },
  };

  const report = reportData[reportType];

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
          onClick={() => console.log("Edit", rowData)}
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
  const backtoPreviousScreen = () => {
    navigate(-1);
  };

  useEffect(() => {
    setTimeout(() => {
      const fetchedVessels = [
        {
          id: 1,
          uid: "#012",
          type: "Sailing Yacht",
          name: "Sea Dreamer",
          status: "Compliant",
          lastDate: "30/06/2024",
          dueDate: "30/10/2024",
          actions: "None",
        },
        {
          id: 2,
          uid: "#015",
          type: "Sailing Yacht",
          name: "Sea Dreamer",
          status: "Non-Compliant",
          lastDate: "30/06/2024",
          dueDate: "30/10/2024",
          actions: "None",
        },
        {
          id: 3,
          uid: "#032",
          type: "Sailing Yacht",
          name: "Sea Dreamer",
          status: "Non-Compliant",
          lastDate: "30/06/2024",
          dueDate: "30/10/2024",
          actions: "Upload Renewal",
        },
        {
          id: 4,
          uid: "#213",
          type: "Sailing Yacht",
          name: "Sea Dreamer",
          status: "Compliant",
          lastDate: "30/06/2024",
          dueDate: "30/10/2024",
          actions: "None",
        },
        {
          id: 5,
          uid: "#215",
          type: "Sailing Yacht",
          name: "Sea Dreamer",
          status: "Non-Compliant",
          lastDate: "30/06/2024",
          dueDate: "30/10/2024",
          actions: "Upload Renewal",
        },
      ];
      setProducts(fetchedVessels);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        {/* Left Section: Heading and Subheading */}
        <div className="sub-header-left">
          <h3 className="mb-0" onClick={backtoPreviousScreen}>
            <i className="pi pi-angle-left"></i> {report.title}
          </h3>
        </div>

        {/* Right Section: Action Button */}
        <div className="sub-header-right sub-header-big-desktop">
          <div className="p-input-icon-left search mr-3">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>

          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
            placeholder="Form Date"
              className="mr-3 w-14rem"
          />

          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
            placeholder="Date To"
              className="mr-3 w-14rem"
          />

          <Button
            className="p-button-primary"
            onClick={(event) => menuRight.current.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          >
            <i className="pi pi-download" />
            <span className="mx-3">Export</span>
            <i className="pi pi-ellipsis-v" />
          </Button>
          <Menu
            className="export-menu"
            model={items}
            popup
            ref={menuRight}
            id="popup_menu_right"
            popupAlignment="right"
          />
        </div>
        <div className="sub-header-right sub-header-small-desktop">
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
            iconPos="right"
            onClick={(e) => op.current && op.current.toggle(e)}
          />
          <OverlayPanel ref={op}>
            <div className="p-d-flex p-flex-column">
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                showIcon
                placeholder="Form Date"
                className="mb-3 md:mb-0 md:mr-3"
              />
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                showIcon
                placeholder="Date To"
              />
            </div>
          </OverlayPanel>
          <Button
            className="p-button-primary"
            onClick={(event) => menuRight.current.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          >
            <i className="pi pi-download" />
            <span className="mx-3">Export</span>
            <i className="pi pi-ellipsis-v" />
          </Button>
          <Menu
            className="export-menu"
            model={items}
            popup
            ref={menuRight}
            id="popup_menu_right"
            popupAlignment="right"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <DataTable
          className="report-table"
          value={products}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="uid" header="Document ID"></Column>
          <Column field="type" header="Document Type"></Column>
          <Column field="name" header="Vessel name"></Column>
          <Column field="status" header="Compliance Status"></Column>
          <Column field="lastDate" header="Last Checked"></Column>
          <Column field="dueDate" header="Next Due Date"></Column>
          <Column field="actions" header="Actions Required"></Column>
          <Column
            body={loading ? skeletonTemplate : actionBodyTemplate}
            style={{ width: "5%", textAlign: "end" }}
          />
        </DataTable>
      </div>
    </>
  );
}
