import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";

export default function ScheduleCalendar() {
  const scrollableTabs = Array.from({ length: 50 }, (_, i) => ({
    title: `Tab ${i + 1}`,
    content: `Tab ${i + 1} Content`,
  }));

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
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={resource.events.map((event) => ({
            ...event,
            classNames: [getEventClass(event.status)], // Assign custom class based on status
          }))}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth",
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
        <div className="sub-header-right flex align-items-center">
          <div className="flex align-items-center relative">
            <i className="pi pi-search absolute left-0 ml-2 text-gray-500"></i>
            <InputText placeholder="Search" className="pl-4 mr-3" />
          </div>
          <Button
            label="Create New Task"
            icon="pi pi-plus"
            className="p-button-primary"
          />
        </div>
      </div>
      <div className="card-wrapper-gap">
        <div className="grid align-items-center">
          <div className="col-6">
            <h3 className="my-0 schedule-title">
              Specialist Name <Badge value={resourcesEventArr.length}></Badge>
            </h3>
          </div>
          <div className="col-6">
            <ul className="flex justify-content-end schedule-calender-mark">
              <li className="complete">Complete</li>
              <li className="in-progress">In Progress</li>
              <li className="pending">Pending</li>
            </ul>
          </div>
          <div className="col-12 schedule-calender">
            <TabView>{renderTabs()}</TabView>
          </div>
        </div>
      </div>
    </>
  );
}
