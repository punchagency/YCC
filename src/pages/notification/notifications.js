import { InputText } from "primereact/inputtext";
import AdminHeader from "../../components/header";
import LeftMenu from "../../components/menu";
import { Badge } from "primereact/badge";
import { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

export default function Notifications({ role }) {

  console.log("roleeee",role);
  const menuRight = useRef(null);
  const items = [
    {
      label: "View",
    },
    {
      label: "Delete",
    },
    {
      label: "Mark as Read",
    },
  ];
  const [notifications, setNotifications] = useState([
    {
      title: "Deficiency Follow-Ups",
      message:
        "Hull cleaning and inspection is due on December 6, 2024. Confirm service provider arrangements.",
      isNew: true,
      isread: true,
      create_at: "2 hours ago",
    },
    {
      title: "Upcoming Certification Expirations",
      message:
        "The recent MARPOL Annex I audit identified an environmental compliance deficiency. Submit proof of corrective action by February 21, 2024.",
      isNew: false,
      isread: true,
      create_at: "Yesterday",
    },
    {
      title: "Scheduled Inspections",
      message:
        "SOLAS has released new amendments impacting safety equipment protocols. Review and integrate the changes by April 15, 2024, to ensure ongoing compliance.",
      isNew: false,
      isread: false,
      create_at: "Nov 7, 2024",
    },
  ]);
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        {/* Left Section: Heading and Subheading */}
        <div className="sub-header-left">
          <div className="flex align-items-center">
            <h3 className="mr-2">Notifications </h3>
            <Badge value="89" severity="warning"></Badge>
          </div>
          <p>List of all details notifications</p>
        </div>

        {/* Right Section: Action Button */}
        <div className="sub-header-right">
          <div className="p-input-icon-left search">
            <i className="pi pi-search" />
            <InputText type="search" placeholder="Search" />
          </div>
        </div>
      </div>
      <div className="card-wrapper-gap">

        <div className="card">
          <div className="card-wraper">
            <div className="grid align-items-center justify-content-between mb-3 notification-title">
              <div className="col-6">
                <h3 className="my-0">Compliance Notifications</h3>
              </div>
              <div className="col-6 text-right">
                <Button
                  className="p-0"
                  onClick={(event) => menuRight.current.toggle(event)}
                  aria-controls="popup_menu_right"
                  aria-haspopup
                >
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
            <ul className="notification-list">
              {notifications.map((item, index) => (
                <li key={index}>
                  <Card
                    className={
                      item.isNew === true
                        ? "new mb-2"
                        : item.isread === true
                          ? "read mb-2"
                          : "mb-2"
                    }
                  >
                    <div className="grid justify-content-between">
                      <div className="col-10">
                        {item?.isNew === true ? (
                          <Badge value="New" severity="success"></Badge>
                        ) : (
                          ""
                        )}
                        <h3 className="mb-2">{item.title}</h3>
                        <p className="m-0">{item.message}</p>
                      </div>
                      <div className="col-2">
                        <p className="text-right time">{item.create_at}</p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
            {role === "Captain/Manager" ? (
              <>

                <div className="grid align-items-center justify-content-between mb-3 mt-4 notification-title">
                  <div className="col-6">
                    <h3 className="my-0">Maintenance Notifications</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Button
                      className="p-0"
                      onClick={(event) => menuRight.current.toggle(event)}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    >
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
                <ul className="notification-list">
                  {notifications.map((item, index) => (
                    <li key={index}>
                      <Card
                        className={
                          item.isNew === true
                            ? "new mb-2"
                            : item.isread === true
                              ? "read mb-2"
                              : "mb-2"
                        }
                      >
                        <div className="grid justify-content-between">
                          <div className="col-10">
                            {item?.isNew === true ? (
                              <Badge value="New" severity="success"></Badge>
                            ) : (
                              ""
                            )}
                            <h3 className="mb-2">{item.title}</h3>
                            <p className="m-0">{item.message}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-right time">{item.create_at}</p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>

                <div className="grid align-items-center justify-content-between mb-3 mt-4 notification-title">
                  <div className="col-6">
                    <h3 className="my-0">Financial Notifications</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Button
                      className="p-0"
                      onClick={(event) => menuRight.current.toggle(event)}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    >
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
                <ul className="notification-list">
                  {notifications.map((item, index) => (
                    <li key={index}>
                      <Card
                        className={
                          item.isNew === true
                            ? "new mb-2"
                            : item.isread === true
                              ? "read mb-2"
                              : "mb-2"
                        }
                      >
                        <div className="grid justify-content-between">
                          <div className="col-10">
                            {item?.isNew === true ? (
                              <Badge value="New" severity="success"></Badge>
                            ) : (
                              ""
                            )}
                            <h3 className="mb-2">{item.title}</h3>
                            <p className="m-0">{item.message}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-right time">{item.create_at}</p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>

                <div className="grid align-items-center justify-content-between mb-3 mt-4 notification-title">
                  <div className="col-6">
                    <h3 className="my-0">Crew Management Notifications</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Button
                      className="p-0"
                      onClick={(event) => menuRight.current.toggle(event)}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    >
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
                <ul className="notification-list">
                  {notifications.map((item, index) => (
                    <li key={index}>
                      <Card
                        className={
                          item.isNew === true
                            ? "new mb-2"
                            : item.isread === true
                              ? "read mb-2"
                              : "mb-2"
                        }
                      >
                        <div className="grid justify-content-between">
                          <div className="col-10">
                            {item?.isNew === true ? (
                              <Badge value="New" severity="success"></Badge>
                            ) : (
                              ""
                            )}
                            <h3 className="mb-2">{item.title}</h3>
                            <p className="m-0">{item.message}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-right time">{item.create_at}</p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>

                <div className="grid align-items-center justify-content-between mb-3 mt-4 notification-title">
                  <div className="col-6">
                    <h3 className="my-0">Document and Warranty Notifications</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Button
                      className="p-0"
                      onClick={(event) => menuRight.current.toggle(event)}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    >
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
                <ul className="notification-list">
                  {notifications.map((item, index) => (
                    <li key={index}>
                      <Card
                        className={
                          item.isNew === true
                            ? "new mb-2"
                            : item.isread === true
                              ? "read mb-2"
                              : "mb-2"
                        }
                      >
                        <div className="grid justify-content-between">
                          <div className="col-10">
                            {item?.isNew === true ? (
                              <Badge value="New" severity="success"></Badge>
                            ) : (
                              ""
                            )}
                            <h3 className="mb-2">{item.title}</h3>
                            <p className="m-0">{item.message}</p>
                          </div>
                          <div className="col-2">
                            <p className="text-right time">{item.create_at}</p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul> </>)
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}
