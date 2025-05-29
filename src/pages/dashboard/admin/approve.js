import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { useToast } from '../../../components/Toast';
import './approve.css';

const ApprovePage = () => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const { showToast } = useToast();

  // Dummy data for suppliers
  const suppliers = [
    {
      id: 1,
      businessName: 'Marine Supplies Co.',
      email: 'contact@marinesupplies.com',
      businessType: 'Marine Equipment',
      serviceAreas: ['Caribbean', 'Mediterranean'],
      departments: ['engineering', 'exterior'],
      contactPerson: {
        fullName: 'John Smith',
        role: 'Manager'
      },
      phone: '+1 234 567 8900',
      address: '123 Harbor Way, Miami, FL',
      createdAt: '2024-03-15',
      website: 'https://www.marinesupplies.com'
    },
    {
      id: 2,
      businessName: 'Yacht Provisions Ltd',
      email: 'info@yachtprovisions.com',
      businessType: 'Food Provisions',
      serviceAreas: ['Mediterranean', 'USA'],
      departments: ['galley', 'interior'],
      contactPerson: {
        fullName: 'Sarah Johnson',
        role: 'Director'
      },
      phone: '+1 234 567 8901',
      address: '456 Marina Drive, Fort Lauderdale, FL',
      createdAt: '2024-03-14',
      website: 'https://www.yachtprovisions.com'
    },
    {
      id: 3,
      businessName: 'Ocean Tech Solutions',
      email: 'sales@oceantech.com',
      businessType: 'Marine Electronics',
      serviceAreas: ['Caribbean', 'USA', 'Europe'],
      departments: ['engineering', 'electronics'],
      contactPerson: {
        fullName: 'Michael Chen',
        role: 'Sales Director'
      },
      phone: '+1 234 567 8902',
      address: '789 Tech Park, San Diego, CA',
      createdAt: '2024-03-13',
      website: 'https://www.oceantech.com'
    },
    {
      id: 4,
      businessName: 'Luxury Yacht Interiors',
      email: 'info@luxuryinteriors.com',
      businessType: 'Interior Design',
      serviceAreas: ['Mediterranean', 'Caribbean'],
      departments: ['interior', 'design'],
      contactPerson: {
        fullName: 'Emma Thompson',
        role: 'Creative Director'
      },
      phone: '+1 234 567 8903',
      address: '321 Design District, Miami, FL',
      createdAt: '2024-03-12',
      website: 'https://www.luxuryinteriors.com'
    },
    {
      id: 5,
      businessName: 'Marine Safety Equipment',
      email: 'safety@marinesafety.com',
      businessType: 'Safety Equipment',
      serviceAreas: ['Global'],
      departments: ['safety', 'engineering'],
      contactPerson: {
        fullName: 'David Wilson',
        role: 'Safety Officer'
      },
      phone: '+1 234 567 8904',
      address: '555 Safety Lane, Seattle, WA',
      createdAt: '2024-03-11',
      website: 'https://www.marinesafety.com'
    },
    {
      id: 6,
      businessName: 'Yacht Paint & Coatings',
      email: 'sales@yachtpaint.com',
      businessType: 'Marine Coatings',
      serviceAreas: ['Caribbean', 'Mediterranean', 'USA'],
      departments: ['exterior', 'maintenance'],
      contactPerson: {
        fullName: 'Robert Brown',
        role: 'Technical Director'
      },
      phone: '+1 234 567 8905',
      address: '777 Paint Street, Fort Lauderdale, FL',
      createdAt: '2024-03-10',
      website: 'https://www.yachtpaint.com'
    },
    {
      id: 7,
      businessName: 'Marine Engine Parts',
      email: 'parts@marineengine.com',
      businessType: 'Engine Parts',
      serviceAreas: ['Global'],
      departments: ['engineering', 'maintenance'],
      contactPerson: {
        fullName: 'James Miller',
        role: 'Parts Manager'
      },
      phone: '+1 234 567 8906',
      address: '888 Engine Road, Houston, TX',
      createdAt: '2024-03-09',
      website: 'https://www.marineengine.com'
    },
    {
      id: 8,
      businessName: 'Luxury Yacht Textiles',
      email: 'textiles@luxuryyacht.com',
      businessType: 'Marine Textiles',
      serviceAreas: ['Mediterranean', 'Caribbean'],
      departments: ['interior', 'design'],
      contactPerson: {
        fullName: 'Sophia Lee',
        role: 'Textile Specialist'
      },
      phone: '+1 234 567 8907',
      address: '999 Fabric Avenue, Miami, FL',
      createdAt: '2024-03-08',
      website: 'https://www.luxuryyachttextiles.com'
    },
    {
      id: 9,
      businessName: 'Marine Navigation Systems',
      email: 'nav@marinenav.com',
      businessType: 'Navigation Equipment',
      serviceAreas: ['Global'],
      departments: ['electronics', 'engineering'],
      contactPerson: {
        fullName: 'Thomas Anderson',
        role: 'Technical Specialist'
      },
      phone: '+1 234 567 8908',
      address: '444 Navigation Way, San Francisco, CA',
      createdAt: '2024-03-07',
      website: 'https://www.marinenav.com'
    },
    {
      id: 10,
      businessName: 'Yacht Galley Supplies',
      email: 'galley@yachtsupplies.com',
      businessType: 'Galley Equipment',
      serviceAreas: ['Caribbean', 'Mediterranean', 'USA'],
      departments: ['galley', 'interior'],
      contactPerson: {
        fullName: 'Lisa Martinez',
        role: 'Supply Manager'
      },
      phone: '+1 234 567 8909',
      address: '222 Galley Street, Fort Lauderdale, FL',
      createdAt: '2024-03-06',
      website: 'https://www.yachtgalleysupplies.com'
    }
  ];

  // Dummy data for service providers
  const serviceProviders = [
    {
      id: 1,
      businessName: 'Luxury Yacht Services',
      email: 'contact@luxuryyachtservices.com',
      services: ['Cleaning', 'Maintenance', 'Crew Training'],
      serviceAreas: ['Caribbean', 'Mediterranean'],
      departments: ['interior', 'exterior'],
      contactPerson: {
        fullName: 'Michael Brown',
        role: 'Owner'
      },
      phone: '+1 234 567 8910',
      address: '789 Yacht Club Road, Miami, FL',
      createdAt: '2024-03-13',
      businessWebsite: 'https://www.luxuryyachtservices.com'
    },
    {
      id: 2,
      businessName: 'Marine Technical Solutions',
      email: 'info@marinetech.com',
      services: ['Engineering', 'Repairs', 'Installation'],
      serviceAreas: ['USA', 'Caribbean'],
      departments: ['engineering', 'exterior'],
      contactPerson: {
        fullName: 'David Wilson',
        role: 'Technical Director'
      },
      phone: '+1 234 567 8911',
      address: '321 Dock Street, Fort Lauderdale, FL',
      createdAt: '2024-03-12',
      businessWebsite: 'https://www.marinetech.com'
    },
    {
      id: 3,
      businessName: 'Elite Yacht Management',
      email: 'management@eliteyacht.com',
      services: ['Crew Management', 'Operations', 'Training'],
      serviceAreas: ['Global'],
      departments: ['management', 'training'],
      contactPerson: {
        fullName: 'Jennifer Adams',
        role: 'Operations Director'
      },
      phone: '+1 234 567 8912',
      address: '555 Management Way, Miami, FL',
      createdAt: '2024-03-11',
      businessWebsite: 'https://www.eliteyacht.com'
    },
    {
      id: 4,
      businessName: 'Marine Interior Design',
      email: 'design@marineinterior.com',
      services: ['Interior Design', 'Renovation', 'Furniture'],
      serviceAreas: ['Mediterranean', 'Caribbean'],
      departments: ['interior', 'design'],
      contactPerson: {
        fullName: 'Rachel Green',
        role: 'Lead Designer'
      },
      phone: '+1 234 567 8913',
      address: '777 Design Avenue, Fort Lauderdale, FL',
      createdAt: '2024-03-10',
      businessWebsite: 'https://www.marineinterior.com'
    },
    {
      id: 5,
      businessName: 'Yacht Security Services',
      email: 'security@yachtsecurity.com',
      services: ['Security', 'Surveillance', 'Access Control'],
      serviceAreas: ['Global'],
      departments: ['security', 'electronics'],
      contactPerson: {
        fullName: 'John Black',
        role: 'Security Director'
      },
      phone: '+1 234 567 8914',
      address: '888 Security Lane, Miami, FL',
      createdAt: '2024-03-09',
      businessWebsite: 'https://www.yachtsecurity.com'
    },
    {
      id: 6,
      businessName: 'Marine IT Solutions',
      email: 'it@marineit.com',
      services: ['IT Support', 'Network Setup', 'Software'],
      serviceAreas: ['Global'],
      departments: ['electronics', 'it'],
      contactPerson: {
        fullName: 'Alex Tech',
        role: 'IT Director'
      },
      phone: '+1 234 567 8915',
      address: '999 Tech Park, San Francisco, CA',
      createdAt: '2024-03-08',
      businessWebsite: 'https://www.marineit.com'
    },
    {
      id: 7,
      businessName: 'Luxury Yacht Catering',
      email: 'catering@luxuryyacht.com',
      services: ['Catering', 'Event Planning', 'Chef Services'],
      serviceAreas: ['Caribbean', 'Mediterranean'],
      departments: ['galley', 'interior'],
      contactPerson: {
        fullName: 'Maria Garcia',
        role: 'Catering Director'
      },
      phone: '+1 234 567 8916',
      address: '111 Catering Street, Miami, FL',
      createdAt: '2024-03-07',
      businessWebsite: 'https://www.luxuryyachtcatering.com'
    },
    {
      id: 8,
      businessName: 'Marine Training Academy',
      email: 'training@marinetraining.com',
      services: ['Crew Training', 'Certification', 'Workshops'],
      serviceAreas: ['Global'],
      departments: ['training', 'education'],
      contactPerson: {
        fullName: 'Professor James',
        role: 'Training Director'
      },
      phone: '+1 234 567 8917',
      address: '222 Academy Road, Fort Lauderdale, FL',
      createdAt: '2024-03-06',
      businessWebsite: 'https://www.marinetraining.com'
    },
    {
      id: 9,
      businessName: 'Yacht Entertainment Services',
      email: 'entertainment@yachtservices.com',
      services: ['Entertainment', 'Events', 'Activities'],
      serviceAreas: ['Caribbean', 'Mediterranean'],
      departments: ['interior', 'entertainment'],
      contactPerson: {
        fullName: 'Sarah Entertainment',
        role: 'Entertainment Director'
      },
      phone: '+1 234 567 8918',
      address: '333 Entertainment Way, Miami, FL',
      createdAt: '2024-03-05',
      businessWebsite: 'https://www.yachtentertainment.com'
    },
    {
      id: 10,
      businessName: 'Marine Legal Services',
      email: 'legal@marinelegal.com',
      services: ['Legal Advice', 'Compliance', 'Documentation'],
      serviceAreas: ['Global'],
      departments: ['legal', 'compliance'],
      contactPerson: {
        fullName: 'Attorney Smith',
        role: 'Legal Director'
      },
      phone: '+1 234 567 8919',
      address: '444 Legal Street, Fort Lauderdale, FL',
      createdAt: '2024-03-04',
      businessWebsite: 'https://www.marinelegal.com'
    }
  ];

  const handleSendEmail = () => {
    // TODO: Implement email sending logic
    showToast({
      severity: 'success',
      summary: 'Success',
      detail: 'Email sent successfully',
      life: 3000
    });
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailContent('');
  };

  const renderVendorCard = (vendor, type) => (
    <Card key={vendor.id} className="vendor-card">
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
            <span>{vendor.address}</span>
          </div>
          <div className="detail-row">
            <i className="pi pi-user" />
            <span>{vendor.contactPerson.fullName} ({vendor.contactPerson.role})</span>
          </div>
          {(type === 'supplier' ? vendor.website : vendor.businessWebsite) && (
            <div className="detail-row">
              <i className="pi pi-globe" />
              <a 
                href={type === 'supplier' ? vendor.website : vendor.businessWebsite} 
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
              setEmailContent(`Dear ${vendor.contactPerson.fullName},\n\nWe are pleased to inform you that your application for ${vendor.businessName} has been approved. Welcome to our platform!\n\nBest regards,\nThe YCC Team`);
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
        <h2>Approve {activeTab === 'suppliers' ? 'Suppliers' : 'Service Providers'}</h2>
        <div className="tab-buttons">
          <Button 
            label="Suppliers" 
            className={activeTab === 'suppliers' ? 'active' : ''}
            onClick={() => setActiveTab('suppliers')}
          />
          <Button 
            label="Service Providers" 
            className={activeTab === 'serviceProviders' ? 'active' : ''}
            onClick={() => setActiveTab('serviceProviders')}
          />
        </div>
      </div>

      <div className="vendor-grid">
        {activeTab === 'suppliers' 
          ? suppliers.map(supplier => renderVendorCard(supplier, 'supplier'))
          : serviceProviders.map(provider => renderVendorCard(provider, 'serviceProvider'))
        }
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
            <label htmlFor="subject">Subject</label>
            <InputText 
              id="subject" 
              value={emailSubject} 
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="content">Message</label>
            <InputTextarea 
              id="content" 
              value={emailContent} 
              onChange={(e) => setEmailContent(e.target.value)}
              rows={5}
              className="w-full"
            />
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