import React, { useState, useEffect } from "react";
import { fetchSupervisors } from "./service";

function Temp() {
  const [supervisorList, setSupervisorList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSupervisors();
        console.log(response);
        setSupervisorList([...response]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : supervisorList ? (
        <div>
          <h1>Backend Data:</h1>
          <select>
            {supervisorList &&
              supervisorList.length > 0 &&
              supervisorList.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
          </select>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default Temp;
