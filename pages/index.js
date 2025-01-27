import { useEffect, useState } from "react";

export default function Home() {
  const [investmentData, setInvestmentData] = useState(null);
  const [sp500Data, setSP500Data] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState("You're doing amazing, keep saving!");
  const [futureInvestment, setFutureInvestment] = useState({
    duration: 120,
    monthly: 100,
    isYears: true,
    totalIn: 0,
    gains: 0,
    futureValue: 0,
  });
  const [futureWithCurrent, setFutureWithCurrent] = useState({
    futureValue: 0,
    gains: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const sp500Response = await fetch("https://api.example.com/sp500");
        const sp500Data = await sp500Response.json();
        setSP500Data(sp500Data.currentValue);
      } catch {
        setSP500Data("Unavailable");
      }

      try {
        const investmentResponse = await fetch("https://api.example.com/robinhood");
        const investmentData = await investmentResponse.json();
        setInvestmentData(investmentData);
      } catch {
        setInvestmentData({ invested: 5000, currentStock: 5200, returns: 200 });
      }

      try {
        const motivationResponse = await fetch("https://api.example.com/motivation");
        const motivationData = await motivationResponse.json();
        setMotivationalMessage(motivationData.message);
      } catch {
        setMotivationalMessage("Keep investing in yourself, you're worth it!");
      }
    }

    fetchData();
  }, []);

  const calculateFutureInvestment = (duration, monthly, isYears) => {
    const months = isYears ? duration * 12 : duration;
    const rate = 0.08 / 12;
    const totalIn = monthly * months;
    const futureValue =
      monthly * (((1 + rate) ** months - 1) / rate) * (1 + rate);
    setFutureInvestment({
      duration,
      monthly,
      isYears,
      totalIn: totalIn.toFixed(2),
      gains: (futureValue - totalIn).toFixed(2),
      futureValue: futureValue.toFixed(2),
    });
  };

  const calculateFutureWithCurrent = (currentInvested, duration, isYears) => {
    const months = isYears ? duration * 12 : duration;
    const rate = 0.08 / 12;
    const futureValue = currentInvested * (1 + rate) ** months;
    setFutureWithCurrent({
      futureValue: futureValue.toFixed(2),
      gains: (futureValue - currentInvested).toFixed(2),
    });
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-200 flex flex-col items-center p-6 space-y-10">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-pink-800">💖 Alexia Piggy Bank 💖</h1>
        <p className="text-lg text-pink-500 mt-2">Your path to a brighter financial future</p>
      </header>

      {/* Motivational Message */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg text-center">
        <p className="text-xl font-semibold text-pink-700">{motivationalMessage}</p>
      </div>

      {/* S&P 500 Value */}
      <div className="w-full max-w-md bg-gradient-to-r from-pink-100 to-pink-200 p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-pink-800">Vanguard S&P 500</h2>
        <p className="text-3xl font-extrabold text-green-600 mt-2">
          {sp500Data ? `$${formatNumber(sp500Data)}` : "Loading..."}
        </p>
      </div>

      {/* Investment Summary */}
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-800 mb-4">Your Investment Summary</h2>
        {investmentData ? (
          <div className="space-y-2">
            <p className="text-lg">
              💵 Total Invested: <span className="font-extrabold text-pink-700">${formatNumber(investmentData.invested)}</span>
            </p>
            <p className="text-lg">
              📈 Current Stock Value: <span className="font-extrabold text-pink-700">${formatNumber(investmentData.currentStock)}</span>
            </p>
          </div>
        ) : (
          <p className="text-lg text-pink-700">Loading investment data...</p>
        )}
      </div>

      {/* Future Investment Calculator */}
      <div className="w-full max-w-lg bg-gradient-to-r from-pink-100 to-pink-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-800 mb-4">Future Investment Calculator</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-lg text-pink-700">Duration to Invest</span>
            <input
              type="number"
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={futureInvestment.duration}
              onChange={(e) => calculateFutureInvestment(+e.target.value, futureInvestment.monthly, futureInvestment.isYears)}
            />
          </label>
          <label className="block">
            <span className="text-lg text-pink-700">Monthly Contribution ($)</span>
            <input
              type="number"
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={futureInvestment.monthly}
              onChange={(e) => calculateFutureInvestment(futureInvestment.duration, +e.target.value, futureInvestment.isYears)}
            />
          </label>
          <label className="block">
            <span className="text-lg text-pink-700">Duration Type</span>
            <select
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={futureInvestment.isYears ? "years" : "months"}
              onChange={(e) => calculateFutureInvestment(futureInvestment.duration, futureInvestment.monthly, e.target.value === "years")}
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </label>
          <div className="mt-6 text-center">
            <p className="text-lg font-bold text-pink-700">
              💖 Total Invested: <span className="font-extrabold text-pink-900">${formatNumber(futureInvestment.totalIn)}</span>
            </p>
            <p className="text-lg font-bold text-pink-700">
              🎉 Total Gains: <span className="font-extrabold text-green-600">${formatNumber(futureInvestment.gains)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Where Will You Be Section */}
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-800 mb-4">Where Will You Be?</h2>
        <label className="block">
          <span className="text-lg text-pink-700">Current Amount Invested</span>
          <input
            type="number"
            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={investmentData?.invested || 0}
            onChange={(e) => calculateFutureWithCurrent(+e.target.value, futureInvestment.duration, futureInvestment.isYears)}
          />
        </label>
        <div className="mt-6 text-center">
          <p className="text-lg font-bold text-pink-700">
            📈 Future Value: <span className="font-extrabold text-pink-900">${formatNumber(futureWithCurrent.futureValue)}</span>
          </p>
          <p className="text-lg font-bold text-pink-700">
            🎉 Total Gains: <span className="font-extrabold text-green-600">${formatNumber(futureWithCurrent.gains)}</span>
          </p>
        </div>
      </div>

      <footer className="text-sm text-pink-500 mt-10">
        Powered by 🌸 Alexia Piggy Bank Theme 🌸
      </footer>
    </div>
  );
}

