export default function PoliticianPodium() {
    const data = [
      { name: 'Olaf Scholz', position: 1 },
      { name: 'Annalena Baerbock', position: 2 },
      { name: 'Christian Lindner', position: 3 },
      { name: 'Friedrich Merz', position: 4 },
      { name: 'Sahra Wagenknecht', position: 5 }
    ];
  
    return (
      <div className="flex items-end justify-center gap-4 h-60">
        {data.map((person, index) => (
          <div
            key={person.name}
            className={`bg-blue-500 text-white text-center w-20 rounded-md flex flex-col justify-end`}
            style={{ height: `${150 - index * 20}px` }} 
          >
            <div className="p-2">{person.name}</div>
            <div className="bg-gray-800 p-2">{person.position}</div>
          </div>
        ))}
      </div>
    );
  }
  