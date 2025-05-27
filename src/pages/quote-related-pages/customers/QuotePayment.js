import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const QuotePayment = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quotes/${quoteId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch quote details");
        }

        if (data.status) {
          setQuote(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch quote details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId]);

  const handleBack = () => navigate(-1);

  const handlePayment = async (paymentType) => {
    try {
      setProcessing(true);
      setError(null);

      const endpoint = paymentType === 'deposit' 
        ? `${process.env.REACT_APP_API_URL}/quotes/${quoteId}/invoice`
        : `${process.env.REACT_APP_API_URL}/quotes/${quoteId}/final-payment-invoice`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate payment invoice");
      }

      if (data.status && data.data.invoiceUrl) {
        // Open the Stripe invoice URL in a new tab
        window.open(data.data.invoiceUrl, '_blank');
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            margin: '0 auto 12px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #0387d9', 
            borderRadius: '50%', 
            width: 40, 
            height: 40, 
            animation: 'spin 1s linear infinite' 
          }} />
          <div style={{ color: '#64748b', fontSize: 16 }}>Loading quote details...</div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>Error</h3>
          <p style={{ margin: '0 0 24px', color: '#64748b' }}>{error}</p>
          <button
            onClick={handleBack}
            style={{
              background: '#0387d9',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              margin: '0 auto',
              gap: '8px'
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>Quote Not Found</h3>
          <p style={{ margin: '0 0 24px', color: '#64748b' }}>
            The quote you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            style={{
              background: '#0387d9',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              margin: '0 auto',
              gap: '8px'
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '24px',
      background: '#f8fafc'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '24px'
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 0,
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          Back to Quote Details
        </button>

        <h2 style={{ margin: '0 0 24px', color: '#1e293b' }}>Payment Details</h2>

        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '8px', 
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>Quote Summary</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Service</div>
              <div style={{ color: '#1e293b', fontWeight: 500 }}>{quote.service?.name}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Provider</div>
              <div style={{ color: '#1e293b', fontWeight: 500 }}>{quote.vendor?.businessName}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Total Amount</div>
              <div style={{ color: '#1e293b', fontWeight: 500 }}>${quote.amount}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Deposit Amount</div>
              <div style={{ color: '#1e293b', fontWeight: 500 }}>${quote.depositAmount}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Balance Amount</div>
              <div style={{ color: '#1e293b', fontWeight: 500 }}>${quote.balanceAmount}</div>
            </div>
          </div>
        </div>

        {quote.status === 'accepted' && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>Deposit Payment</h3>
            <p style={{ margin: '0 0 16px', color: '#64748b' }}>
              Please proceed with the deposit payment to secure your booking.
            </p>
            <button
              onClick={() => handlePayment('deposit')}
              disabled={processing}
              style={{
                background: '#0387d9',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {processing ? (
                <>
                  <div style={{ 
                    border: '2px solid #fff', 
                    borderTop: '2px solid transparent', 
                    borderRadius: '50%', 
                    width: 16, 
                    height: 16, 
                    animation: 'spin 1s linear infinite' 
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Pay Deposit (${quote.depositAmount})
                </>
              )}
            </button>
          </div>
        )}

        {quote.status === 'deposit_paid' && (
          <div>
            <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>Final Payment</h3>
            <p style={{ margin: '0 0 16px', color: '#64748b' }}>
              Please proceed with the final payment to complete your booking.
            </p>
            <button
              onClick={() => handlePayment('final')}
              disabled={processing}
              style={{
                background: '#0387d9',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {processing ? (
                <>
                  <div style={{ 
                    border: '2px solid #fff', 
                    borderTop: '2px solid transparent', 
                    borderRadius: '50%', 
                    width: 16, 
                    height: 16, 
                    animation: 'spin 1s linear infinite' 
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Pay Balance (${quote.balanceAmount})
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            background: '#fee2e2',
            borderRadius: '6px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePayment; 