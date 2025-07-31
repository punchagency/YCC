import jsPDF from 'jspdf';

export const exportOrderToPDF = (order) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Company Header with enhanced styling
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 135, 217); // #0387D9 in RGB
  doc.text('Yacht Crew Center', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Subtitle with subtle styling
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // Gray color
  doc.text('Order Details Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Order Summary with colored header
  doc.setFillColor(248, 250, 252); // Very light gray background
  doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 12, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 135, 217); // Blue text
  doc.text('Order Summary', margin, yPosition);
  yPosition += 15;

  // Order details with improved spacing
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const summaryItems = [
    { label: 'Order ID', value: order.orderId || order._id || 'N/A' },
    { label: 'Date', value: new Date(order.createdAt).toLocaleDateString() },
    { label: 'Status', value: order.status || order.overallStatus || 'N/A' },
    { label: 'Total Amount', value: `$${(order.totalAmount || order.totalPrice || 0).toFixed(2)}` }
  ];

  summaryItems.forEach((item, index) => {
    // Label in blue
    doc.setTextColor(3, 135, 217);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, margin, yPosition);
    
    // Value in black
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, margin + 35, yPosition);
    yPosition += 8;
  });
  
  yPosition += 15;

  // Order Items with colored header
  if (order.subOrders && order.subOrders.length > 0) {
    doc.setFillColor(248, 250, 252); // Very light gray background
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 12, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 135, 217); // Blue text
    doc.text('Order Items', margin, yPosition);
    yPosition += 15;

    order.subOrders.forEach((subOrder, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Item header with subtle background
      doc.setFillColor(248, 250, 252); // Very light gray background
      doc.rect(margin - 3, yPosition - 5, contentWidth + 6, 10, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39); // Dark gray
      doc.text(`Item ${index + 1}`, margin, yPosition);
      yPosition += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Item details with colored labels
      const itemDetails = [
        { label: 'Supplier', value: subOrder.supplier?.name || subOrder.supplier?.businessName || 'N/A' },
        { label: 'Sub-Total', value: `$${(subOrder.subTotal || 0).toFixed(2)}` },
        { label: 'Status', value: subOrder.status || 'N/A' }
      ];

      itemDetails.forEach((detail, detailIndex) => {
        // Label in blue
        doc.setTextColor(3, 135, 217);
        doc.setFont('helvetica', 'bold');
        doc.text(`${detail.label}:`, margin, yPosition);
        
        // Value in black
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text(detail.value, margin + 25, yPosition);
        yPosition += 6;
      });
      
      yPosition += 8;

      // Products table with enhanced styling
      if (subOrder.products && subOrder.products.length > 0) {
        const tableHeaders = ['Product', 'Qty', 'Price', 'Total'];
        const tableData = subOrder.products.map(product => [
          product.name || product.product?.name || 'N/A',
          String(product.quantity || 0),
          `$${(product.price || 0).toFixed(2)}`,
          `$${((product.price || 0) * (product.quantity || 0)).toFixed(2)}`
        ]);

        // Draw table header with blue background
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const colWidth = contentWidth / 4;
        let xPos = margin;
        
        // Header background
        doc.setFillColor(3, 135, 217);
        doc.rect(margin, yPosition - 5, contentWidth, 8, 'F');
        
        tableHeaders.forEach((header, i) => {
          doc.setTextColor(255, 255, 255); // White text on blue background
          doc.text(String(header), xPos + 2, yPosition);
          xPos += colWidth;
        });
        yPosition += 8;

        // Draw table data with alternating row colors
        doc.setFont('helvetica', 'normal');
        tableData.forEach((row, rowIndex) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Alternating row background
          if (rowIndex % 2 === 0) {
            doc.setFillColor(248, 250, 252); // Light gray for even rows
            doc.rect(margin, yPosition - 5, contentWidth, 8, 'F');
          }
          
          xPos = margin;
          row.forEach((cell, i) => {
            doc.setTextColor(0, 0, 0);
            doc.text(String(cell), xPos + 2, yPosition);
            xPos += colWidth;
          });
          yPosition += 8;
        });
        yPosition += 8;
      }

      yPosition += 8;
    });
  }

  // Order Information with colored header
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(248, 250, 252); // Very light gray background
  doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 12, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 135, 217); // Blue text
  doc.text('Order Information', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  if (order.deliveryAddress) {
    doc.setTextColor(3, 135, 217);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Address:', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const addr = order.deliveryAddress;
    const addressLines = [
      addr.recipientName,
      addr.recipientStreet + (addr.recipientStreet2 ? `, ${addr.recipientStreet2}` : ''),
      `${addr.recipientCity}, ${addr.recipientState} ${addr.recipientZip}`,
      addr.recipientCountry,
      addr.recipientPhone,
      addr.recipientEmail
    ].filter(Boolean);
    addressLines.forEach(line => {
      doc.text(String(line), margin + 8, yPosition);
      yPosition += 6;
    });
  }
  
  if (order.notes || order.additionalNotes) {
    doc.setTextColor(3, 135, 217);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(order.notes || order.additionalNotes, margin + 20, yPosition);
    yPosition += 8;
  }

  // Enhanced Footer with company branding
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(3, 135, 217);
    doc.setLineWidth(0.5);
    doc.line(margin, 280, pageWidth - margin, 280);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128); // Gray color
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 295, { align: 'center' });
    doc.setTextColor(3, 135, 217);
    doc.text('Yacht Crew Center', pageWidth / 2, 300, { align: 'center' });
  }

  // Save the PDF
  doc.save(`order-${order.orderId || order._id}-${new Date().toISOString().split('T')[0]}.pdf`);
}; 