// File: components/EventScansChart.tsx
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface EventScansChartProps {
  selectedEvent?: {
    date: string;
    name: string;
  };
}

export function EventScansChart({
  selectedEvent,
}: EventScansChartProps) {
  const [options, setOptions] =
    useState<ApexCharts.ApexOptions>({});
  const [series, setSeries] = useState<any[]>([]);

  // Helper function to parse event date and generate day labels
  const generateDayLabels = (eventDate: string) => {
    if (!eventDate) return ["Day 1", "Day 2"];

    try {
      // Parse date like "January 22-24, 2025"
      const match = eventDate.match(
        /(\w+)\s+(\d+)-(\d+),\s+(\d+)/,
      );
      if (match) {
        const [, month, startDay, endDay, year] = match;
        const startDate = new Date(
          `${month} ${startDay}, ${year}`,
        );
        const endDate = new Date(`${month} ${endDay}, ${year}`);

        const dayLabels = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const monthShort = currentDate.toLocaleDateString(
            "en-US",
            { month: "short" },
          );
          const day = currentDate.getDate();
          dayLabels.push(`${monthShort} ${day}`);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dayLabels.slice(0, 2); // Only return first 2 days for now
      }
    } catch (error) {
      console.error("Error parsing event date:", error);
    }

    return ["Day 1", "Day 2"];
  };

  useEffect(() => {
    const dayLabels = generateDayLabels(selectedEvent?.date);

    // Example mock data for event (scans per hour)
    const eventData: Record<string, number[]> = {
      [dayLabels[0]]: [5, 32, 20, 10, 28, 40, 32, 18],
      [dayLabels[1]]: [8, 15, 25, 30, 45, 50, 38, 22],
    };

    const hours = [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];

    setSeries(
      Object.keys(eventData).map((day) => ({
        name: day,
        data: eventData[day],
      })),
    );

    setOptions({
      chart: {
        height: 400,
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "Inter, sans-serif",
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        labels: { colors: "#374151" }, // Tailwind gray-700
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      grid: {
        strokeDashArray: 2,
        borderColor: "rgba(0,0,0,0.1)",
      },
      colors: ["#3B82F6", "#10B981", "#F59E0B"], // Tailwind blue, green, amber
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: hours,
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        labels: {
          style: {
            colors: "#6B7280", // Tailwind gray-500
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          formatter: (val: number) => `${val}`,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: { formatter: (val: number) => `${val} scans` },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: { height: 300 },
            xaxis: { labels: { style: { fontSize: "10px" } } },
            yaxis: { labels: { style: { fontSize: "10px" } } },
          },
        },
      ],
    });
  }, [selectedEvent]);

  return (
    <div className="h-64">
      <Chart
        options={options}
        series={series}
        type="area"
        height="100%"
      />
    </div>
  );
}
