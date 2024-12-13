import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";

export default function ScheduleCalendar() {
  const isMobile = window.innerWidth <= 767;

  const resourcesEventArr = [
    {
      resourceId: 1,
      resourceTitle: "Ashley Brown",
      resourceDesignation: "Crew",
      events: [
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
      ],
    },
    {
      resourceId: 2,
      resourceTitle: "Javier Holloway",
      resourceDesignation: "Crew",
      events: [
        {
          title: "Meeting with Client",
          start: "2024-12-01",
          status: "Complete",
        },
        {
          title: "Project Presentation",
          start: "2024-12-10",
          status: "In Progress",
        },
        {
          title: "Team Building Activity",
          start: "2024-12-18",
          status: "Pending",
        },
        {
          title: "Company Holiday",
          start: "2024-12-30",
          status: "Complete",
        },
      ],
    },
    {
      resourceId: 3,
      resourceTitle: "Stephen Harris",
      resourceDesignation: "Crew",
      events: [],
    },
    {
      resourceId: 4,
      resourceTitle: "Richard Walters",
      resourceDesignation: "Crew",
      events: [],
    },
    {
      resourceId: 5,
      resourceTitle: "Stephen Harris",
      resourceDesignation: "Crew",
      events: [],
    },
    {
      resourceId: 6,
      resourceTitle: "Richard Walters",
      resourceDesignation: "Crew",
      events: [],
    },
    {
      resourceId: 7,
      resourceTitle: "Stephen Harris",
      resourceDesignation: "Crew",
      events: [],
    },
    {
      resourceId: 8,
      resourceTitle: "Richard Walters",
      resourceDesignation: "Crew",
      events: [],
    },
  ];

  // Custom header template for tab with resource title and designation
  const HeaderTemplate = ({ resource }) => {
    return (
      <div>
        <h6>{resource.resourceTitle}</h6>
        <p>{resource.resourceDesignation}</p>
      </div>
    );
  };

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

  const renderTabs = () => {
    return resourcesEventArr.map((resource) => (
      <TabPanel
        key={resource.resourceId}
        header={<HeaderTemplate resource={resource} />}
      >
        <FullCalendar
          //plugins={[dayGridPlugin, interactionPlugin]}
          plugins={
            isMobile
              ? [listPlugin, interactionPlugin]
              : [dayGridPlugin, interactionPlugin]
          }
          initialView={isMobile ? "listMonth" : "dayGridMonth"}
          events={resource.events.map((event) => ({
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
      </TabPanel>
    ));
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left">
          <h3>Schedule Calendar</h3>
          <p>Calendar view of all tasks</p>
        </div>
        <div className="sub-header-right">
          <Button
            label="Create New Task"
            icon="pi pi-plus"
            className="p-button-primary"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <div className="grid md:align-items-center flex-column-reverse md:flex-row">
          <div className="col-12 md:col-4">
            <h3 className="mt-0 mb-2 md:mb-0 schedule-title">
              Specialist Name <Badge value={resourcesEventArr.length}></Badge>
            </h3>
          </div>
          <div className="col-12 md:col-8">
            <ul className="flex md:justify-content-end schedule-calender-mark">
              <li className="complete">Complete</li>
              <li className="in-progress">In Progress</li>
              <li className="pending">Pending</li>
            </ul>
          </div>
        </div>
        <div className="schedule-calender">
          <TabView>{renderTabs()}</TabView>
        </div>
      </div>
    </>
  );
}
