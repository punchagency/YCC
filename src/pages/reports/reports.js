import React from "react";
import LeftMenu from "../../components/menu";
import AdminHeader from "../../components/header";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();
  // Dynamic data array for cards
  const cardData = [
    {
      title: "Document Compliance Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/document-compliance-report",
    },
    {
      title: "Compliance Alert Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/compliance-alert-report",
    },
    {
      title: "Maintenance Task Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/maintenance-task-report",
    },
    {
      title: "Maintenance Schedule Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/maintenance-schedule-report",
    },
    {
      title: "Vessel Profile Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/vessel-profile-report",
    },
    {
      title: "Expense Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/expense-report",
    },
    {
      title: "Invoice Summary Report",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/invoice-summary-report",
    },
    {
      title: "Financial Overview",
      subTitle: "Details compliance checks on all uploaded documents.",
      path: "/reports/financial-overview",
    },
  ];
  const viewReportDetailsPage = (path) => {
    navigate(path);
  };
  return (
    <>
        <div className="flex align-items-center justify-content-between sub-header-panel">
          {/* Left Section: Heading and Subheading */}
          <div className="sub-header-left">
            <h3>Reports</h3>
            <p>All informations are below</p>
          </div>

          {/* Right Section: Action Button */}
          <div className="sub-header-right">
            <div className="p-input-icon-left search mr-3">
              <i className="pi pi-search" />
              <InputText type="search" placeholder="Search" />
            </div>
          </div>
        </div>
        <div className="card-wrapper-gap">
          <div className="grid">
            {cardData.map((card, index) => (
              <div className="col-12 sm:col-6 lg:col-4" key={index}>
                <Card
                  className="report-card"
                  footer={
                    <div align="right">
                      <Button
                        label="View"
                        severity="secondary"
                        onClick={() => viewReportDetailsPage(card.path)}
                      />
                    </div>
                  }
                >
                  <h3 className="title mt-0 mb-2">{card.title}</h3>
                  <p className="subtitle m-0">{card.subTitle}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
    </>
  );
}
