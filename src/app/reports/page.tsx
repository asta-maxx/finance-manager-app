'use client';
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import Card from '../../components/ui/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function ReportsPage() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then(r => r.json())
      .then(data => {
        console.log('Transactions loaded:', data);
        setTxs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading transactions:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12">Loading reports...</div>;

  const months = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    return d.toLocaleString('en-US', { month: 'short' });
  });

  const monthlyData = months.map(month => {
    const monthTxs = txs.filter(t => {
      const tDate = new Date(t.occurredAt);
      const tMonth = tDate.toLocaleString('en-US', { month: 'short' });
      return tMonth === month;
    });
    return {
      income: monthTxs.filter(t => t.type === 'INCOME').reduce((a, t) => a + Number(t.amount), 0),
      expense: monthTxs.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + Number(t.amount), 0)
    };
  });

  const lineData = {
    labels: months,
    datasets: [
      { 
        label: 'Income', 
        data: monthlyData.map(d => d.income), 
        borderColor: '#16a34a', 
        backgroundColor: 'rgba(22,163,74,0.15)',
        borderWidth: 2,
        tension: 0.4
      },
      { 
        label: 'Expense', 
        data: monthlyData.map(d => d.expense), 
        borderColor: '#dc2626', 
        backgroundColor: 'rgba(220,38,38,0.15)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const totalIncome = txs.filter(t => t.type === 'INCOME').reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = txs.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + Number(t.amount), 0);
  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{ 
      data: [totalIncome, totalExpense], 
      backgroundColor: ['#16a34a', '#dc2626'],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { 
      legend: { 
        position: 'bottom' as const,
        labels: { padding: 10 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { 
      legend: { 
        position: 'bottom' as const,
        labels: { padding: 10 }
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Reports</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Income vs Expense Trend (Last 6 Months)</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Income vs Expense Breakdown</h3>
          <div className="h-64">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </Card>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total Income</div>
          <div className="mt-2 text-2xl font-semibold text-green-600">${totalIncome.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Total Expense</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">${totalExpense.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Net Balance</div>
          <div className="mt-2 text-2xl font-semibold">${(totalIncome - totalExpense).toFixed(2)}</div>
        </Card>
      </div>
    </div>
  );
}



