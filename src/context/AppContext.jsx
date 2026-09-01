import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user role switcher: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('debo_role') || 'ADMIN';
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('debo_user_id') || '';
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('debo_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('debo_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('debo_teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('debo_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [loadingSupabase, setLoadingSupabase] = useState(false);

  // Synchronize Live Supabase Records on Mount
  useEffect(() => {
    async function loadSupabaseData() {
      setLoadingSupabase(true);
      try {
        // 1. Fetch Projects from Supabase
        const { data: dbProjects, error: prjErr } = await supabase.from('projects').select('*');
        if (!prjErr && dbProjects) {
          const mappedProjects = dbProjects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            manager: p.manager_name || p.manager || 'Unassigned',
            deadline: p.deadline,
            status: p.status || 'In Progress'
          }));
          setProjects(mappedProjects);
        }

        // 2. Fetch Tasks from Supabase
        const { data: dbTasks, error: tskErr } = await supabase.from('tasks').select('*');
        if (!tskErr && dbTasks) {
          const mappedTasks = dbTasks.map(t => ({
            id: t.id,
            projectId: t.project_id,
            title: t.title,
            description: t.description,
            assigneeId: t.assignee_id,
            assigneeName: t.assignee_name,
            team: t.team,
            status: t.status,
            progress: t.progress,
            deadline: t.deadline,
            priority: t.priority
          }));
          setTasks(mappedTasks);
        }

        // 3. Fetch Teams from Supabase
        const { data: dbTeams, error: tmErr } = await supabase.from('teams').select('*');
        if (!tmErr && dbTeams) {
          const mappedTeams = dbTeams.map(tm => ({
            id: tm.id,
            name: tm.name,
            createdBy: tm.created_by || 'Admin',
            lead: tm.lead || 'Unassigned',
            leadEmail: tm.lead_email || '',
            projectsCount: tm.projects_count || 0,
            membersCount: tm.members_count || 0,
            members: tm.members || []
          }));
          setTeams(mappedTeams);
        }

        // 4. Fetch Users from Supabase
        const { data: dbUsers, error: usrErr } = await supabase.from('users').select('*');
        if (!usrErr && dbUsers) {
          const mappedUsers = dbUsers.map(u => ({
            id: u.id,
            name: (u.name === 'test' || u.name === 'Active User') ? 'Refiya Seyifadin' : ((u.name === 'Fedasa Eyob' || u.name === 'Fedesa Eyob') ? 'Sead Nejib' : ((u.name === 'Dula Gudata' || u.name === 'Dula Gudeta') ? 'Rihana Awel' : u.name)),
            email: (u.email === 'test@gmail.com' || u.email === 'test1@gmail.com') ? 'rafiyaseyfedin@gmail.com' : (u.email === 'fedasa@deboengineering.com' ? 'sead@deboengineering.com' : (u.email === 'dula@deboengineering.com' ? 'rihana@deboengineering.com' : u.email)),
            role: (u.name === 'test' || u.name === 'Active User' || u.name === 'Refiya Seyifadin' || u.email?.includes('rafiyaseyfedin')) ? 'ADMIN' : (u.role || 'TEAM_MEMBER'),
            team: u.team_name || u.team || 'Management',
            avatar: u.avatar || ((u.name === 'Fedasa Eyob' || u.name === 'Fedesa Eyob') ? 'SN' : ((u.name === 'Dula Gudata' || u.name === 'Dula Gudeta') ? 'RA' : (u.name || 'RS').slice(0, 2).toUpperCase()))
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.warn('Supabase fetch notice:', err);
      } finally {
        setLoadingSupabase(false);
      }
    }

    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('debo_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('debo_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('debo_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('debo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('debo_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('debo_users', JSON.stringify(users));
  }, [users]);

  // Current active user object (safe fallback)
  const resolvedUser = users.length > 0
    ? (users.find(u => u.id === currentUserId) || users.find(u => u.name === 'Refiya Seyifadin') || users[0])
    : { id: 'u_active', name: 'Refiya Seyifadin', role: 'ADMIN', team: 'Management', avatar: 'RS', email: 'rafiyaseyfedin@gmail.com' };

  const currentUser = {
    ...resolvedUser,
    role: currentRole || resolvedUser.role || 'ADMIN',
    email: (resolvedUser.email === 'test@gmail.com' || resolvedUser.email === 'test1@gmail.com') ? 'rafiyaseyfedin@gmail.com' : (resolvedUser.email || 'rafiyaseyfedin@gmail.com'),
    name: (resolvedUser.name === 'test' || resolvedUser.name === 'Active User' || !resolvedUser.name) ? 'Refiya Seyifadin' : resolvedUser.name
  };

  // Helper functions synced with Supabase
  const addProject = async (projectData) => {
    const tempId = 'p_' + Date.now();
    const newProject = {
      id: tempId,
      status: 'In Progress',
      ...projectData
    };
    setProjects(prev => [newProject, ...prev]);

    try {
      const { data: dbProj, error: dbErr } = await supabase
        .from('projects')
        .insert([
          {
            name: newProject.name,
            description: newProject.description || '',
            manager_name: newProject.manager || 'Unassigned',
            deadline: newProject.deadline || '2026-09-30',
            status: newProject.status || 'In Progress'
          }
        ])
        .select();

      if (dbErr) {
        console.error('Supabase Project Insert Error:', dbErr.message);
      } else if (dbProj && dbProj.length > 0) {
        console.log('Successfully saved project to Supabase:', dbProj[0]);
        setProjects(prev => prev.map(p => p.id === tempId ? { ...p, id: dbProj[0].id } : p));
      }
    } catch (e) {
      console.warn('Failed to sync project to Supabase:', e);
    }
  };

  const addTask = async (taskData) => {
    const assignee = users.find(u => u.id === taskData.assigneeId);
    const assignedName = assignee ? assignee.name : (taskData.assigneeName || 'Unassigned');
    const assignedTeam = assignee ? (assignee.team || 'General') : (taskData.team || 'General');

    const tempId = 'tk_' + Date.now();
    const newTask = {
      id: tempId,
      status: 'Not Started',
      progress: 0,
      assigneeName: assignedName,
      team: assignedTeam,
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      const payload = {
        title: newTask.title,
        description: newTask.description || '',
        assignee_name: assignedName,
        team: assignedTeam,
        status: newTask.status || 'Not Started',
        progress: Number(newTask.progress) || 0,
        deadline: newTask.deadline || '2026-09-30',
        priority: newTask.priority || 'Medium'
      };

      // Only pass foreign keys if valid matching record exists in DB
      if (newTask.projectId && projects.some(p => p.id === newTask.projectId)) {
        payload.project_id = newTask.projectId;
      }

      if (newTask.assigneeId && users.some(u => u.id === newTask.assigneeId)) {
        payload.assignee_id = newTask.assigneeId;
      }

      const { data: dbTask, error: dbErr } = await supabase
        .from('tasks')
        .insert([payload])
        .select();

      if (dbErr) {
        console.error('Supabase Task Insert Error:', dbErr.message, dbErr.details);
      } else if (dbTask && dbTask.length > 0) {
        console.log('Successfully saved task to Supabase:', dbTask[0]);
        setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: dbTask[0].id } : t));
      }
    } catch (e) {
      console.warn('Failed to sync task to Supabase:', e);
    }
  };

  const updateTaskProgress = async (taskId, newProgress, newStatus) => {
    let computedStatus = newStatus;
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        let status = newStatus || task.status;
        if (newProgress === 100) status = 'Completed';
        else if (newProgress > 0 && status === 'Not Started') status = 'In Progress';
        computedStatus = status;
        return {
          ...task,
          progress: newProgress,
          status
        };
      }
      return task;
    }));

    try {
      await supabase.from('tasks').update({
        progress: newProgress,
        status: computedStatus
      }).eq('id', taskId);
    } catch (e) {
      console.warn('Failed to update task in Supabase:', e);
    }
  };

  const addTeam = async (teamData) => {
    const newTeam = {
      id: 't' + Date.now(),
      createdBy: teamData.createdBy || 'Refiya Seyifadin',
      lead: teamData.lead || 'Unassigned',
      leadEmail: teamData.leadEmail || 'lead@debo.com',
      projectsCount: teamData.projectsCount || 0,
      membersCount: teamData.members ? teamData.members.length : 1,
      members: teamData.members || [],
      ...teamData
    };
    setTeams(prev => [...prev, newTeam]);

    try {
      const { data: dbTeam, error: teamErr } = await supabase.from('teams').insert([
        {
          name: newTeam.name,
          created_by: newTeam.createdBy,
          lead: newTeam.lead,
          lead_email: newTeam.leadEmail,
          projects_count: newTeam.projectsCount,
          members_count: newTeam.membersCount
        }
      ]).select();

      if (teamErr) {
        console.warn('Supabase add team error:', teamErr.message);
      } else if (dbTeam && dbTeam.length > 0) {
        const teamId = dbTeam[0].id;
        // Map real database ID to local React state
        setTeams(prev => prev.map(t => t.id === newTeam.id ? { ...t, id: teamId } : t));

        if (newTeam.members && newTeam.members.length > 0) {
          const memberRows = newTeam.members.map(m => ({
            team_id: teamId,
            name: m.name,
            email: m.email
          }));
          await supabase.from('team_members').insert(memberRows);
        }
      }
    } catch (e) {
      console.warn('Failed to sync team to Supabase:', e);
    }
  };

  const updateTeam = async (teamId, updatedData) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const merged = { ...t, ...updatedData };
        if (updatedData.members) {
          merged.membersCount = updatedData.members.length;
        }
        return merged;
      }
      return t;
    }));

    try {
      await supabase.from('teams').update({
        name: updatedData.name,
        lead: updatedData.lead,
        lead_email: updatedData.leadEmail
      }).eq('id', teamId);
    } catch (e) {
      console.warn('Failed to update team in Supabase:', e);
    }
  };

  const deleteTeam = async (teamId) => {
    let backupTeams;
    setTeams(prev => {
      backupTeams = prev;
      return prev.filter(t => t.id !== teamId);
    });

    try {
      // 1. Delete associated team members first to prevent foreign key constraint violations
      const { error: memberError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);

      if (memberError) {
        console.warn('Failed to delete team members from Supabase:', memberError.message);
      }

      // 2. Now delete the team record itself
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      
      if (error) {
        console.error('Failed to delete team from Supabase:', error.message);
        alert(`Cannot delete team: ${error.message}`);
        if (backupTeams) setTeams(backupTeams);
      } else {
        console.log('Successfully deleted team from Supabase:', teamId);
      }
    } catch (e) {
      console.warn('Failed to delete team in Supabase:', e);
      if (backupTeams) setTeams(backupTeams);
    }
  };

  const addUser = async (userData) => {
    const avatar = userData.avatar || userData.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      id: userData.id || 'u' + Date.now(),
      avatar,
      ...userData
    };
    setUsers(prev => [...prev, newUser]);

    try {
      await supabase.from('users').insert([
        {
          name: userData.name,
          email: userData.email,
          role: userData.role || 'TEAM_MEMBER',
          team_name: userData.team || userData.team_name,
          avatar: avatar
        }
      ]);
    } catch (e) {
      console.warn('Failed to sync new user to Supabase table:', e);
    }
  };

  const updateUser = async (userId, updatedData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updatedData };
      }
      return u;
    }));

    try {
      await supabase.from('users').update({
        name: updatedData.name,
        email: updatedData.email,
        role: updatedData.role,
        team_name: updatedData.team || updatedData.team_name,
        avatar: updatedData.avatar
      }).eq('id', userId);
    } catch (e) {
      console.warn('Failed to update user in Supabase:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentUserId,
      setCurrentUserId,
      currentUser,
      users,
      projects,
      tasks,
      teams,
      loadingSupabase,
      addProject,
      addTask,
      updateTaskProgress,
      addTeam,
      updateTeam,
      deleteTeam,
      addUser,
      updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
