import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import SidebarNav from "../SidebarNav/SidebarNav";
import "bootstrap/dist/css/bootstrap.min.css";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import InfoCard from "../InfoCard/InfoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  CartesianGrid, // Import CartesianGrid for improved grid styling
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [chartTypeTime, setChartTypeTime] = useState("Line");
  const [chartTypeCategory, setChartTypeCategory] = useState("Pie");

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (category) {
      acc[category] = (acc[category] || 0) + parseFloat(amount);
    }
    return acc;
  }, {});

  const expensesByTime = expenses.reduce((acc, expense) => {
    const month = format(parseISO(expense.date), "MMM yyyy");
    acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  const categoryChartData = Object.keys(expensesByCategory).map((key) => ({
    name: key,
    value: expensesByCategory[key],
  }));

  const timeChartData = Object.keys(expensesByTime).map((key) => ({
    name: key,
    value: expensesByTime[key],
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const renderCustomLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  const renderTimeChart = () => {
    if (timeChartData.length === 0) {
      return <p>No data available for expenses by time</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        {chartTypeTime === "Line" ? (
          <LineChart data={timeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#36A2EB"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        ) : (
          <BarChart data={timeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="value" fill="#36A2EB" />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  const renderCategoryChart = () => {
    if (categoryChartData.length === 0) {
      return <p>No data available for expenses by category</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={318}>
        {chartTypeCategory === "Pie" ? (
          <PieChart>
            <Pie
              data={categoryChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        ) : (
          <RadarChart outerRadius={120} data={categoryChartData}>
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar
              name="Category"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            <Legend />
          </RadarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <Container fluid>
      <Row>
        <SidebarNav />

        <Col md={10} className="main-content main">
          <BreadcrumbAndProfile
            username="Mr. Joe"
            role="Software Developer"
            pageTitle="Dashboard"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: true },
              { name: "Welcome", path: "/welcome", active: true },
            ]}
          />

          <Row className="mb-3">
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <InfoCard
                  title="Total Expenses"
                  value={`€${totalExpenses.toFixed(2)}`}
                  linkText="Add Expenses "
                  linkTo="/expenses"
                />
              </motion.div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Dropdown
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Dropdown.Toggle
                    variant="dark"
                    id="nav-dropdown-dark-example"
                    className="w-full"
                  >
                    {chartTypeTime} chart
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setChartTypeTime("Line")}>
                      Line Chart
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setChartTypeTime("Bar")}>
                      Bar Chart
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {renderTimeChart()}
              </motion.div>
            </Col>

            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Dropdown
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Dropdown.Toggle
                    variant="dark"
                    id="dropdown-basic"
                    className="w-full"
                  >
                    {chartTypeCategory} chart
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setChartTypeCategory("Pie")}>
                      Pie Chart
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setChartTypeCategory("Radar")}
                    >
                      Radar Chart
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {renderCategoryChart()}
              </motion.div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
