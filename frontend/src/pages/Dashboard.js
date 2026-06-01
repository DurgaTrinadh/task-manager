import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, token, logout }   = useAuth();
  const [tasks, setTasks]         = useState([]);
  const [stats, setStats]         = useState({ total:0, todo:0, inprogress:0, done:0 });
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask]   = useState(null);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [connected, setConnected] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [t, s] = await Promise.all([axios.get('/api/tasks'), axios.get('/api/tasks/stats')]);
      setTasks(t.data.tasks);
      setStats(s.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onCreated = useCallback(task => { setTasks(p => [task, ...p]); setStats(s => ({...s, total:s.total+1, [task.status]:s[task.status]+1})); }, []);
  const onUpdated = useCallback(() => fetchAll(), [fetchAll]);
  const onDeleted = useCallback(id => { setTasks(p => p.filter(t => t._id !== id)); fetchAll(); }, [fetchAll]);

  const socketRef = useSocket(token, onCreated, onUpdated, onDeleted);
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
  }, [socketRef]);

  const deleteTask = async id => { try { await axios.delete(`/api/tasks/${id}`); } catch(e){} };
  const toggleStatus = async task => {
    const next = task.status==='todo' ? 'inprogress' : task.status==='inprogress' ? 'done' : 'todo';
    try { await axios.put(`/api/tasks/${task._id}`, { status: next }); } catch(e){}
  };

  const filtered = tasks.filter(t =>
    (filter==='all' || t.status===filter) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key:'todo',       label:'📋 To Do',      color:'#ff9800', bg:'#fff8e1' },
    { key:'inprogress', label:'⚡ In Progress', color:'#4caf50', bg:'#e8f5e9' },
    { key:'done',       label:'✅ Done',         color:'#2196f3', bg:'#e3f2fd' }
  ];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Inter,sans-serif', flexDirection:'column', gap:'1rem' }}>
      <div style={{ width:40, height:40, border:'4px solid #e0e0e0', borderTop:'4px solid #667eea', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'#667eea', fontWeight:600 }}>Loading your workspace...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .task-card:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,0.1)!important;}
        .nav-btn:hover{background:linear-gradient(135deg,#667eea22,#764ba222)!important;color:#667eea!important;}
        .add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(102,126,234,0.5)!important;}
        @media(max-width:768px){
          .sidebar{display:none!important;}
          .kanban{grid-template-columns:1fr!important;}
          .main{padding:1rem!important;}
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar" style={s.sidebar}>
        <div style={s.logo}>✅ <span style={s.logoText}>TaskFlow</span></div>
        <div style={s.userBox}>
          <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={s.userName}>{user?.name}</div>
            <div style={s.userEmail}>{user?.email?.substring(0,22)}...</div>
          </div>
        </div>
        <div style={{ ...s.rtBadge, background: connected ? '#e8f5e9' : '#fff3e0' }}>
          <span style={{ ...s.rtDot, background: connected ? '#4caf50' : '#ff9800' }}></span>
          <span style={{ color: connected ? '#2e7d32' : '#e65100', fontSize:'0.78rem', fontWeight:500 }}>
            {connected ? '⚡ Real-time On' : '⏳ Connecting...'}
          </span>
        </div>
        <nav style={s.nav}>
          {[
            {key:'all', label:'🏠 All Tasks', count:stats.total},
            {key:'todo', label:'📋 To Do', count:stats.todo},
            {key:'inprogress', label:'⚡ In Progress', count:stats.inprogress},
            {key:'done', label:'✅ Done', count:stats.done}
          ].map(item => (
            <button key={item.key} className="nav-btn"
              style={{ ...s.navBtn, background: filter===item.key ? 'linear-gradient(135deg,#667eea22,#764ba222)' : 'none', color: filter===item.key ? '#667eea' : '#555', fontWeight: filter===item.key ? 600 : 400 }}
              onClick={() => setFilter(item.key)}>
              <span>{item.label}</span>
              <span style={s.navCount}>{item.count}</span>
            </button>
          ))}
        </nav>
        <button style={s.logoutBtn} onClick={logout}>🚪 Logout</button>
      </aside>

      {/* Main */}
      <main className="main" style={s.main}>
        <div style={s.header}>
          <div>
            <h1 style={s.heading}>Good day, {user?.name?.split(' ')[0]}! 👋</h1>
            <p style={s.subheading}>You have <strong style={{color:'#667eea'}}>{stats.todo}</strong> task{stats.todo!==1?'s':''} to do</p>
          </div>
          <button className="add-btn" style={s.addBtn} onClick={() => { setEditTask(null); setShowModal(true); }}>
            + New Task
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            {label:'Total',      value:stats.total,      color:'#667eea', bg:'#f0f0ff'},
            {label:'To Do',      value:stats.todo,        color:'#f59e0b', bg:'#fffbeb'},
            {label:'In Progress',value:stats.inprogress,  color:'#10b981', bg:'#ecfdf5'},
            {label:'Completed',  value:stats.done,        color:'#3b82f6', bg:'#eff6ff'}
          ].map((st,i) => (
            <div key={i} style={{ ...s.statCard, background:st.bg, borderLeft:`4px solid ${st.color}` }}>
              <div style={{ ...s.statNum, color:st.color }}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={s.searchBox}>
          <span>🔍</span>
          <input style={s.searchInput} placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <span style={{cursor:'pointer', color:'#888'}} onClick={()=>setSearch('')}>✕</span>}
        </div>

        {/* Kanban */}
        <div className="kanban" style={s.kanban}>
          {columns.map(col => (
            <div key={col.key} style={s.column}>
              <div style={{ ...s.colHeader, borderBottom:`3px solid ${col.color}` }}>
                <span style={{ fontWeight:700, fontSize:'0.95rem', color:'#1a1a2e' }}>{col.label}</span>
                <span style={{ ...s.colCount, background:col.color }}>{filtered.filter(t=>t.status===col.key).length}</span>
              </div>
              <div style={s.colBody}>
                {filtered.filter(t=>t.status===col.key).length === 0
                  ? <div style={s.empty}>✨ No tasks here</div>
                  : filtered.filter(t=>t.status===col.key).map(task => (
                    <div key={task._id} className="task-card" style={{ transition:'all 0.3s' }}>
                      <TaskCard
                        task={task}
                        onEdit={() => { setEditTask(task); setShowModal(true); }}
                        onDelete={() => deleteTask(task._id)}
                        onToggle={() => toggleStatus(task)}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && <TaskModal task={editTask} onClose={() => setShowModal(false)} onSave={fetchAll} />}
    </div>
  );
}

const s = {
  page: { display:'flex', minHeight:'100vh', background:'#f8f9ff', fontFamily:'Inter,sans-serif' },
  sidebar: { width:260, background:'#fff', borderRight:'1px solid #f0f0f0', padding:'1.5rem 1rem', display:'flex', flexDirection:'column', gap:'1rem', position:'sticky', top:0, height:'100vh', overflowY:'auto' },
  logo: { display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.4rem', fontWeight:800, padding:'0.5rem' },
  logoText: { background:'linear-gradient(135deg,#667eea,#f093fb)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  userBox: { display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', background:'#f8f9ff', borderRadius:12 },
  avatar: { width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1.1rem', flexShrink:0 },
  userName: { fontWeight:600, fontSize:'0.9rem', color:'#1a1a2e' },
  userEmail: { fontSize:'0.72rem', color:'#888' },
  rtBadge: { display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 0.75rem', borderRadius:8 },
  rtDot: { width:8, height:8, borderRadius:'50%', display:'inline-block', flexShrink:0 },
  nav: { display:'flex', flexDirection:'column', gap:'0.3rem', flex:1 },
  navBtn: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem', border:'none', borderRadius:10, cursor:'pointer', fontSize:'0.88rem', fontFamily:'Inter,sans-serif', transition:'all 0.2s', width:'100%' },
  navCount: { background:'#667eea', color:'#fff', borderRadius:6, padding:'2px 8px', fontSize:'0.72rem', fontWeight:600 },
  logoutBtn: { padding:'0.75rem', border:'none', background:'#fff0f0', color:'#e53e3e', borderRadius:10, cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:'0.88rem' },
  main: { flex:1, padding:'2rem', overflowY:'auto' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' },
  heading: { fontSize:'1.6rem', fontWeight:800, color:'#1a1a2e', margin:0 },
  subheading: { color:'#888', fontSize:'0.9rem', marginTop:'0.3rem' },
  addBtn: { padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700, fontSize:'0.95rem', fontFamily:'Inter,sans-serif', transition:'all 0.3s' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'1rem', marginBottom:'1.5rem' },
  statCard: { padding:'1.25rem', borderRadius:14, border:'1px solid rgba(0,0,0,0.05)' },
  statNum: { fontSize:'2rem', fontWeight:800 },
  statLabel: { fontSize:'0.8rem', color:'#888', marginTop:'0.2rem' },
  searchBox: { display:'flex', alignItems:'center', background:'#fff', border:'2px solid #f0f0f0', borderRadius:12, padding:'0.6rem 1rem', marginBottom:'1.5rem', gap:'0.5rem' },
  searchInput: { border:'none', outline:'none', fontSize:'0.9rem', flex:1, fontFamily:'Inter,sans-serif', color:'#333', background:'transparent' },
  kanban: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' },
  column: { background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #f0f0f0' },
  colHeader: { padding:'1rem 1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fafafa' },
  colCount: { color:'#fff', borderRadius:6, padding:'2px 8px', fontSize:'0.75rem', fontWeight:700 },
  colBody: { padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem', minHeight:200 },
  empty: { textAlign:'center', color:'#ccc', fontSize:'0.85rem', padding:'2rem 0' }
};