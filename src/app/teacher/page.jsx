"use client"
import withRoleProtection from '../utils/withRoleProtection';
import { FaArrowCircleRight, FaArrowUp } from 'react-icons/fa';
import { useRouter } from "next/navigation";

const TeacherDashboard = () => {
  const router = useRouter();

  const boxesData = [
    {
      title: "Manage Students",
      subtitle: "Add or update student records",
      description: "Add new student records, including personal details, academic information, and contact details.",
      imageSrc: "https://st2.depositphotos.com/5425740/9532/v/450/depositphotos_95328970-stock-illustration-vector-group-of-students.jpg",
    },
    {
      title: "Manage Attendance",
      subtitle: "Take or review attendance",
      description: "Track student attendance and make necessary updates.",
      imageSrc: "https://www.edecofy.com/blog/wp-content/uploads/2021/03/attendance-1024x682.jpg",
    },
  ];
  const handleBox = (box)=>{
    if(box =='Manage Students'){
      router.push("/teacher/users")
    }else if(box == 'Manage Attendance'){
      router.push("/teacher/attendance")
    }
  }

  return (
    <div className='mt-10'>
      <div className="flex justify-start items-center mb-10" id="usersInfoSection">
        {boxesData.map((box, index) => (
          <div key={index} className="relative mx-10">
            <div onClick={()=>handleBox(box.title)} className="w-[250px] h-[220px] bg-gradient-to-r from-[#bbc3e4] to-[#75c5f3] rounded-lg flex flex-col justify-center items-center shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-end justify-end px-2 pt-6 ml-52">
                <FaArrowUp className="text-xl text-gray-800 transform rotate-45 hover:text-2xl transition-transform duration-300" />
              </div>
              <div className="flex justify-center items-center">
                <img
                  src={box.imageSrc}
                  className="h-20 w-20 rounded-lg transform hover:scale-110 transition-transform duration-300"
                  alt="Scheduler"
                />
              </div>
              <div className="text-medium text-left pl-2 font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                {box.title}
              </div>
              <div className="text-sm text-left font-medium pl-2 pb-2 text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                {box.subtitle}
              </div>
              <p className="text-xs px-2 pb-6 text-gray-600 hover:text-gray-800 transition-colors duration-300">
                {box.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRoleProtection(TeacherDashboard, ['teacher', 'admin']);
