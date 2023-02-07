import "./LandingPage.css";
import React, { useState, useEffect } from "react";
import { Text } from "@nextui-org/react";
import getDashboardData from "../../api/Dashboard_Api/getDashboardData";
import { Container, Row, Col } from '@nextui-org/react';
import DashboardCard from "../../component/DashboardCard";



export default function LandingPage() {
  const [dashboardData, setdashboardData] = useState()

  useEffect(() => {
    async function fetchData() {
      let resp = await getDashboardData()
      if (resp.status) {
        setdashboardData(resp.data)
      }
    }
    fetchData()
  }, [])

  //   {
  //     "total_doctor_count": result1[0].total_doctor,
  //     "subscribed_doctor_count": result2[0].subscribed_doctors,
  //     "inActive_doctor_count": result1[0].total_doctor - result2[0].subscribed_doctors,
  //     "total_prescription_count": result3[0].total_prescription,
  //     "active_prescription_count": result4[0].active_prescription,
  //     "inActive_prescription_count": result3[0].total_prescription - result4[0].active_prescription,
  // }

  return (
    <React.Fragment>
      {dashboardData ?
        <div >
        <h4 className="dashboardTitle">WorkFitt DashBoard</h4>
          <table>
            <tr>
              <td>
                <DashboardCard
                  count={dashboardData.total_doctor_count}
                  title={"Total Doctor's Count"}
                />
              </td>
              <td>
                <DashboardCard
                  count={dashboardData.subscribed_doctor_count}
                  title={"Subscribed Doctor's Count"}
                />
              </td>
              <td>
                <DashboardCard
                  count={dashboardData.inActive_doctor_count}
                  title={"In-Active Doctor's Count"}
                />
              </td>
            </tr>
            <tr>
              <td>
                <DashboardCard
                  count={dashboardData.total_prescription_count}
                  title={"Total Prescription Count"}
                />
              </td>
              <td>
                <DashboardCard
                  count={dashboardData.active_prescription_count}
                  title={"Active Prescription Count"}
                />
              </td>
              <td>
                <DashboardCard
                  count={dashboardData.inActive_prescription_count}
                  title={"In-Active Prescription Count"}
                />
              </td>
            </tr>
          </table>
        </div>
        : <Text color="red" >No Result Found</Text>
      }
    </React.Fragment>
  );
}
