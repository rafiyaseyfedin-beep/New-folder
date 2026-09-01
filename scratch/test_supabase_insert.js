import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlohjtrqkpnjjducdlgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb2hqdHJxa3BuampkdWNkbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjkwNjAsImV4cCI6MjEwMzQwNTA2MH0.63WjT5OHhnv7sZJ6eTVS3VAgIzlCw2WTwNdZugD40nM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing Supabase tasks table insert...');

  const payload = {
    title: 'Test Task from Node Script',
    description: 'Testing task persistence',
    assignee_name: 'Test Assignee',
    team: 'Frontend Web Development Team',
    status: 'Not Started',
    progress: 0,
    deadline: '2026-09-30',
    priority: 'High'
  };

  const { data, error } = await supabase.from('tasks').insert([payload]).select();

  if (error) {
    console.error('SUPABASE INSERT ERROR:', error);
  } else {
    console.log('SUPABASE INSERT SUCCESS:', data);
  }
}

testInsert();
