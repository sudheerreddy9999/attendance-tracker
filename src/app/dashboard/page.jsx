"use client"
import withRoleProtection from '../utils/withRoleProtection';

const TeacherDashboard123 = () => {
  return (
    <div>
      <h1>Hello</h1>
      {/* Teacher-specific content */}
    </div>
  );
};

export default withRoleProtection(TeacherDashboard123, ['teacher', 'admin']);
