import React from "react";
import { Button } from "primereact/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";

export default function CrewScheduleCalendar() {
  const isMobile = window.innerWidth <= 767;

  const events = [
    {
      title: "Meeting with Client",
      start: "2024-12-14",
      status: "Complete",
    },
    {
      title: "Project Presentation",
      start: "2024-12-15",
      status: "In Progress",
    },
    {
      title: "Team Building Activity",
      start: "2024-12-20",
      status: "Pending",
    },
    {
      title: "Company Holiday",
      start: "2024-12-25",
      status: "Complete",
    },
  ];

  // Function to dynamically add a class based on event status
  const getEventClass = (status) => {
    switch (status) {
      case "Complete":
        return "complete";
      case "In Progress":
        return "in-progress";
      case "Pending":
        return "pending";
      default:
        return "";
    }
  };


  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left">
          <h3>Schedule Calendar</h3>
          <p>Calendar view of all tasks</p>
        </div>
        <div className="sub-header-right">
          {/* <Button
            label="Create New Task"
            icon="pi pi-plus"
            className="p-button-primary"
          /> */}
        </div>
      </div>
      <div className="card-wrapper-gap">
        <div className="grid md:align-items-center flex-column-reverse md:flex-row">
          {/* <div className="col-12 md:col-4">
            <h3 className="mt-0 mb-2 md:mb-0 schedule-title">
              Vessel Name <Badge value={resourcesEventArr.length}></Badge>
            </h3>
          </div> */}
          <div className="col-12 md:col-12">
            <ul className="flex md:justify-content-end schedule-calender-mark">
              <li className="complete">Complete</li>
              <li className="in-progress">In Progress</li>
              <li className="pending">Pending</li>
            </ul>
          </div>
        </div>
        <div className="schedule-calender">
          <div className="card flex justify-content-center">
            <Card
              className="details-card"
              title=""
            >

              <FullCalendar
                //plugins={[dayGridPlugin, interactionPlugin]}
                plugins={
                  isMobile
                    ? [listPlugin, interactionPlugin]
                    : [dayGridPlugin, interactionPlugin]
                }
                initialView={isMobile ? "listMonth" : "dayGridMonth"}
                events={events.map((event) => ({
                  ...event,
                  classNames: [getEventClass(event.status)], // Assign custom class based on status
                }))}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: isMobile ? "listMonth" : "dayGridMonth",
                }}
                selectable={true}
                height="auto"
              />

            </Card>
          </div>

        </div>
      </div>
    </>
  );
}
