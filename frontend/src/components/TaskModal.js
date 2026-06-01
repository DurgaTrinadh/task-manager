import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm]       = useState({ title:'', description:'', status:'todo', priority:'medium', category:'other', dueDate:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        status:      task.status      || 'todo',
        priority:    task.priority    || 'medium',
        category:    task.category    || 'other',
        dueDate:     task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required!'); return; }
    setLoading(true); setError('');
    try {
      if (task) await axios.put(`/api/tasks/${task._id}`, form);
      else await axios.post('/api/tasks', form);
      onSave(); onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>{task ? '✏️ Edit Task' : '➕ New Task'}</h3>
          <button style={s.close} onClick={onClose}>✕</button>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <form onSubmit={submit}>
          <div style={s.group}>
            <label style={s.label}>Task Title *</label>
            <input style={s.input} name="title" placeholder="What needs to be done?" value={form.title} onChange={handle} required />
          </div>

          <div style={s.group}>
            <label style={s.label}>Description</label>
            <textarea style={{ ...s.input, height:80, resize:'vertical' }} name="description" placeholder="Add details..." value={form.description} onChange={handle} />
          </div>

          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Status</label>
              <select style={s.input} name="status" value={form.status} onChange={handle}>
                <option value="todo">📋 To Do</option>
                <option value="inprogress">⚡ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
            <div style={s.group}>
              <label style={s.label}>Priority</label>
              <select style={s.input} name="priority" value={form.priority} onChange={handle}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Category</label>
              <select style={s.input} name="category" value={form.category} onChange={handle}>
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="study">📚 Study</option>
                <option value="health">💪 Health</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
            <div style={s.group}>
              <label style={s.label}>Due Date</label>
              <input style={s.input} type="date" name="dueDate" value={form.dueDate} onChange={handle} />
            </div>
          </div>

          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? '⏳ Saving...' : task ? '✓ Update Task' : '+ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem', backdropFilter:'blur(4px)' },
  modal: { background:'#fff', borderRadius:20, padding:'2rem', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 60px rgba(0,0,0,0.3)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  title: { fontSize:'1.2rem', fontWeight:700, color:'#1a1a2e', margin:0 },
  close: { background:'#f5f5f5', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' },
  error: { background:'#fff0f0', border:'1px solid #ffcdd2', color:'#c62828', padding:'0.75rem', borderRadius:10, fontSize:'0.85rem', marginBottom:'1rem' },
  group: { marginBottom:'1rem', flex:1 },
  label: { display:'block', fontSize:'0.8rem', fontWeight:600, color:'#444', marginBottom:'0.4rem' },
  input: { width:'100%', padding:'0.75rem 1rem', border:'2px solid #e8e8f0', borderRadius:10, fontSize:'0.9rem', fontFamily:'Inter, sans-serif', boxSizing:'border-box', outline:'none', transition:'border 0.2s' },
  row: { display:'flex', gap:'1rem' },
  footer: { display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid #f0f0f0' },
  cancelBtn: { padding:'0.7rem 1.5rem', background:'#f5f5f5', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'Inter, sans-serif' },
  saveBtn: { padding:'0.7rem 1.5rem', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'Inter, sans-serif' }
};