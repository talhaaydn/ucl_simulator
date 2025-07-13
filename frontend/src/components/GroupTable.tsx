import React from 'react';
import { Group } from '../types/response.types';

interface GroupTableProps {
  group: Group;
}

const GroupTable: React.FC<GroupTableProps> = ({ group }) => {
  // Takımları puanlarına göre sırala (azalan sırada)
  const sortedTeams = [...group.teams].sort((a, b) => {
    const pointsA = a.standings?.[0]?.points || 0;
    const pointsB = b.standings?.[0]?.points || 0;
    
    // Önce puanlara göre sırala
    if (pointsA !== pointsB) {
      return pointsB - pointsA;
    }
    
    // Puanlar eşitse gol farkına göre sırala
    const goalDiffA = (a.standings?.[0]?.goals_for || 0) - (a.standings?.[0]?.goals_against || 0);
    const goalDiffB = (b.standings?.[0]?.goals_for || 0) - (b.standings?.[0]?.goals_against || 0);
    
    if (goalDiffA !== goalDiffB) {
      return goalDiffB - goalDiffA;
    }
    
    // Gol farkı da eşitse atılan gol sayısına göre sırala
    const goalsForA = a.standings?.[0]?.goals_for || 0;
    const goalsForB = b.standings?.[0]?.goals_for || 0;
    
    return goalsForB - goalsForA;
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6" key={group.id}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">{group.name}</h2>
      <table className="w-full text-gray-700 text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-500">
            <th className="py-2 text-left">#</th>
            <th className="py-2 text-left">Team</th>
            <th className="py-2">Played</th>
            <th className="py-2">Won</th>
            <th className="py-2">Drawn</th>
            <th className="py-2">Lost</th>
            <th className="py-2">For</th>
            <th className="py-2">Against</th>
            <th className="py-2">GD</th>
            <th className="py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, teamIndex) => (
            <tr
              key={team.id}
              className={`transition-all ${teamIndex === 0 || teamIndex === 1 ? 'border-l-4 border-blue-600 bg-blue-50/40' : ''}`}
            >
              <td className="py-2 text-center font-bold text-gray-500">{teamIndex + 1}</td>
              <td className="py-2 flex items-center gap-2 font-semibold">
                <img src={team.logo} className="w-6 h-6" />
                {team.name}
              </td>
              <td className="text-center">{team.standings?.[0]?.played || 0}</td>
              <td className="text-center">{team.standings?.[0]?.won || 0}</td>
              <td className="text-center">{team.standings?.[0]?.draw || 0}</td>
              <td className="text-center">{team.standings?.[0]?.lost || 0}</td>
              <td className="text-center">{team.standings?.[0]?.goals_for || 0}</td>
              <td className="text-center">{team.standings?.[0]?.goals_against || 0}</td>
              <td className="text-center">{team.standings?.[0]?.goals_for - team.standings?.[0]?.goals_against || 0}</td>
              <td className="text-center font-bold">{team.standings?.[0]?.points || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupTable; 