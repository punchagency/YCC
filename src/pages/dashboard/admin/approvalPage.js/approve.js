import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../../../../components/Toast';
import { fetchPendingVendors, approveVendor } from '../../../../services/admin/adminService';
import './approve.css';

const ApprovePage = () => {
  const [activeTab, setActiveTab] = useState('supplier');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const { showToast } = useToast();

  const fetchVendors = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const response = await fetchPendingVendors(activeTab, reset ? null : lastId);
      
      if (response.status === 'success') {
        const newVendors = response.data.vendors;
        setVendors(prev => reset ? newVendors : [...prev, ...newVendors]);
        setHasMore(response.data.hasMore);
        setLastId(response.data.lastId);
      }
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch vendors',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, lastId, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchVendors(true);
  }, [activeTab]);

  // Infinite scroll handler
  const observer = useRef();
  const lastVendorElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchVendors();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchVendors]);

  const handleSendEmail = async () => {
    try {
      if (!selectedVendor) return;

      const emailData = {
        subject: emailSubject,
        emailBody: emailContent,
        onboardingUrl: `${window.location.origin}/onboarding/${activeTab}`
      };

      await approveVendor(selectedVendor._id, activeTab, emailData);

      showToast({
        severity: 'success',
        summary: 'Success',
        detail: 'Vendor approved and email sent successfully',
        life: 3000
      });

      // Remove the approved vendor from the list
      setVendors(prev => prev.filter(v => v._id !== selectedVendor._id));
      
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailContent('');
      setSelectedVendor(null);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Failed to approve vendor',
        life: 3000
      });
    }
  };

  const renderVendorCard = (vendor, index) => (
    <Card 
      key={vendor._id} 
      className="vendor-card"
      ref={index === vendors.length - 1 ? lastVendorElementRef : null}
    >
      <div className="vendor-card-content">
        <div className="vendor-header">
          <h3>{vendor.businessName}</h3>
        </div>
        
        <div className="vendor-details">
          <div className="detail-row">
            <i className="pi pi-envelope" />
            <span>{vendor.email}</span>
          </div>
          <div className="detail-row">
            <i className="pi pi-phone" />
            <span>{vendor.phone}</span>
          </div>
          <div className="detail-row">
            <i className="pi pi-map-marker" />
            <span>{activeTab === 'supplier' ? vendor.address : vendor.businessAddress}</span>
          </div>
          <div className="detail-row">
            <i className="pi pi-user" />
            <span>{vendor.contactPerson?.fullName} ({vendor.contactPerson?.role})</span>
          </div>
          {(activeTab === 'supplier' ? vendor.website : vendor.businessWebsite) && (
            <div className="detail-row">
              <i className="pi pi-globe" />
              <a 
                href={activeTab === 'supplier' ? vendor.website : vendor.businessWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <div className="vendor-actions">
          <button 
            className="approve-button"
            onClick={() => {
              setSelectedVendor(vendor);
              setEmailSubject(`Approval Confirmation - ${vendor.businessName}`);
              setEmailContent(`We are pleased to inform you that your application has been approved.`);
              setShowEmailModal(true);
            }}
          >
            <i className="pi pi-check text-base" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="approve-page">
      <div className="page-header">
        <h2>Approve New {activeTab === 'supplier' ? 'Suppliers' : 'Services'}</h2>
        <div className="tab-buttons">
          <Button 
            label="Suppliers" 
            className={activeTab === 'supplier' ? 'active' : ''}
            onClick={() => setActiveTab('supplier')}
          />
          <Button 
            label="Service Providers" 
            className={activeTab === 'service_provider' ? 'active' : ''}
            onClick={() => setActiveTab('service_provider')}
          />
        </div>
      </div>

      <div className="vendor-grid">
        {vendors.map((vendor, index) => renderVendorCard(vendor, index))}
        {loading && (
          <div className="loading-indicator">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          </div>
        )}
      </div>

      <Dialog 
        visible={showEmailModal} 
        onHide={() => {
          setShowEmailModal(false);
          setEmailSubject('');
          setEmailContent('');
          setSelectedVendor(null);
        }}
        header="Send Approval Email"
        style={{ width: '50vw' }}
        modal
        dismissableMask
      >
        <div className="email-form">
          <div className="field">
            <label htmlFor="to">To:</label>
            <InputText 
              id="to" 
              value={selectedVendor?.email || ''} 
              disabled
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="subject">Subject:</label>
            <InputText 
              id="subject" 
              value={emailSubject} 
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="content">Message:</label>
            <InputTextarea 
              id="content" 
              value={emailContent} 
              onChange={(e) => setEmailContent(e.target.value)}
              rows={5}
              className="w-full"
            />
            <small className="message-hint">
              Note: The email template already includes greetings and sign-off. Please add only the main message content.
            </small>
          </div>
          <div className="dialog-footer">
            <Button 
              label="Send" 
              icon="pi pi-send" 
              onClick={handleSendEmail}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ApprovePage; 