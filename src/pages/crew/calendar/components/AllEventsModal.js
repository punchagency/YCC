import { Button } from "@mui/material";
import React, { useState, useRef } from "react";
import { Dialog as PrimeDialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { EventCard } from "./EventCard";
import { updateEvent, deleteEvent } from "../../../../services/calendar/calendarService";


export const AllEventsModal = ({
    visible,
    onHide,
    events,
    onEventUpdate,
    onAddGuest,
}) => {
    const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const toast = useRef(null);

    const handleUpdateClick = (event) => {
        console.log("handleUpdateClick event: ", event);
        setSelectedEvent({ ...event }); // Create a copy of the event
        setShowUpdateEventModal(true);
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent({ ...event });
        setShowDeleteEventModal(true);
    };

    const handleEventUpdate = async () => {
        try {
            const result = await updateEvent(selectedEvent._id, {
                title: selectedEvent.title,
                start: selectedEvent.start,
                end: selectedEvent.end,
                location: selectedEvent.location,
                description: selectedEvent.description,
                type: selectedEvent.type,
            });

            if (result.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Event updated successfully",
                });
                setShowUpdateEventModal(false);
                onHide(); // Close the all events modal
                onEventUpdate(); // Refresh the events
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: result.error || "Failed to update event",
                });
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "An error occurred while updating the event",
            });
        }
    };

    const handleEventDelete = async () => {
        try {
            const result = await deleteEvent(selectedEvent._id);

            if (result.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Event deleted successfully",
                });
                setShowDeleteEventModal(false);
                onHide(); // Close the all events modal
                onEventUpdate(); // Refresh the events list
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: result.error || "Failed to delete event",
                });
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "An error occurred while deleting the event",
            });
        }
    };

    return (
        <>
            <PrimeDialog
                visible={visible}
                onHide={onHide}
                header="All Events"
                className="day-events-modal"
                style={{ width: "500px" }}
                maskClosable={true}
                closable={true}
            >
                <div className="day-events-content">
                    {events.map((event, index) => (
                        <React.Fragment key={event._id}>
                            {index > 0 && (
                                <div
                                    className="event-divider"
                                    style={{
                                        height: "1px",
                                        background: "#E4E7EC",
                                        margin: "10px 0",
                                    }}
                                ></div>
                            )}
                            <EventCard
                                title={event.title}
                                start={event.start}
                                location={event.location}
                                description={event.description}
                                event={event}
                                onUpdate={handleUpdateClick}
                                onDelete={handleDeleteClick}
                                onAddGuest={onAddGuest}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </PrimeDialog>

            {/* Update Event Modal */}
            <PrimeDialog
                visible={showUpdateEventModal}
                onHide={() => {
                    setShowUpdateEventModal(false);
                    setSelectedEvent(null);
                }}
                header="Update Event"
                style={{ width: "500px" }}
                maskClosable={true}
                closable={true}
            >
                {selectedEvent && (
                    <div className="update-event-form">
                        <div className="field">
                            <label>Title</label>
                            <InputText
                                value={selectedEvent.title}
                                onChange={(e) =>
                                    setSelectedEvent({ ...selectedEvent, title: e.target.value })
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label>Location</label>
                            <InputText
                                value={selectedEvent.location}
                                onChange={(e) =>
                                    setSelectedEvent({
                                        ...selectedEvent,
                                        location: e.target.value,
                                    })
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <InputTextarea
                                value={selectedEvent.description}
                                onChange={(e) =>
                                    setSelectedEvent({
                                        ...selectedEvent,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label>Start Date</label>
                            <Calendar
                                value={new Date(selectedEvent.start)}
                                onChange={(e) =>
                                    setSelectedEvent({ ...selectedEvent, start: e.value })
                                }
                                showTime
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label>End Date</label>
                            <Calendar
                                value={new Date(selectedEvent.end)}
                                onChange={(e) =>
                                    setSelectedEvent({ ...selectedEvent, end: e.value })
                                }
                                showTime
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label>Current Guests</label>
                            <div
                                className="current-guests"
                                style={{
                                    padding: "10px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "4px",
                                    marginBottom: "15px",
                                }}
                            >
                                {selectedEvent.guestEmails &&
                                    selectedEvent.guestEmails.map((email, idx) => (
                                        <div
                                            key={`email-${idx}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <i
                                                className="pi pi-envelope"
                                                style={{
                                                    marginRight: "8px",
                                                    color: "#667085",
                                                    fontSize: "12px",
                                                }}
                                            ></i>
                                            <span style={{ fontSize: "13px", color: "#475467" }}>
                                                {email}
                                            </span>
                                        </div>
                                    ))}

                                {selectedEvent.guests &&
                                    selectedEvent.guests.map((guest, idx) => (
                                        <div
                                            key={`guest-${idx}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <i
                                                className="pi pi-user"
                                                style={{
                                                    marginRight: "8px",
                                                    color: "#667085",
                                                    fontSize: "12px",
                                                }}
                                            ></i>
                                            <span style={{ fontSize: "13px", color: "#475467" }}>
                                                {guest.email || guest.name || `Guest ${idx + 1}`}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "0.5rem",
                                marginTop: "1rem",
                            }}
                        >
                            <Button
                                label="Cancel"
                                onClick={() => setShowUpdateEventModal(false)}
                                className="p-button-text"
                            />
                            <Button label="Update" onClick={handleEventUpdate} />
                        </div>
                    </div>
                )}
            </PrimeDialog>

            {/* Delete Confirmation Modal */}
            <PrimeDialog
                visible={showDeleteEventModal}
                onHide={() => setShowDeleteEventModal(false)}
                header="Confirm Delete"
                style={{ width: "400px" }}
                maskClosable={true}
                closable={true}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle"
                        style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
                    />
                    <span>Are you sure you want to delete this event?</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <Button
                        label="No"
                        onClick={() => setShowDeleteEventModal(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="Yes"
                        onClick={handleEventDelete}
                        className="p-button-danger"
                    />
                </div>
            </PrimeDialog>

            <Toast ref={toast} />
        </>
    );
};