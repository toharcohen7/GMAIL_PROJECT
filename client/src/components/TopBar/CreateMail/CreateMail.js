import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';

function CreateMail({ onSuccess }) {
  const [showCard, setShowCard] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [draftId, setDraftId] = useState(null);
  const [error, setError] = useState('');

  const openCard = () => setShowCard(true);

  const closeCard = async () => {
    if (!to && !subject && !body) {
      setShowCard(false);
      setError('');
      return;
    }

    try {
      let id = draftId;

      if (!id) {
        const res = await FetchWithAuth('http://localhost:12345/api/mails', {
          method: 'POST',
        });

        if (!res) return;
        if (!res.ok) throw new Error('Failed to create draft');

        const data = await res.json();
        id = data.id;
        setDraftId(id);
      }

      await FetchWithAuth(`http://localhost:12345/api/mails/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          receiversNames: to.split(/[,\s]+/) // Split by comma or whitespace
                            .map(n => n.trim())
                            .filter(Boolean),
          subject,
          content: body,
        }),
      });      
    } catch (err) {
      console.log('Draft save error:', err);
    }

    setShowCard(false);
    setTo('');
    setSubject('');
    setBody('');
    setDraftId(null);
    if (onSuccess) onSuccess(); // Notify parent component of success
  };

  const sendMail = async (e) => {
    e.preventDefault();

    try {
      let id = draftId;

      if (!id) {
        const res = await FetchWithAuth('http://localhost:12345/api/mails', {
          method: 'POST',
        });

        if (!res) return;
        if (!res.ok) throw new Error('Failed to create draft');

        const data = await res.json();
        id = data.id;
        setDraftId(id);
      }

      const sendRes = await FetchWithAuth(`http://localhost:12345/api/mails/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          receiversNames: to.split(',').map(n => n.trim()).filter(Boolean),
          subject,
          content: body,
          labelName: 'Sent',
        }),
      });

      if (!sendRes.ok) {
        const errorData = await sendRes.json();
        throw new Error(errorData.error);
      }

      setShowCard(false);
      setTo('');
      setSubject('');
      setBody('');
      setDraftId(null);
      setError('');
      if (onSuccess) onSuccess(); // Notify parent component of success
    } catch (err) {
      setError(err.message || 'An error occurred while sending the mail.');
    }
  };

  return (
    <div className="create-mail-wrapper position-relative">
      <button className="create-mail-btn btn btn-primary" onClick={openCard}>
        Compose
      </button>

      {showCard && (
        <div className="card compose-card custom-compose-card position-absolute mt-2 start-0 top-100" style={{ width: '25rem', zIndex: 100 }}>
          <div className="card-header d-flex justify-content-between align-items-center mail-header">
            <span className="fs-5 fw-bold">New Mail</span>
            <button className="btn btn-secondery" onClick={closeCard}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <form onSubmit={sendMail}>
              <div className="mb-2">
                <label className="form-label fw-bold">To:</label>
                <input
                  type="text"
                  className="form-control input-hover-effect"
                  value={to}
                  onChange={e => {
                    setTo(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="user names"
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Subject:</label>
                <input
                  type="text"
                  className="form-control input-hover-effect"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <textarea
                  className="form-control input-hover-effect"
                  rows="4"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <button type="submit" className="send-button">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateMail;
