# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)











import { FC, useMemo, useState } from 'react';
import { Team } from '../types/response.types';

// const teams: Team[] = [
//   { id: 1, name: 'Real Madrid' },
//   { id: 2, name: 'Manchester City' },
//   { id: 3, name: 'Bayern Munich' },
//   { id: 4, name: 'Paris Saint-Germain' },
//   { id: 5, name: 'Liverpool' },
//   { id: 6, name: 'Barcelona' },
//   { id: 7, name: 'Chelsea' },
//   { id: 8, name: 'Juventus' },
//   { id: 9, name: 'Atletico Madrid' },
//   { id: 10, name: 'Borussia Dortmund' },
//   { id: 11, name: 'Inter Milan' },
//   { id: 12, name: 'AC Milan' },
//   { id: 13, name: 'Ajax' },
//   { id: 14, name: 'Porto' },
//   { id: 15, name: 'Benfica' },
//   { id: 16, name: 'Tottenham' },
// ];

const teamLogos: Record<string, string> = {
  'Real Madrid': '⚪️',
  'Manchester City': '🔵',
  'Bayern Munich': '🔴',
  'Paris Saint-Germain': '🔵',
  'Liverpool': '🔴',
  'Barcelona': '🔵',
  'Chelsea': '🔵',
  'Juventus': '⚫️',
  'Atletico Madrid': '🔴',
  'Borussia Dortmund': '🟡',
  'Inter Milan': '🔵',
  'AC Milan': '⚫️',
  'Ajax': '⚪️',
  'Porto': '🔵',
  'Benfica': '🔴',
  'Tottenham': '⚪️',
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const STAGES = [
  { key: 'groups', label: 'Gruplar' },
  { key: 'round16', label: 'Son 16' },
  { key: 'quarter', label: 'Çeyrek Final' },
  { key: 'semi', label: 'Yarı Final' },
  { key: 'final', label: 'Final' },
];

type StageKey = 'groups' | 'round16' | 'quarter' | 'semi' | 'final';

const WEEKS = [
  '1. Hafta',
  '2. Hafta',
  '3. Hafta',
  '4. Hafta',
  '5. Hafta',
  '6. Hafta',
];

// UEFA tarzı grup stats fake data
type GroupStats = {
  team: Team;
  played: number;
  win: number;
  draw: number;
  loss: number;
  for: number;
  against: number;
  gd: number;
  points: number;
  form: ('W'|'L'|'D')[];
  qualified?: boolean;
};

const fakeStats = (group: Team[]): GroupStats[] => {
  return group.map((team, i) => {
    const played = 6;
    const win = Math.floor(Math.random()*6);
    const draw = Math.floor(Math.random()*(6-win));
    const loss = played - win - draw;
    const forGoals = Math.floor(Math.random()*15)+3;
    const against = Math.floor(Math.random()*15)+3;
    const gd = forGoals - against;
    const points = win*3 + draw;
    const form = Array.from({length: 5}, () => ['W','L','D'][Math.floor(Math.random()*3)]) as ('W'|'L'|'D')[];
    return {
      team,
      played,
      win,
      draw,
      loss,
      for: forGoals,
      against,
      gd,
      points,
      form,
      qualified: i < 2 // ilk 2 qualified
    };
  }).sort((a, b) => b.points - a.points || b.gd - a.gd);
};

const fakeMatches = (group: Team[], week: number) => [
  { home: group[0], away: group[1], homeScore: Math.floor(Math.random()*4), awayScore: Math.floor(Math.random()*4) },
  { home: group[2], away: group[3], homeScore: Math.floor(Math.random()*4), awayScore: Math.floor(Math.random()*4) },
];

const fakePredictions = (group: Team[]) =>
  group.map((team) => ({
    team,
    chance: Math.floor(Math.random() * 60) + 20,
  }));

const GroupPage: FC = () => {
  const groups = useMemo(() => {
    const shuffled = shuffle(teams);
    return [
      shuffled.slice(0, 4),
      shuffled.slice(4, 8),
      shuffled.slice(8, 12),
      shuffled.slice(12, 16),
    ];
  }, []);
  const [stage, setStage] = useState<StageKey>('groups');
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const group = groups[selectedGroup];
  const stats = useMemo(() => fakeStats(group), [group]);
  const matches = useMemo(() => fakeMatches(group, selectedWeek), [group, selectedWeek]);
  const predictions = useMemo(() => fakePredictions(group), [group]);
  const statsAll = useMemo(() => groups.map(g => fakeStats(g)), [groups]);
  const predictionsAll = useMemo(() => groups.map(g => fakePredictions(g)), [groups]);
  const matchesAll = useMemo(() => groups.map(g => fakeMatches(g, selectedWeek)), [groups, selectedWeek]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst Bar ve Sekmeler */}
      <div className="bg-[#0a0a61] pb-8">
        <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="text-white font-bold text-2xl tracking-wide flex items-center gap-2">
              <img src="https://img.uefa.com/imgml/uefacom/ucl/2024/logos/logotype_dark.svg" alt="UCL Logo" className="h-12 w-auto" />
            </div>
          </div>
          {/* Butonlar alanı */}
          <div className="flex gap-3 mt-2 md:mt-0">
            <button className="px-5 py-2 bg-[#00eeff] rounded-md font-semibold">
              Play Week 1
            </button>
            <button className="px-5 py-2 bg-[#00eeff] rounded-md font-semibold ">
              Play All Weeks
            </button>
            <button className="px-5 py-2 bg-red-500 text-white rounded-md font-semibold">
              Reset Tournament
            </button>
          </div>
        </div>
      </div>
      {/* Hafta seçici */}
      {/* <div className="max-w-7xl mx-auto px-4 mt-8 flex gap-2 overflow-x-auto">
        {WEEKS.map((w, idx) => (
          <button
            key={w}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all border border-blue-300/30 ${selectedWeek === idx ? 'bg-white text-blue-700' : 'bg-blue-800 text-white hover:bg-blue-600'}`}
            onClick={() => setSelectedWeek(idx)}
          >
            {w}
          </button>
        ))}
      </div> */}
      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tüm Gruplar Alt Alta */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Group {String.fromCharCode(65 + gIdx)}</h2>
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
                  {statsAll[gIdx].map((row, idx) => (
                    <tr
                      key={row.team.id}
                      className={`transition-all ${idx === 0 || idx === 1 ? 'border-l-4 border-blue-600 bg-blue-50/40' : ''}`}
                    >
                      <td className="py-2 text-center font-bold text-gray-500">{idx+1}</td>
                      <td className="py-2 flex items-center gap-2 font-semibold">
                        {/* <span className="text-xl">{teamLogos[row.team.name] || '⚽️'}</span> */}
                        <img src={"https://ssl.gstatic.com/onebox/media/sports/logos/-_cmntP5q_pHL7g5LfkRiw_48x48.png"} className="w-6 h-6" />
                        {row.team.name}
                      </td>
                      <td className="text-center">{row.played}</td>
                      <td className="text-center">{row.win}</td>
                      <td className="text-center">{row.draw}</td>
                      <td className="text-center">{row.loss}</td>
                      <td className="text-center">{row.for}</td>
                      <td className="text-center">{row.against}</td>
                      <td className="text-center">{row.gd}</td>
                      <td className="text-center font-bold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        {/* Sağda: Haftanın Tüm Maçları ve Prediction */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Prediction kartı */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Championship Prediction</h3>
            <table className="w-full text-gray-700 text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-1 text-left">Takım</th>
                  <th className="py-1 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {predictionsAll[0].map((row) => (
                  <tr key={row.team.id} className="border-b border-gray-100">
                    <td className="py-1">{row.team.name}</td>
                    <td className="py-1 text-right font-bold">{row.chance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hafta seçici sağ sütunda */}
          <div className="mb-2 flex gap-2 overflow-x-auto">
            {WEEKS.map((w, idx) => (
              <button
                key={w}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${selectedWeek === idx ? 'bg-white text-blue-700' : 'bg-blue-800 text-white hover:bg-blue-600'}`}
                onClick={() => setSelectedWeek(idx)}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{WEEKS[selectedWeek]} Maçları</h3>
            <div className="flex flex-col gap-6">
              {groups.map((group, gIdx) => (
                <div key={gIdx}>
                  <div className="font-semibold text-blue-700 mb-2">Group {String.fromCharCode(65 + gIdx)}</div>
                  <div className="flex flex-col gap-3">
                    {matchesAll[gIdx].map((m, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-700 flex-1 text-left">
                            {/* {teamLogos[m.home.name]}  */}
                            {m.home.name}
                          </span>
                          <span className="text-lg font-bold text-blue-700 w-16 text-center">{m.homeScore} - {m.awayScore}</span>
                          <span className="text-sm font-bold text-gray-700 flex-1 text-right">
                            {m.away.name} 
                            {/* {teamLogos[m.away.name]} */}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage; 