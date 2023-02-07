import React from 'react'

export default function DashboardCard({ count, title }) {
    return (
        <div className="dashboardCard">
            <div className="leftDiv">{count}</div>
            <div className="rightDiv">{title}</div>
        </div>
    )
}
