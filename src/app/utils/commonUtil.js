const transformAttendance = (attendanceArray) => {
  const result = [];
  attendanceArray.forEach((attRecord) => {
    const { attendance } = attRecord;
    Object.entries(attendance).forEach(([year, months]) => {
      Object.entries(months).forEach(([month, days]) => {
        Object.entries(days).forEach(([day, subjects]) => {
          Object.entries(subjects).forEach(([subject, isPresent]) => {
            result.push({
              date: `${day}-${month}-${year}`,
              subject,
              isPresent,
            });
          });
        });
      });
    });
  });
  return result;
};

export default transformAttendance;
