import HomePage from './pages/HomePage';
import { Fixture } from './types/response.types';
import { useEffect, useState } from 'react';
import { getActiveFixture } from './api/services/fixtureService';
import GroupPage from './pages/GroupPage';

function App() {
  const [fixture, setFixture] = useState<Fixture|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixture();
  }, []);

  const fetchFixture = async () => {
    setLoading(true);
		try {
			const fixture = await getActiveFixture();
			setFixture(fixture);
		} catch (error) {
			console.error('Error occurred while fetching fixture:', error);
		} finally {
			setLoading(false);
		}
	};
  
  return (
    <div>
      {!loading && fixture === null && <HomePage />}
      {!loading && fixture !== null && <GroupPage />}
    </div>
  );
}

export default App;
