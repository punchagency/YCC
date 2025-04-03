import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Booking = {
  id: string
  serviceType: string
  vendorAssigned: string
  location: string
  date: string
  time: string
  status: "Confirmed" | "Completed" | "Pending" | "In Progress" | "Flagged"
  notes: string
}

export default function BookingsTable() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const bookings: Booking[] = [
    {
      id: "#983400",
      serviceType: "Yachting",
      vendorAssigned: "John Doe",
      location: "123 Pine Rd, Downtown, NY",
      date: "March-15-2025",
      time: "10:30 Pm",
      status: "Confirmed",
      notes: "Participant Reviews...",
    },
    {
      id: "#984500",
      serviceType: "Mountain Biking",
      vendorAssigned: "Jane Smith",
      location: "123 Pine Rd, Uptown, NY",
      date: "March-16-2025",
      time: "11:00 Am",
      status: "Completed",
      notes: "Participant Reviews...",
    },
    {
      id: "#985600",
      serviceType: "Sailing",
      vendorAssigned: "Michael Brown",
      location: "789 Maple Ave, Lakeside, NY",
      date: "March-17-2025",
      time: "09:00 Am",
      status: "Pending",
      notes: "Participant Reviews...",
    },
    {
      id: "#986700",
      serviceType: "Rock Climbing",
      vendorAssigned: "Emily Davis",
      location: "456 Oak St, Parkview, NY",
      date: "March-18-2025",
      time: "02:30 Pm",
      status: "Confirmed",
      notes: "Participant Reviews...",
    },
    {
      id: "#987800",
      serviceType: "Kayaking",
      vendorAssigned: "Chris Johnson",
      location: "321 Birch Blvd, Countryside, NY",
      date: "March-19-2025",
      time: "01:00 Pm",
      status: "In Progress",
      notes: "Participant Reviews...",
    },
    {
      id: "#988900",
      serviceType: "Surfing",
      vendorAssigned: "Lisa White",
      location: "654 Cedar Ct, Shoreline, NY",
      date: "March-20-2025",
      time: "08:00 Am",
      status: "Pending",
      notes: "Participant Reviews...",
    },
    {
      id: "#989000",
      serviceType: "Scuba Diving",
      vendorAssigned: "David Wilson",
      location: "987 Spruce St, Sunnyvale, NY",
      date: "March-21-2025",
      time: "03:45 Pm",
      status: "Pending",
      notes: "Participant Reviews...",
    },
    {
      id: "#990100",
      serviceType: "Hiking",
      vendorAssigned: "Natalie Martinez",
      location: "258 Willow Way, Mountainview, NY",
      date: "March-22-2025",
      time: "07:30 Am",
      status: "Flagged",
      notes: "Participant Reviews...",
    },
    {
      id: "#991200",
      serviceType: "Snowboarding",
      vendorAssigned: "Daniel Lee",
      location: "135 Fir St, Winterland, NY",
      date: "March-23-2025",
      time: "02:00 Pm",
      status: "Confirmed",
      notes: "Participant Reviews...",
    },
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: Booking["status"]) => {
    const statusStyles = {
      Confirmed: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      "In Progress": "bg-green-100 text-green-800 hover:bg-green-100",
      Flagged: "bg-red-100 text-red-800 hover:bg-red-100",
    }

    return (
      <Badge className={`font-medium ${statusStyles[status]}`} variant="outline">
        {status}
      </Badge>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-t">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <button className="flex items-center space-x-1" onClick={() => handleSort("id")}>
                <span>Booking ID</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <button className="flex items-center space-x-1" onClick={() => handleSort("serviceType")}>
                <span>Service Type</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <span>Vendor Assigned</span>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <span>Location</span>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <button className="flex items-center space-x-1" onClick={() => handleSort("date")}>
                <span>Date/Time</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <button className="flex items-center space-x-1" onClick={() => handleSort("status")}>
                <span>Booking Status</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
              <span>Internal Notes & Comments</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-900">{booking.id}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{booking.serviceType}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{booking.vendorAssigned}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{booking.location}</td>
              <td className="px-4 py-4 text-sm text-gray-900">
                <div>{booking.date}</div>
                <div>{booking.time}</div>
              </td>
              <td className="px-4 py-4 text-sm">{getStatusBadge(booking.status)}</td>
              <td className="px-4 py-4 text-sm text-gray-500">{booking.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

