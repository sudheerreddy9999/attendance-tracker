"use client"
import withRoleProtection from '../utils/withRoleProtection';
import AddUser from '../components/addUser'
import { useState } from 'react';
import { useRouter } from "next/navigation";
const TeacherDashboard = () => {
  const [addUser,setAddUser] = useState(false);
  const router = useRouter()
  return (
    <div>
      <div>
        <button onClick={()=>router.push("/teacher/users")} className='bg-slate-800 m-5 text-sm rounded-lg text-white px-3 py-2'>Manage Users</button>
      </div>
      {addUser ?<AddUser handleClose ={()=>setAddUser(false)}/> :null }
      
    </div>
  );
};

export default withRoleProtection(TeacherDashboard, ['teacher', 'admin']);
