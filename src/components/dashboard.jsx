"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { getYswsAuthors } from "./airtable";

export function DashboardComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const authors = await getYswsAuthors();
        if (isMounted) {
          console.info(authors);
          setData(authors);
        }
      } catch (error) {
        console.error("Error fetching YSWS authors:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="w-full h-full">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Bar
            dataKey="totalGrantsThisMonth"
            fill="#8884d8"
            name="Total Grants This Month"
          />
          <Bar
            dataKey="weightedGrantsThisMonth"
            fill="#82ca9d"
            name="Weighted Grants This Month"
          />
          <Bar
            dataKey="hoursThisMonth"
            fill="#ffc658"
            name="Hours This Month"
          />
          <Bar dataKey="grantsQ12024" fill="#ff8042" name="Grants Q1 2024" />
          <Bar dataKey="grantsQ22024" fill="#00C49F" name="Grants Q2 2024" />
          <Bar dataKey="grants2024" fill="#FFBB28" name="Grants 2024" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
