'use client';

import { useState } from 'react';
import { Plus, Minus, AlertTriangle, Award } from 'lucide-react';

interface PlayerScore {
  points: number;
  warnings: number;
  penalties: number;
  ippon: number;
  wazaari: number;
  yuko: number;
}

export default function LiveScorecardPage() {
  const [playerA, setPlayerA] = useState({ name: 'Player A', ...getInitialScore() });
  const [playerB, setPlayerB] = useState({ name: 'Player B', ...getInitialScore() });
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  function getInitialScore(): PlayerScore {
    return { points: 0, warnings: 0, penalties: 0, ippon: 0, wazaari: 0, yuko: 0 };
  }

  const updateScore = (player: 'A' | 'B', field: keyof PlayerScore, delta: number) => {
    if (winner) return;

    if (player === 'A') {
      setPlayerA(prev => ({
        ...prev,
        [field]: Math.max(0, prev[field] + delta)
      }));
    } else {
      setPlayerB(prev => ({
        ...prev,
        [field]: Math.max(0, prev[field] + delta)
      }));
    }
  };

  const resetMatch = () => {
    setPlayerA({ name: 'Player A', ...getInitialScore() });
    setPlayerB({ name: 'Player B', ...getInitialScore() });
    setTimer(120);
    setIsRunning(false);
    setWinner(null);
  };

  const declareWinner = (player: 'A' | 'B') => {
    setWinner(player === 'A' ? playerA.name : playerB.name);
    setIsRunning(false);
  };

  const calculateTotal = (score: PlayerScore) => {
    return score.ippon * 3 + score.wazaari * 2 + score.yuko * 1 + score.points;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Live Karate Scorecard</h1>
          <p className="text-gray-400">Competition Scoring System</p>
        </div>

        {/* Timer */}
        <div className="bg-black/30 rounded-lg p-6 mb-6 text-center">
          <div className="text-6xl font-bold mb-4">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetMatch}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Reset Match
            </button>
          </div>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="bg-yellow-500 text-black rounded-lg p-6 mb-6 text-center">
            <Award className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-3xl font-bold">WINNER: {winner}</h2>
          </div>
        )}

        {/* Scoreboard Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Player A */}
          <PlayerScoreCard
            player={playerA}
            side="A"
            color="blue"
            onUpdate={(field, delta) => updateScore('A', field, delta)}
            onWin={() => declareWinner('A')}
            disabled={!!winner}
            total={calculateTotal(playerA)}
          />

          {/* Player B */}
          <PlayerScoreCard
            player={playerB}
            side="B"
            color="red"
            onUpdate={(field, delta) => updateScore('B', field, delta)}
            onWin={() => declareWinner('B')}
            disabled={!!winner}
            total={calculateTotal(playerB)}
          />
        </div>

        {/* Match Info */}
        <div className="mt-8 bg-black/30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Scoring Guide</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-yellow-400">Ippon (3 points):</span> Full point - Clean technique
            </div>
            <div>
              <span className="font-semibold text-orange-400">Wazaari (2 points):</span> Half point - Good technique
            </div>
            <div>
              <span className="font-semibold text-green-400">Yuko (1 point):</span> Small point - Basic technique
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerScoreCard({
  player,
  side,
  color,
  onUpdate,
  onWin,
  disabled,
  total,
}: {
  player: { name: string } & PlayerScore;
  side: string;
  color: 'blue' | 'red';
  onUpdate: (field: keyof PlayerScore, delta: number) => void;
  onWin: () => void;
  disabled: boolean;
  total: number;
}) {
  const bgColor = color === 'blue' ? 'bg-blue-600' : 'bg-red-600';
  const hoverColor = color === 'blue' ? 'hover:bg-blue-700' : 'hover:bg-red-700';

  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-xl`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{player.name}</h2>
        <div className="text-5xl font-bold">{total}</div>
        <p className="text-sm opacity-80 mt-1">Total Score</p>
      </div>

      <div className="space-y-4">
        <ScoreControl
          label="Ippon"
          value={player.ippon}
          onIncrease={() => onUpdate('ippon', 1)}
          onDecrease={() => onUpdate('ippon', -1)}
          disabled={disabled}
          color="yellow"
        />
        <ScoreControl
          label="Wazaari"
          value={player.wazaari}
          onIncrease={() => onUpdate('wazaari', 1)}
          onDecrease={() => onUpdate('wazaari', -1)}
          disabled={disabled}
          color="orange"
        />
        <ScoreControl
          label="Yuko"
          value={player.yuko}
          onIncrease={() => onUpdate('yuko', 1)}
          onDecrease={() => onUpdate('yuko', -1)}
          disabled={disabled}
          color="green"
        />
        <ScoreControl
          label="Points"
          value={player.points}
          onIncrease={() => onUpdate('points', 1)}
          onDecrease={() => onUpdate('points', -1)}
          disabled={disabled}
          color="blue"
        />
        <ScoreControl
          label="Warnings"
          value={player.warnings}
          onIncrease={() => onUpdate('warnings', 1)}
          onDecrease={() => onUpdate('warnings', -1)}
          disabled={disabled}
          color="yellow"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <ScoreControl
          label="Penalties"
          value={player.penalties}
          onIncrease={() => onUpdate('penalties', 1)}
          onDecrease={() => onUpdate('penalties', -1)}
          disabled={disabled}
          color="red"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      <button
        onClick={onWin}
        disabled={disabled}
        className={`w-full mt-6 ${hoverColor} bg-white/20 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Declare Winner
      </button>
    </div>
  );
}

function ScoreControl({
  label,
  value,
  onIncrease,
  onDecrease,
  disabled,
  color,
  icon,
}: {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled: boolean;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onDecrease}
          disabled={disabled || value === 0}
          className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5 mx-auto" />
        </button>
        <button
          onClick={onIncrease}
          disabled={disabled}
          className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>
  );
}
