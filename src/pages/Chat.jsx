import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import {
  Send,
  Search,
  Hash,
  MessageSquare,
  Circle,
  Loader2,
  User,
  Users,
  ArrowRightLeft,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  X,
  File,
  FileDown
} from 'lucide-react';

export default function Chat() {
  const { currentUser, users } = useApp();

  // Preset sample contacts
  const defaultContacts = [
    { id: 'u_refiya', name: 'Refiya Seyifadin', email: 'rafiyaseyfedin@gmail.com', role: 'Super Admin', avatar: 'RS', team: 'Management' },
    { id: 'u_sead', name: 'Sead Nejib', email: 'sead@deboengineering.com', role: 'Frontend Lead', avatar: 'SN', team: 'Frontend Web' },
    { id: 'u_rihana', name: 'Rihana Awel', email: 'rihana@deboengineering.com', role: 'Backend Lead', avatar: 'RA', team: 'Backend Dev' },
    { id: 'u_abdi', name: 'Abdi Dechasa', email: 'abdi@deboengineering.com', role: 'Mobile Lead', avatar: 'AD', team: 'Mobile App' },
    { id: 'u_elaaf', name: 'Elaaf', email: 'elaaf@deboengineering.com', role: 'Project Manager', avatar: 'EL', team: 'Corporate' }
  ];

  // Merge context users with default contacts to ensure rich options
  const availableUsers = users && users.length >= 2 ? users : defaultContacts;

  // Active Sender (Who is currently typing and sending messages)
  const [currentSender, setCurrentSender] = useState(() => {
    return currentUser && currentUser.name ? currentUser : availableUsers[0];
  });

  // Keep currentSender in sync if currentUser updates
  useEffect(() => {
    if (currentUser && currentUser.name && (!currentSender || !currentSender.name)) {
      setCurrentSender(currentUser);
    }
  }, [currentUser]);

  // Active Chat: Channel or Direct Message (DM)
  const [activeChat, setActiveChat] = useState({
    id: 'c1',
    name: '#general',
    type: 'channel',
    desc: 'Debo Engineering General Team Discussion'
  });

  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState(null); // { name, size, type: 'image'|'file', dataUrl }
  const [previewImage, setPreviewImage] = useState(null); // Full screen modal preview
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Cross-browser File Downloader Helper
  const triggerDownload = (dataUrl, fileName) => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export full chat transcript as .txt file
  const handleExportChat = () => {
    if (messages.length === 0) {
      alert('No messages to export yet.');
      return;
    }
    const transcript = messages.map(m => {
      const attachInfo = m.attachment ? ` [Attachment: ${m.attachment.name} (${m.attachment.size})]` : '';
      return `[${m.time}] ${m.senderName}: ${m.text || ''}${attachInfo}`;
    }).join('\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${activeChat.name.replace('#', '').replace('@', '')}_chat_transcript.txt`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Channels List
  const channels = [
    { id: 'c1', name: '#general', type: 'channel', desc: 'Debo Engineering General Team Discussion' },
    { id: 'c2', name: '#backend-dev', type: 'channel', desc: 'Node.js Express & Supabase Database APIs' },
    { id: 'c3', name: '#frontend-web', type: 'channel', desc: 'React 18 & Vite Web Application' },
    { id: 'c4', name: '#mobile-app', type: 'channel', desc: 'React Native & Mobile App Features' },
  ];

  // Fetch Live Channel or DM Messages from Supabase on chat switch
  useEffect(() => {
    async function fetchChatMessages() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('channel_id', activeChat.id)
          .order('created_at', { ascending: true });

        if (!error && data) {
          const mapped = data.map(m => {
            let parsedAttachment = null;
            if (m.attachment_data) {
              try {
                parsedAttachment = typeof m.attachment_data === 'string' ? JSON.parse(m.attachment_data) : m.attachment_data;
              } catch (e) {
                parsedAttachment = null;
              }
            }

            return {
              id: m.id,
              senderName: m.sender_name,
              avatar: m.avatar || (m.sender_name ? m.sender_name.slice(0, 2).toUpperCase() : 'US'),
              text: m.text,
              attachment: parsedAttachment,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              createdAt: m.created_at
            };
          });
          setMessages(mapped);
        } else {
          // If table doesn't have records yet, initialize with demo mock messages
          if (activeChat.id === 'c1') {
            setMessages([
              {
                id: 'm1',
                senderName: 'Refiya Seyifadin',
                avatar: 'RS',
                text: 'Hello team! Welcome to the Debo Engineering workspace chat.',
                time: '10:00 AM'
              },
              {
                id: 'm2',
                senderName: 'Sead Nejib',
                avatar: 'SN',
                text: 'Hi Refiya! Working on the frontend dashboard tasks right now. You can share design files and project images here!',
                time: '10:02 AM'
              }
            ]);
          } else {
            setMessages([]);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch chat messages from Supabase:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchChatMessages();
  }, [activeChat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachment]);

  // Handle File & Image Selection
  const handleFileChange = (e, forcedType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = forcedType === 'image' || file.type.startsWith('image/');
    const fileSizeFormatted = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.round(file.size / 1024) + ' KB';

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        name: file.name,
        size: fileSizeFormatted,
        type: isImage ? 'image' : 'file',
        mimeType: file.type,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachment) return;

    const textToSubmit = messageText.trim();
    const currentAttachment = attachment;
    
    setMessageText('');
    setAttachment(null);

    const senderName = currentSender?.name || 'Refiya Seyifadin';
    const senderAvatar = currentSender?.avatar || senderName.slice(0, 2).toUpperCase();

    const tempMsg = {
      id: 'm_' + Date.now(),
      senderName: senderName,
      avatar: senderAvatar,
      text: textToSubmit,
      attachment: currentAttachment,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const payload = {
        channel_id: activeChat.id,
        sender_name: senderName,
        avatar: senderAvatar,
        text: textToSubmit
      };

      // Check if attachment exists and stringify for storage
      if (currentAttachment) {
        payload.attachment_data = JSON.stringify(currentAttachment);
      }

      const { data, error } = await supabase.from('chat_messages').insert([payload]).select();

      if (error) {
        console.warn('Supabase chat message insert warning:', error.message);
      } else if (data && data.length > 0) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? { ...m, id: data[0].id } : m));
      }
    } catch (e) {
      console.warn('Failed to save message to Supabase:', e);
    }
  };

  // Switch between other users quickly
  const getOtherUser = () => {
    return availableUsers.find(u => u.name !== currentSender.name) || availableUsers[0];
  };

  const handleQuickSwitch = () => {
    const other = getOtherUser();
    setCurrentSender(other);
  };

  // Filter channels and members by search term
  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredMembers = availableUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '270px minmax(0, 1fr)',
      gap: '1.25rem',
      height: 'calc(100vh - 110px)',
      minHeight: '520px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Hidden File and Image Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'file')}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt,.csv,.zip,.xlsx,.pptx,.json"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, 'image')}
        style={{ display: 'none' }}
        accept="image/*"
      />

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <button
                onClick={() => triggerDownload(previewImage, 'downloaded_image.png')}
                title="Download Image"
                style={{
                  background: 'var(--blue-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                <Download size={14} /> Download Image
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                <X size={18} color="#0f172a" />
              </button>
            </div>

            <img
              src={previewImage}
              alt="Full Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
                objectFit: 'contain',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>
      )}

      {/* Left Column: Channels & Direct Messages */}
      <div className="dash-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', background: '#ffffff' }}>
        
        {/* Search Input */}
        <div className="search-input-box" style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Search channels or people..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={14} color="#64748b" />
        </div>

        {/* Scrollable Channels & Direct Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.2rem' }}>
          
          {/* Team Channels */}
          <div>
            <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.45rem', display: 'block', textTransform: 'uppercase' }}>
              Team Channels
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {filteredChannels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChat(ch)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: activeChat.id === ch.id ? 'var(--blue-light)' : 'transparent',
                    color: activeChat.id === ch.id ? 'var(--blue-primary)' : '#1e293b',
                    fontWeight: activeChat.id === ch.id ? 700 : 500,
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Hash size={15} color={activeChat.id === ch.id ? 'var(--blue-primary)' : '#64748b'} />
                  <span>{ch.name.replace('#', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages (1-on-1 Chat With People) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Direct Messages (1-on-1)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {filteredMembers.map(u => {
                const dmId = 'dm_' + u.name.replace(/\s+/g, '_').toLowerCase();
                const isSelected = activeChat.id === dmId;

                return (
                  <button
                    key={u.id || u.name}
                    onClick={() => setActiveChat({
                      id: dmId,
                      name: `@${u.name}`,
                      type: 'dm',
                      desc: `Direct 1-on-1 text & file sharing with ${u.name} (${u.role || 'Member'})`,
                      recipient: u
                    })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: isSelected ? 'var(--blue-light)' : 'transparent',
                      color: isSelected ? 'var(--blue-primary)' : '#1e293b',
                      fontSize: '0.785rem',
                      fontWeight: isSelected ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--blue-primary)' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#0f172a',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {u.avatar && (u.avatar.startsWith('data:image') || u.avatar.includes('http') || u.avatar.includes('/')) ? (
                          <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (u.avatar || u.name.slice(0, 2)).toUpperCase()
                        )}
                      </div>
                      <Circle size={7} fill="#10b981" color="#10b981" style={{ position: 'absolute', bottom: -1, right: -1 }} />
                    </div>
                    
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <span style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {u.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sender Persona Switcher at Bottom of Left Sidebar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 700, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Chatting As (Switch Account):
          </label>
          <select
            value={currentSender.name}
            onChange={(e) => {
              const found = availableUsers.find(u => u.name === e.target.value);
              if (found) setCurrentSender(found);
            }}
            style={{
              width: '100%',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--blue-primary)',
              background: '#f8fafc',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {availableUsers.map(u => (
              <option key={u.id || u.name} value={u.name}>
                {u.name} ({u.role || 'Member'})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Right Column: Chat Stream & Message Area */}
      <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: '#ffffff' }}>
        
        {/* Chat Stream Header */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: activeChat.type === 'dm' ? '#dcfce7' : 'var(--blue-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeChat.type === 'dm' ? '#16a34a' : 'var(--blue-primary)',
              flexShrink: 0
            }}>
              {activeChat.type === 'dm' ? <User size={18} /> : <Hash size={18} />}
            </div>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {activeChat.name}
                {activeChat.type === 'dm' && (
                  <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                    Direct Message
                  </span>
                )}
              </h2>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                {activeChat.desc}
              </span>
            </div>
          </div>

          {/* Persona Switcher Badge & Chat Export Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleExportChat}
              title="Download chat conversation as text file"
              className="btn btn-outline"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.725rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                borderRadius: '6px'
              }}
            >
              <FileDown size={13} />
              <span>Export Chat</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f8fafc',
              padding: '0.35rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid var(--border-light)',
              fontSize: '0.725rem'
            }}>
              <span style={{ color: '#64748b' }}>Active:</span>
              <strong style={{ color: '#0f172a' }}>{currentSender.name}</strong>
            </div>

            <button
              onClick={handleQuickSwitch}
              title={`Switch active sender to ${getOtherUser().name}`}
              className="btn btn-outline"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.725rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: '999px'
              }}
            >
              <ArrowRightLeft size={12} />
              <span>Reply as {getOtherUser().name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#f8fafc'
        }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.8rem', gap: '0.5rem' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', gap: '0.5rem' }}>
              <MessageSquare size={32} color="var(--blue-primary)" />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Start a conversation in {activeChat.name}!</div>
              <div style={{ fontSize: '0.775rem', maxWidth: '380px', color: '#475569' }}>
                Send texts, photos, documents, and switch between accounts for real-time collaboration.
              </div>
            </div>
          ) : (
            messages.map(m => {
              const isSentByActiveUser = m.senderName === currentSender.name;

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: isSentByActiveUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    maxWidth: '78%',
                    alignSelf: isSentByActiveUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isSentByActiveUser ? 'var(--blue-primary)' : '#475569',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    {m.avatar && (m.avatar.startsWith('data:image') || m.avatar.includes('http') || m.avatar.includes('/')) ? (
                      <img src={m.avatar} alt={m.senderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (m.avatar || m.senderName.slice(0, 2)).toUpperCase()
                    )}
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '0.2rem',
                      flexDirection: isSentByActiveUser ? 'row-reverse' : 'row'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
                        {m.senderName}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: '#64748b' }}>
                        {m.time}
                      </span>
                    </div>

                    <div style={{
                      padding: '0.65rem 0.95rem',
                      borderRadius: '12px',
                      background: isSentByActiveUser ? 'var(--blue-primary)' : '#ffffff',
                      color: isSentByActiveUser ? '#ffffff' : '#0f172a',
                      border: isSentByActiveUser ? 'none' : '1px solid #e2e8f0',
                      fontSize: '0.825rem',
                      lineHeight: 1.45,
                      boxShadow: '0 2px 6px rgba(15,23,42,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {/* Attached Image with Preview & Direct Download */}
                      {m.attachment && m.attachment.type === 'image' && (
                        <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '280px' }}>
                          <img
                            src={m.attachment.dataUrl}
                            alt={m.attachment.name}
                            onClick={() => setPreviewImage(m.attachment.dataUrl)}
                            title="Click to view full image"
                            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block', borderRadius: '6px', cursor: 'pointer' }}
                          />
                          <div style={{
                            fontSize: '0.7rem',
                            color: isSentByActiveUser ? '#e0f2fe' : '#64748b',
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.attachment.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerDownload(m.attachment.dataUrl, m.attachment.name);
                              }}
                              title="Download Image"
                              style={{
                                background: isSentByActiveUser ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                                color: isSentByActiveUser ? '#ffffff' : '#0f172a',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.2rem 0.45rem',
                                fontSize: '0.675rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Download size={11} /> Save
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Attached Document / File with Direct Downloader */}
                      {m.attachment && m.attachment.type === 'file' && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '8px',
                            background: isSentByActiveUser ? 'rgba(255, 255, 255, 0.15)' : '#f1f5f9',
                            color: isSentByActiveUser ? '#ffffff' : '#0f172a',
                            border: isSentByActiveUser ? '1px solid rgba(255,255,255,0.25)' : '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: isSentByActiveUser ? '#ffffff' : 'var(--blue-primary)',
                            color: isSentByActiveUser ? 'var(--blue-primary)' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FileText size={17} />
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.775rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {m.attachment.name}
                            </div>
                            <div style={{ fontSize: '0.675rem', color: isSentByActiveUser ? '#e0f2fe' : '#64748b' }}>
                              {m.attachment.size}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerDownload(m.attachment.dataUrl, m.attachment.name)}
                            title="Download File"
                            style={{
                              background: isSentByActiveUser ? '#ffffff' : 'var(--blue-primary)',
                              color: isSentByActiveUser ? 'var(--blue-primary)' : '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              cursor: 'pointer',
                              flexShrink: 0,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Download size={13} /> Download
                          </button>
                        </div>
                      )}

                      {/* Text content if provided */}
                      {m.text && <div>{m.text}</div>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Attachment Preview Bar */}
        {attachment && (
          <div style={{
            padding: '0.5rem 1.25rem',
            background: '#f1f5f9',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {attachment.type === 'image' ? (
                <img
                  src={attachment.dataUrl}
                  alt={attachment.name}
                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                />
              ) : (
                <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: 'var(--blue-light)', color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
              )}
              <div>
                <strong style={{ fontSize: '0.775rem', color: '#0f172a', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {attachment.name}
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{attachment.size} • Ready to send</span>
              </div>
            </div>

            <button
              onClick={handleRemoveAttachment}
              type="button"
              title="Remove attachment"
              style={{
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border-light)',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {/* Active Sender Indicator Dot */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--blue-primary)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {currentSender.name ? currentSender.name.slice(0, 2).toUpperCase() : 'ME'}
          </div>

          {/* Attach Image Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            title="Attach Image / Photo"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ImageIcon size={18} />
          </button>

          {/* Attach File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Document / File (PDF, DOCX, ZIP, etc.)"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            placeholder={attachment ? `Add a caption for ${attachment.name}...` : `Message as ${currentSender.name} in ${activeChat.name}...`}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: '0.825rem',
              outline: 'none',
              color: '#0f172a'
            }}
          />

          <button
            type="submit"
            disabled={!messageText.trim() && !attachment}
            className="btn btn-blue"
            style={{
              padding: '0.65rem 1.15rem',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              opacity: (!messageText.trim() && !attachment) ? 0.6 : 1,
              cursor: (!messageText.trim() && !attachment) ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={15} /> Send
          </button>
        </form>

      </div>

    </div>
  );
}
