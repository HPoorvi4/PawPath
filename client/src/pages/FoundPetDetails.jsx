// src/pages/FoundPetDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/FoundPetDetails.css';

export default function FoundPetDetails() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lost-found/${id}`)
      .then(res => setRecord(res.data))
      .catch(console.error);
    loadComments();
  }, [id]);

  const loadComments = () => {
    axios.get(`http://localhost:5000/api/lost-comments/${id}`)
      .then(res => setComments(res.data))
      .catch(console.error);
  };

  const handleComment = e => {
    e.preventDefault();
    const commenterId = localStorage.getItem('userId');
    axios.post(`http://localhost:5000/api/lost-comments`, {
      lostId: id,
      commenterId,
      comment: newComment
    })
    .then(() => {
      setNewComment('');
      loadComments();
    })
    .catch(console.error);
  };

  if (!record) return <p>Loading…</p>;

  return (
    <div className="found-details">
      <img src={`http://localhost:5000${record.photo_url}`} alt={record.pet_name} />
      <div className="details-info">
        <h2>{record.pet_name || 'Unnamed Pet'}</h2>
        <p><strong>Status:</strong> {record.status}</p>
        <p><strong>Location:</strong> {record.location}</p>
        <p><strong>Reported At:</strong> {new Date(record.reported_at).toLocaleString()}</p>
        <p><strong>Details:</strong> {record.details}</p>
        <hr/>
        <p><strong>Finder:</strong> {record.reporter_name}</p>
        <p><strong>Contact:</strong> {record.reporter_phone}</p>
      </div>

      <div className="comments-section">
        <h3>Community Comments</h3>
        {comments.map(c => (
          <div key={c.id} className="comment">
            <p>{c.comment}</p>
            <span>{new Date(c.commented_at).toLocaleString()}</span>
          </div>
        ))}
       {comments.map(c => (
         <div key={c.id} className="comment">
           <p className="commenter-name">{c.commenter_name} says:</p>
           <p className="comment-text">{c.comment}</p>
           <span className="comment-time">{new Date(c.commented_at).toLocaleString()}</span>
         </div>
       ))}
        <form onSubmit={handleComment}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Seen this pet? Leave a note..."
            required />
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
}
