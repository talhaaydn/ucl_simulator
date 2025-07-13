import React from 'react';
import { Game } from '../types/response.types';
import { WEEKS } from '../types/constant.types';

interface GameListProps {
  games: Game[];
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, selectedWeek, onWeekChange }) => {
    const gamesByWeek = games.reduce((acc, game) => {
        const weekKey = `Week ${game.week}`;
        if (!acc[weekKey]) {
            acc[weekKey] = [];
        }
        acc[weekKey].push(game);
        return acc;
    }, {} as Record<string, Game[]>);

    const selectedWeekGames = gamesByWeek[selectedWeek] || [];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="mb-6 border-b border-gray-200">
                <div className="flex gap-8 overflow-x-auto">
                {WEEKS.map((week) => (
                    <button
                    key={week}
                    className={`px-1 py-3 font-semibold text-sm transition-all border-b-2 ${
                        selectedWeek === week 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => onWeekChange(week)}
                    >
                    {week}
                    </button>
                ))}
                </div>
            </div>
            <div className="flex flex-col gap-6">
                {selectedWeekGames.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No matches found for this week.
                </div>
                ) : (
                selectedWeekGames.map((game) => (
                    <div key={game.id} className="bg-gray-50 rounded-xl shadow p-3 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                        <img 
                            src={game.homeTeam?.logo} 
                            className="w-8 h-8 rounded-full"
                            alt={game.homeTeam?.name}
                        />
                        <span className="text-sm font-bold text-gray-700">
                            {game.homeTeam?.name}
                        </span>
                        </div>
                        <div className="text-lg font-bold text-blue-700 w-20 text-center">
                        {game.isPlayed ? `${game.homeScore || 0} - ${game.awayScore || 0}` : 'vs'}
                        </div>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-bold text-gray-700">
                            {game.awayTeam?.name || 'Away Team'}
                        </span>
                        <img 
                            src={game.awayTeam?.logo || "https://ssl.gstatic.com/onebox/media/sports/logos/-_cmntP5q_pHL7g5LfkRiw_48x48.png"} 
                            className="w-8 h-8 rounded-full"
                            alt={game.awayTeam?.name || 'Away Team'}
                        />
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );
};

export default GameList; 