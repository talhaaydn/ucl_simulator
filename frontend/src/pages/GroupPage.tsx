import { FC, useEffect, useState } from 'react';
import { Fixture, Group, Game } from '../types/response.types';
import { getActiveFixture, getFixtureGroups, getFixtureGames, playActiveWeek, playAllWeeks, resetFixture } from '../api/services/fixtureService';
import GroupTable from '../components/GroupTable';
import GameList from '../components/GameList';
import { WEEKS } from '../types/constant.types';

const GroupPage: FC = () => {
    const [fixture, setFixture] = useState<Fixture|null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<string>(WEEKS[0]);

    useEffect(() => {
      fetchFixture();
    }, []);

    const fetchFixture = async () => {
        try {
            const fixture = await getActiveFixture();
            setFixture(fixture);

            if (fixture) {
                fetchFixtureGroups(fixture.id);   
                fetchFixtureGames(fixture.id);

                setSelectedWeek(`Week ${fixture.activeWeek}`);
            }
        } catch (error) {
            console.error('Error occurred while fetching fixture:', error);
        }
    };

    const fetchFixtureGroups = async (fixtureId: number) => {
        try {
            const groups = await getFixtureGroups(fixtureId);
            setGroups(groups);
        } catch (error) {
            console.error('Error occurred while fetching groups:', error);
        }
    };

    const fetchFixtureGames = async (fixtureId: number) => {
        try {
            const games = await getFixtureGames(fixtureId);
            setGames(games);
        } catch (error) {
            console.error('Error occurred while fetching games:', error);
        }
    };

    const handlePlayActiveWeek = async () => {
        if (!fixture) return;
        
        try {
            await playActiveWeek(fixture.id);

            await fetchFixture();
        } catch (error) {
            console.error('Error occurred while playing active week:', error);
        }
    };

    const handlePlayAllWeeks = async () => {
        if (!fixture) return;
        
        try {
            await playAllWeeks(fixture.id);

            await fetchFixture();
        } catch (error) {
            console.error('Error occurred while playing all weeks:', error);
        }
    };

    const handleResetFixture = async () => {
        if (!fixture) return;
        
        try {
            await resetFixture(fixture.id);

            window.location.reload();
        } catch (error) {
            console.error('Error occurred while resetting fixture:', error);
        }
    };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#0a0a61] pb-8">
        <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="text-white font-bold text-2xl tracking-wide flex items-center gap-2">
              <img src="https://img.uefa.com/imgml/uefacom/ucl/2024/logos/logotype_dark.svg" alt="UCL Logo" className="h-12 w-auto" />
            </div>
          </div>
          <div className="flex gap-3 mt-2 md:mt-0">
            {!fixture?.isCompleted && (
              <>
                <button 
                  onClick={handlePlayActiveWeek}
                  className="px-5 py-2 rounded-md font-semibold transition-colors bg-[#00eeff] hover:bg-[#00d4e6] cursor-pointer"
                >
                  Play Week {fixture?.activeWeek}
                </button>
                <button 
                  onClick={handlePlayAllWeeks}
                  className="px-5 py-2 rounded-md font-semibold transition-colors bg-[#00eeff] hover:bg-[#00d4e6] cursor-pointer"
                >
                  Play All Weeks
                </button>
              </>
            )}
            <button 
              onClick={handleResetFixture}
              className="px-5 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors cursor-pointer"
            >
              Reset Tournament
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 flex flex-col gap-4">
            {groups.map((group) => (
              <GroupTable key={group.id} group={group} />
            ))}
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
            {games.length > 0 && (
              <GameList 
                games={games} 
                selectedWeek={selectedWeek} 
                onWeekChange={setSelectedWeek}
              />
            )}
          </div>
      </div>
    </div>
  );
};

export default GroupPage; 