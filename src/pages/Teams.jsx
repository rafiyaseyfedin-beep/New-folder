import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Crown,
  User,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  UserCheck
} from 'lucide-react';

export default function Teams() {
  const { teams, addTeam, updateTeam, deleteTeam, projects } = useApp();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Form state for Create / Edit Team
  const [formData, setFormData] = useState({
    name: '',
    createdBy: 'Refiya Seyifadin',
    lead: '',
    leadEmail: '',
    projectsCount: 1,
    members: [{ id: 'm1', name: '', email: '' }]
  });

  // Calculate dynamic stats
  const totalTeams = teams ? teams.length : 0;

  // Calculate total members across all teams
  const totalMembers = useMemo(() => {
    if (!teams || teams.length === 0) return 0;
    return teams.reduce((acc, t) => {
      if (t.members && Array.isArray(t.members) && t.members.length > 0) {
        return acc + t.members.length;
      }
      return acc + (t.membersCount || 0);
    }, 0);
  }, [teams]);

  // Average members per team
  const avgMembersPerTeam = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;

  // Filtered teams list based on search term
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return teams;

    return teams.filter(t => {
      const nameMatch = t.name?.toLowerCase().includes(term);
      const leadMatch = t.lead?.toLowerCase().includes(term) || t.leadEmail?.toLowerCase().includes(term);
      const creatorMatch = t.createdBy?.toLowerCase().includes(term);
      const memberMatch = t.members?.some(
        m => m.name?.toLowerCase().includes(term) || m.email?.toLowerCase().includes(term)
      );

      return nameMatch || leadMatch || creatorMatch || memberMatch;
    });
  }, [teams, searchTerm]);

  // Handle open modal for Create
  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      createdBy: 'Refiya Seyifadin',
      lead: '',
      leadEmail: '',
      projectsCount: 1,
      members: [
        { id: 'm1', name: '', email: '' },
        { id: 'm2', name: '', email: '' }
      ]
    });
    setIsModalOpen(true);
  };

  // Handle open modal for Edit
  const handleOpenEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      createdBy: team.createdBy || 'Refiya Seyifadin',
      lead: team.lead || '',
      leadEmail: team.leadEmail || '',
      projectsCount: team.projectsCount !== undefined ? team.projectsCount : 1,
      members: team.members && team.members.length > 0
        ? team.members
        : [{ id: 'm1', name: team.lead || '', email: team.leadEmail || '' }]
    });
    setIsModalOpen(true);
  };

  // Handle member field change in form
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  // Add member row to form
  const handleAddMemberRow = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { id: 'm_' + Date.now(), name: '', email: '' }]
    });
  };

  // Remove member row from form
  const handleRemoveMemberRow = (index) => {
    if (formData.members.length <= 1) return;
    const updatedMembers = formData.members.filter((_, idx) => idx !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a team name');
      return;
    }

    const cleanedMembers = formData.members.filter(m => m.name.trim() !== '');

    const payload = {
      name: formData.name,
      createdBy: formData.createdBy || 'Refiya Seyifadin',
      lead: formData.lead || (cleanedMembers[0] ? cleanedMembers[0].name : 'Unassigned'),
      leadEmail: formData.leadEmail || (cleanedMembers[0] ? cleanedMembers[0].email : 'rafiyaseyfedin@gmail.com'),
      projectsCount: Number(formData.projectsCount) || 0,
      membersCount: cleanedMembers.length > 0 ? cleanedMembers.length : 1,
      members: cleanedMembers.length > 0 ? cleanedMembers : [
        { id: 'm1', name: formData.lead || 'Team Member', email: formData.leadEmail || 'rafiyaseyfedin@gmail.com' }
      ]
    };

    if (editingTeam) {
      updateTeam(editingTeam.id, payload);
    } else {
      addTeam(payload);
    }

    setIsModalOpen(false);
  };

  // Handle Delete Team
  const handleDelete = (teamId, teamName) => {
    let isConfirmed = true;
    try {
      if (typeof window !== 'undefined' && window.confirm) {
        isConfirmed = window.confirm(`Are you sure you want to delete "${teamName}"?`);
      }
    } catch (e) {
      console.warn('window.confirm blocked or unavailable:', e);
    }
    
    if (isConfirmed) {
      deleteTeam(teamId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      
      {/* 1. Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Teams
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', margin: 0, fontWeight: 500 }}>
            Manage corporate teams, assigned members, and engineering leads.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn btn-blue"
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} strokeWidth={2.2} /> Create Team
        </button>
      </div>

      {/* 2. Top Summary KPI Cards (3 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Total Teams Card */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Users size={20} color="#16a34a" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.1rem' }}>
              Total Teams
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {totalTeams}
            </span>
          </div>
        </div>

        {/* Total Members Card */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserPlus size={20} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.1rem' }}>
              Total Members
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {totalMembers}
            </span>
          </div>
        </div>

        {/* Avg Members/Team Card */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#faf5ff',
            border: '1px solid #f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserCheck size={20} color="#9333ea" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.1rem' }}>
              Avg Members / Team
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {avgMembersPerTeam}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search teams by name, lead, creator, or member..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#0f172a',
            fontFamily: 'inherit'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* 4. Team Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
        {filteredTeams.map(t => {
          const membersList = t.members && Array.isArray(t.members) && t.members.length > 0
            ? t.members.map(m => ({
                ...m,
                email: (m.email === 'test@gmail.com' || m.email === 'test1@gmail.com') ? 'rafiyaseyfedin@gmail.com' : (m.email || 'rafiyaseyfedin@gmail.com')
              }))
            : [
                { id: 'm1', name: t.lead || 'Team Member', email: t.leadEmail || 'rafiyaseyfedin@gmail.com' }
              ];

          const memberCount = t.membersCount || membersList.length;
          const projectsCount = t.projectsCount !== undefined ? t.projectsCount : (projects ? projects.filter(p => p.team === t.name).length : 1);
          const creatorName = t.createdBy || 'Refiya Seyifadin';
          const leadName = t.lead || (membersList[0] ? membersList[0].name : 'Unassigned');
          const leadEmail = (t.leadEmail === 'test@gmail.com' || t.leadEmail === 'test1@gmail.com' ? 'rafiyaseyfedin@gmail.com' : t.leadEmail) || (membersList[0] ? membersList[0].email : 'rafiyaseyfedin@gmail.com');

          return (
            <div
              key={t.id}
              className="dash-card"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                position: 'relative'
              }}
            >
              <div>
                {/* Header row: Left Icon + Title / Members / Created By + Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    {/* Left Icon Square */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      border: '1px solid #dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Users size={19} color="#2563eb" />
                    </div>

                    {/* Team Title & Subtitles */}
                    <div>
                      <h3 style={{ fontSize: '1.075rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                        {t.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#2563eb', margin: '0.15rem 0 0.05rem 0', fontWeight: 700 }}>
                        {memberCount} members
                      </p>
                      <p style={{ fontSize: '0.775rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                        Created by: <span style={{ color: '#334155', fontWeight: 600 }}>{creatorName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      style={{
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        color: '#475569',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Edit Team"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      style={{
                        border: '1px solid #fee2e2',
                        background: '#fff1f2',
                        color: '#e11d48',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete Team"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Team Lead Section */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.75rem 0.95rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', background: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                    <Crown size={12} color="#b45309" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                      Team Lead
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#e0f2fe',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={15} color="#0284c7" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                        {leadName}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {leadEmail}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat Boxes (Projects & Members) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  {/* Projects Stat Box */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.1rem' }}>
                      Projects
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                      {projectsCount}
                    </span>
                  </div>

                  {/* Members Stat Box */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.1rem' }}>
                      Members
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                      {memberCount}
                    </span>
                  </div>
                </div>

                {/* Team Members List */}
                {membersList.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '0.775rem',
                      fontWeight: 800,
                      color: '#334155',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      margin: '0 0 0.45rem 0'
                    }}>
                      Team Members
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {membersList.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.4rem',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #f1f5f9'
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.825rem' }}>
                            {m.name}
                          </span>
                          <span style={{ color: '#475569', fontSize: '0.775rem', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {m.email}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Footer Count Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingRight: '0.35rem' }}>
        <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredTeams.length}</strong> of <strong style={{ color: '#0f172a' }}>{totalTeams}</strong> teams
        </span>
      </div>

      {/* 6. Modal for Create / Edit Team */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingTeam ? 'Edit Corporate Team' : 'Create Corporate Team'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Frontend Web Development Team"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    fontWeight: 500
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                    Created By
                  </label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                    placeholder="e.g. Refiya Seyifadin"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      fontWeight: 500
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                    Projects Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.projectsCount}
                    onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      fontWeight: 500
                    }}
                  />
                </div>
              </div>

              {/* Team Lead Fields */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
                  <Crown size={14} color="#d97706" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309' }}>
                    Team Lead Details
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                      Lead Name
                    </label>
                    <input
                      type="text"
                      value={formData.lead}
                      onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                      placeholder="e.g. Sifen Abdusselam"
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        fontSize: '0.825rem',
                        color: '#0f172a',
                        fontWeight: 500
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                      Lead Email
                    </label>
                    <input
                      type="email"
                      value={formData.leadEmail}
                      onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                      placeholder="e.g. sifenabdusselam@gmail.com"
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        fontSize: '0.825rem',
                        color: '#0f172a',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Members Fields */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                    Assigned Members
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMemberRow}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--blue-primary)',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <Plus size={13} /> Add Member
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                  {formData.members.map((member, idx) => (
                    <div key={member.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 26px', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        style={{
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '0.8rem',
                          color: '#0f172a'
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Member Email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        style={{
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '0.8rem',
                          color: '#0f172a'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMemberRow(idx)}
                        style={{
                          border: 'none',
                          background: '#fee2e2',
                          color: '#e11d48',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Remove member"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-blue"
                  style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px' }}
                >
                  {editingTeam ? 'Save Changes' : 'Create Team'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
