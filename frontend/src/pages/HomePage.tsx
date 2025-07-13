import { FC, useEffect, useState } from 'react';
import { getAllTeams } from '../api/services/teamService';
import { createFixture } from '../api/services/fixtureService';
import { Team } from '../types/response.types';

const HomePage: FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
		try {
			const teams = await getAllTeams();
			setTeams(teams);
		} catch (error) {
			console.error('Error occurred while fetching teams:', error);
		} finally {
			setLoading(false);
		}
	};

  const createFixtureHandle = async () => {
    setLoading(true);
		try {
			const response = await createFixture();
			if (response.success) {
        window.location.reload();
      }
		} catch (error) {
			console.error('Error occurred while fetching teams:', error);
		} finally {
			setLoading(false);
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
        </div>
      </div>

      <main className="flex flex-col items-center min-h-[70vh]">
        <section className="w-full max-w-7xl px-4 mt-8">
          {loading && (
            <div className="text-center text-lg text-gray-600 py-10">Yükleniyor...</div>
          )}
          {!loading && (
            <div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 justify-items-center">
                {teams.map((team) => (
                  <div
                    className="flex flex-col items-center p-2 text-gray-800 text-center"
                    key={team.id}
                  >
                    <img src={team.logo} alt={team.name} className="w-14 h-14 mb-2 object-contain" />
                    <span className="font-medium text-sm">{team.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center my-8">
                <button 
                  className={`px-7 py-3 rounded-md text-lg font-semibold ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#00eeff] hover:bg-[#00d4e6]'
                  }`} 
                  onClick={createFixtureHandle}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Fixture'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage; 