import React from 'react';

const PRIORITY_COLORS = {
  high:   { bg: '#fff0f0', text: '#c62828', dot: '#ef4444' },
  medium: { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  low:    { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' }
};

const CATEGORY_ICONS = {
  work: '💼', personal: '👤', study: '📚', health: '💪', other: '📌'
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  return (
    <div style={s.card}>
      <div style={s.top}>
        <span style={{ ...s.priority, background: pc.bg, color: pc.text }}>
          <span style={{ ...s.dot, background: pc.dot }}></span>
          {task.priority}
        </span>
        <span style={s.category}>{CATEGORY_ICONS[task.category]} {task.category}</span>
      </div>

      <h4 style={{ ...s.title, textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1 }}>
        {task.title}
      </h4>

      {task.description && <p style={s.desc}>{task.description}</p>}

      {task.dueDate && (
        <div style={s.due}>
          📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )}

      <div style={s.actions}>
        <button style={{ ...s.btn, ...s.toggleBtn }} onClick={onToggle} title="Move to next status">
          {task.status === 'todo' ? '▶ Start' : task.status === 'inprogress' ? '✓ Done' : '↩ Redo'}
        </button>
        <div style={s.iconBtns}>
          <button style={{ ...s.iconBtn, background: '#e8f4fd', color: '#1565c0' }} onClick={onEdit} title="Edit">✏️</button>
          <button style={{ ...s.iconBtn, background: '#fff0f0', color: '#c62828' }} onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background:'#fff', border:'1px solid #f0f0f8', borderRadius:14, padding:'1rem', transition:'all 0.3s', cursor:'default', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' },
  top: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' },
  priority: { display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:600, textTransform:'uppercase' },
  dot: { width:6, height:6, borderRadius:'50%', display:'inline-block' },
  category: { fontSize:'0.75rem', color:'#888' },
  title: { fontSize:'0.95rem', fontWeight:600, color:'#1a1a2e', marginBottom:'0.4rem', lineHeight:1.4 },
  desc: { fontSize:'0.82rem', color:'#888', lineHeight:1.5, marginBottom:'0.6rem' },
  due: { fontSize:'0.75rem', color:'#667eea', marginBottom:'0.75rem', fontWeight:500 },
  actions: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.75rem', paddingTop:'0.75rem', borderTop:'1px solid #f5f5f5' },
  btn: { padding:'0.4rem 0.9rem', border:'none', borderRadius:8, fontSize:'0.8rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter, sans-serif' },
  toggleBtn: { background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff' },
  iconBtns: { display:'flex', gap:'0.4rem' },
  iconBtn: { width:32, height:32, border:'none', borderRadius:8, cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center' }
};